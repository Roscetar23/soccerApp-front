# Design Document: auth-login

## Overview

Este documento describe el diseño técnico para integrar autenticación OAuth en SoccerFront usando **NextAuth.js v5 (Auth.js)**. El flujo completo es:

```
/ (CTAButton) → /login → OAuth Provider (Google | GitHub) → /onboarding → /navegacion
```

Las rutas `/onboarding` y `/navegacion` quedan protegidas por middleware. Usuarios no autenticados son redirigidos a `/login` automáticamente. La sesión es accesible tanto en Server Components (via `auth()`) como en Client Components (via `SessionProvider` + `useSession`).

**Stack relevante:**
- Next.js 16 App Router + TypeScript
- next-auth@beta (v5 / Auth.js) — a instalar
- Providers: Google OAuth, GitHub OAuth
- Tema visual: slate/emerald oscuro (Tailwind CSS)

---

## Architecture

```mermaid
flowchart TD
    A[Usuario en /] -->|click CTAButton| B[/login]
    B -->|no autenticado| C{Elegir Provider}
    C -->|Google| D[Google OAuth]
    C -->|GitHub| E[GitHub OAuth]
    D -->|callback| F[/api/auth/callback/google]
    E -->|callback| F2[/api/auth/callback/github]
    F --> G[/onboarding]
    F2 --> G
    G --> H[/navegacion]

    M[Middleware] -->|request a /onboarding o /navegacion/*| N{¿Sesión activa?}
    N -->|No| B
    N -->|Sí| O[Permitir acceso]
```

**Flujo de autenticación:**
1. `auth.ts` — configuración central: providers, secret, callbacks
2. `app/api/auth/[...nextauth]/route.ts` — expone los handlers HTTP de NextAuth
3. `middleware.ts` — intercepta rutas protegidas y verifica sesión
4. `app/login/page.tsx` — UI con botones de provider
5. `app/layout.tsx` — `SessionProvider` para Client Components

---

## Components and Interfaces

### `auth.ts` (raíz del proyecto)

Configuración central exportada por Auth.js v5:

```typescript
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
```

Exports:
- `handlers` — `{ GET, POST }` para la route handler
- `auth` — función para obtener sesión en Server Components
- `signIn` / `signOut` — acciones de servidor

### `app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

### `middleware.ts`

```typescript
import { auth } from '@/auth';

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/onboarding', '/navegacion/:path*'],
};
```

El `matcher` limita la ejecución del middleware exclusivamente a las rutas protegidas. Rutas públicas (`/`, `/login`, `/api/auth/*`) no son interceptadas.

### `app/login/page.tsx`

Server Component que verifica sesión y redirige si ya está autenticado. Renderiza dos botones que invocan Server Actions (`signIn`):

```typescript
import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/onboarding');

  return (
    <main>
      <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/onboarding' }); }}>
        <button type="submit">Continuar con Google</button>
      </form>
      <form action={async () => { 'use server'; await signIn('github', { redirectTo: '/onboarding' }); }}>
        <button type="submit">Continuar con GitHub</button>
      </form>
    </main>
  );
}
```

### `app/layout.tsx` (modificación)

Agregar `SessionProvider` de `next-auth/react` para habilitar `useSession` en Client Components:

```typescript
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

### `app/page.tsx` (modificación)

Cambiar el `href` del `CTAButton`:

```diff
- <CTAButton href="/onboarding" label="Ver todos los partidos" />
+ <CTAButton href="/login" label="Ver todos los partidos" />
```

### `.env.local.example`

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_nextauth_secret_min_32_chars
NEXTAUTH_URL=http://localhost:3000
```

---

## Data Models

### Session (NextAuth v5 default)

```typescript
interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string; // ISO date string
}
```

No se requiere base de datos para esta feature. NextAuth v5 usa JWT sessions por defecto (stateless). Si en el futuro se necesita persistir usuarios, se puede agregar un `adapter` (e.g., Prisma, Drizzle).

### Token JWT (interno, firmado con NEXTAUTH_SECRET)

