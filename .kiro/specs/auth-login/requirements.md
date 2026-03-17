# Requirements Document

## Introduction

Esta feature agrega autenticación OAuth a la aplicación SoccerFront usando NextAuth.js v5 (Auth.js).
El flujo es: usuario en "/" hace click en "Ver todos los partidos" → si no está autenticado va a /login
→ tras autenticarse va a /onboarding → tras el onboarding va a /navegacion.
Los providers soportados son Google y GitHub.

## Glossary

- **Auth_System**: El sistema de autenticación basado en NextAuth.js v5 (Auth.js)
- **Session**: Objeto que representa la sesión activa de un usuario autenticado
- **Provider**: Servicio OAuth externo (Google o GitHub) que autentica al usuario
- **Middleware**: Función de Next.js que intercepta requests antes de que lleguen a las rutas
- **CTAButton**: Botón de llamada a la acción en la página principal que redirige al flujo de autenticación
- **Onboarding**: Wizard de selección de liga y equipo favorito en /onboarding
- **Protected_Route**: Ruta que requiere sesión activa para ser accedida (/onboarding, /navegacion)

---

## Requirements

### Requirement 1: Configuración de NextAuth.js v5

**User Story:** As a developer, I want to configure NextAuth.js v5 with Google and GitHub providers, so that the application has a working OAuth authentication foundation.

#### Acceptance Criteria

1. THE Auth_System SHALL exportar un handler de NextAuth configurado con Google OAuth y GitHub OAuth como providers.
2. THE Auth_System SHALL leer las credenciales de los providers desde las variables de entorno `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID` y `GITHUB_SECRET`.
3. THE Auth_System SHALL usar `NEXTAUTH_SECRET` como secreto para firmar tokens de sesión.
4. THE Auth_System SHALL exponer el handler en `app/api/auth/[...nextauth]/route.ts` para los métodos GET y POST.
5. IF `NEXTAUTH_SECRET` no está definida en el entorno, THEN THE Auth_System SHALL lanzar un error de configuración al iniciar.

---

### Requirement 2: Página de Login

**User Story:** As an unauthenticated user, I want to see a login page with Google and GitHub buttons, so that I can authenticate using my preferred OAuth provider.

#### Acceptance Criteria

1. THE Auth_System SHALL renderizar la página `/login` con un botón para autenticarse con Google y un botón para autenticarse con GitHub.
2. WHEN el usuario hace click en el botón de Google, THE Auth_System SHALL iniciar el flujo OAuth de Google mediante `signIn('google')`.
3. WHEN el usuario hace click en el botón de GitHub, THE Auth_System SHALL iniciar el flujo OAuth de GitHub mediante `signIn('github')`.
4. WHEN la autenticación OAuth es exitosa, THE Auth_System SHALL redirigir al usuario a `/onboarding`.
5. THE Auth_System SHALL aplicar el tema visual oscuro slate/emerald consistente con el resto de la aplicación en la página `/login`.
6. IF el usuario ya tiene una sesión activa y accede a `/login`, THEN THE Auth_System SHALL redirigir al usuario a `/onboarding`.

---

### Requirement 3: Protección de Rutas con Middleware

**User Story:** As the application, I want to protect /onboarding and /navegacion from unauthenticated access, so that only authenticated users can reach those pages.

#### Acceptance Criteria

1. WHEN un usuario no autenticado intenta acceder a `/onboarding`, THE Middleware SHALL redirigir la request a `/login`.
2. WHEN un usuario no autenticado intenta acceder a `/navegacion` o cualquier subruta de `/navegacion`, THE Middleware SHALL redirigir la request a `/login`.
3. WHEN un usuario autenticado accede a `/onboarding` o `/navegacion`, THE Middleware SHALL permitir el acceso sin redirección.
4. THE Middleware SHALL ejecutarse únicamente sobre las rutas `/onboarding` y `/navegacion/:path*`, sin interceptar rutas públicas como `/`, `/login` o `/api/auth/:path*`.

---

### Requirement 4: Redirección del CTAButton

**User Story:** As an unauthenticated user clicking "Ver todos los partidos", I want to be redirected to the login page, so that I can authenticate before acceder al contenido protegido.

#### Acceptance Criteria

1. THE CTAButton en `app/page.tsx` SHALL apuntar a `/login` en lugar de `/onboarding`.
2. WHEN un usuario autenticado es redirigido a `/login`, THE Auth_System SHALL redirigirlo automáticamente a `/onboarding` sin mostrar la pantalla de login.

---

### Requirement 5: Variables de Entorno

**User Story:** As a developer, I want a documented set of required environment variables, so that I can configure the OAuth providers correctly in any environment.

#### Acceptance Criteria

1. THE Auth_System SHALL requerir las siguientes variables de entorno para funcionar: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL`.
2. THE Auth_System SHALL incluir un archivo `.env.local.example` con los nombres de todas las variables requeridas y valores de placeholder, sin exponer credenciales reales.

---

### Requirement 6: Acceso a la Sesión en Componentes

**User Story:** As a developer, I want to access the current session in both server and client components, so that I can conditionally render UI based on authentication state.

#### Acceptance Criteria

1. THE Auth_System SHALL exponer una función `auth()` utilizable en Server Components para obtener la sesión activa.
2. WHERE la aplicación requiera acceso a la sesión en Client Components, THE Auth_System SHALL proveer un `SessionProvider` que envuelva el árbol de componentes necesario.
3. WHEN la sesión es nula en un Server Component de una ruta protegida, THE Auth_System SHALL delegar la redirección al Middleware antes de que el componente se renderice.