```typescript
interface JWT {
  sub: string;       // user id del provider
  name: string;
  email: string;
  picture: string;
  iat: number;
  exp: number;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Middleware access control

*For any* request to a protected route (`/onboarding` or `/navegacion/*`), the middleware should redirect to `/login` if and only if the request has no active session. Authenticated requests must pass through without redirection.

**Validates: Requirements 3.1, 3.2, 3.3**

---

### Property 2: Middleware does not intercept public routes

*For any* request to a public route (`/`, `/login`, `/api/auth/*`), the middleware should not intercept or redirect the request.

**Validates: Requirements 3.4**

---

### Property 3: Provider button calls signIn with correct provider

*For any* provider in `['google', 'github']`, clicking the corresponding button on the login page should invoke `signIn` with that exact provider identifier and `redirectTo: '/onboarding'`.

**Validates: Requirements 2.2, 2.3, 2.4**

---

### Property 4: Authenticated user on /login is redirected

*For any* active session, accessing `/login` should result in an immediate redirect to `/onboarding` without rendering the login UI.

**Validates: Requirements 2.6, 4.2**

---

## Error Handling

| Escenario | Comportamiento esperado |
|---|---|
| `NEXTAUTH_SECRET` no definida | NextAuth lanza error de configuración al iniciar el servidor |
| Credenciales OAuth inválidas (`GOOGLE_CLIENT_ID` etc.) | El provider rechaza el flujo; NextAuth redirige a `/login?error=Configuration` |
| Usuario cancela el flujo OAuth | NextAuth redirige a `/login?error=OAuthCallback` |
| Token de sesión expirado | Middleware detecta sesión nula y redirige a `/login` |
| Error de red durante callback | NextAuth captura el error y redirige a `/login?error=OAuthSignin` |

La página `/login` puede leer el query param `error` para mostrar mensajes contextuales al usuario (implementación opcional en la UI).

---

## Testing Strategy

### Dual Testing Approach

Se usa una combinación de **unit tests** (ejemplos concretos) y **property-based tests** (propiedades universales).

**Unit tests** — para ejemplos específicos e integración:
- Verificar que `auth.ts` exporta `handlers`, `auth`, `signIn`, `signOut`
- Verificar que `route.ts` exporta `GET` y `POST`
- Verificar que `CTAButton` en `app/page.tsx` apunta a `/login`
- Verificar que `.env.local.example` contiene todas las variables requeridas
- Verificar que `app/layout.tsx` envuelve con `SessionProvider`

**Property-based tests** — para propiedades universales:
- Property 1: Middleware access control (para cualquier ruta protegida × estado de sesión)
- Property 2: Middleware no intercepta rutas públicas (para cualquier ruta pública)
- Property 3: Botón de provider llama signIn con el provider correcto (para cualquier provider)

### Property-Based Testing Library

Para TypeScript/Next.js se usará **[fast-check](https://github.com/dubzzz/fast-check)**.

```bash
npm install --save-dev fast-check
```

### Property Test Configuration

- Mínimo **100 iteraciones** por test de propiedad
- Cada test referencia la propiedad del design doc con el tag:
  `// Feature: auth-login, Property N: <descripción>`

**Ejemplo — Property 1:**

```typescript
// Feature: auth-login, Property 1: Middleware access control
import fc from 'fast-check';

const protectedRoutes = ['/onboarding', '/navegacion', '/navegacion/partidos'];

test('middleware redirects unauthenticated requests to /login', () => {
  fc.assert(
    fc.property(fc.constantFrom(...protectedRoutes), (route) => {
      const result = runMiddleware({ url: route, session: null });
      expect(result.redirectTo).toBe('/login');
    }),
    { numRuns: 100 }
  );
});

test('middleware allows authenticated requests to protected routes', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...protectedRoutes),
      fc.record({ user: fc.record({ email: fc.emailAddress() }) }),
      (route, session) => {
        const result = runMiddleware({ url: route, session });
        expect(result.redirectTo).toBeNull();
      }
    ),
    { numRuns: 100 }
  );
});
```

**Ejemplo — Property 3:**

```typescript
// Feature: auth-login, Property 3: Provider button calls signIn with correct provider
import fc from 'fast-check';

test('each provider button calls signIn with the correct provider id', () => {
  fc.assert(
    fc.property(fc.constantFrom('google', 'github'), (provider) => {
      const mockSignIn = jest.fn();
      renderLoginPage({ signIn: mockSignIn });
      fireEvent.click(screen.getByTestId(`btn-${provider}`));
      expect(mockSignIn).toHaveBeenCalledWith(provider, { redirectTo: '/onboarding' });
    }),
    { numRuns: 100 }
  );
});
```

### Unit Test Coverage Targets

| Módulo | Tipo de test | Qué verifica |
|---|---|---|
| `auth.ts` | Unit | Exports: `handlers`, `auth`, `signIn`, `signOut` |
| `route.ts` | Unit | Exports: `GET`, `POST` |
| `middleware.ts` | Property | Properties 1 y 2 |
| `app/login/page.tsx` | Unit + Property | Render de botones, Property 3, edge case 4 |
| `app/page.tsx` | Unit | `CTAButton` href = `/login` |
| `.env.local.example` | Unit | Contiene las 6 variables requeridas |
