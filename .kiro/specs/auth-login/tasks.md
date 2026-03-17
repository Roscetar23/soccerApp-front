# Implementation Plan: auth-login

## Overview

Integrar autenticación OAuth con NextAuth.js v5 (Auth.js) en SoccerFront. El flujo completo es: `/` → `/login` → OAuth (Google | GitHub) → `/onboarding` → `/navegacion`. Las rutas protegidas son interceptadas por middleware.

## Tasks

- [ ] 1. Instalar dependencias y documentar variables de entorno
  - [x] 1.1 Instalar next-auth@beta y fast-check
    - Ejecutar `npm install next-auth@beta` y `npm install --save-dev fast-check`
    - _Requirements: 1.1_
  - [x] 1.2 Crear `.env.local.example` con las 6 variables requeridas
    - Incluir `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` con valores placeholder
    - _Requirements: 5.1, 5.2_

- [ ] 2. Configurar NextAuth — `auth.ts` y route handler
  - [x] 2.1 Crear `auth.ts` en la raíz del proyecto
    - Exportar `handlers`, `auth`, `signIn`, `signOut` usando `NextAuth({ providers: [Google, GitHub], pages: { signIn: '/login' }, callbacks: { authorized } })`
    - _Requirements: 1.1, 1.2, 1.3, 6.1_
  - [x] 2.2 Crear `app/api/auth/[...nextauth]/route.ts`
    - Re-exportar `GET` y `POST` desde `@/auth`
    - _Requirements: 1.4_
  - [ ]* 2.3 Escribir unit tests para `auth.ts` y `route.ts`
    - Verificar que `auth.ts` exporta `handlers`, `auth`, `signIn`, `signOut`
    - Verificar que `route.ts` exporta `GET` y `POST`
    - _Requirements: 1.1, 1.4_

- [ ] 3. Implementar middleware de protección de rutas
  - [x] 3.1 Crear `middleware.ts` en la raíz del proyecto
    - Usar `auth` de `@/auth` como middleware; redirigir a `/login` si `!req.auth`
    - Configurar `matcher: ['/onboarding', '/navegacion/:path*']`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 3.2 Escribir property test para Property 1: Middleware access control
    - **Property 1: Middleware access control**
    - Para cualquier ruta protegida × estado de sesión, verificar redirección correcta
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - `// Feature: auth-login, Property 1: Middleware access control`
  - [ ]* 3.3 Escribir property test para Property 2: Middleware no intercepta rutas públicas
    - **Property 2: Middleware does not intercept public routes**
    - Para cualquier ruta pública (`/`, `/login`, `/api/auth/*`), verificar que no hay redirección
    - **Validates: Requirements 3.4**
    - `// Feature: auth-login, Property 2: Middleware does not intercept public routes`

- [x] 4. Checkpoint — Verificar configuración base
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Crear página de login `app/login/page.tsx`
  - [x] 5.1 Implementar `LoginPage` como Server Component
    - Verificar sesión con `auth()`; si existe, `redirect('/onboarding')`
    - Renderizar dos `<form>` con Server Actions que llamen `signIn('google', { redirectTo: '/onboarding' })` y `signIn('github', { redirectTo: '/onboarding' })`
    - Aplicar tema oscuro slate/emerald consistente con el resto de la app
    - Agregar `data-testid="btn-google"` y `data-testid="btn-github"` a los botones
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ]* 5.2 Escribir property test para Property 3: Provider button calls signIn con provider correcto
    - **Property 3: Provider button calls signIn with correct provider**
    - Para cualquier provider en `['google', 'github']`, verificar que el botón llama `signIn` con ese provider y `redirectTo: '/onboarding'`
    - **Validates: Requirements 2.2, 2.3, 2.4**
    - `// Feature: auth-login, Property 3: Provider button calls signIn with correct provider`
  - [ ]* 5.3 Escribir property test para Property 4: Usuario autenticado en /login es redirigido
    - **Property 4: Authenticated user on /login is redirected**
    - Para cualquier sesión activa, verificar que `/login` redirige a `/onboarding`
    - **Validates: Requirements 2.6, 4.2**
    - `// Feature: auth-login, Property 4: Authenticated user on /login is redirected`

- [ ] 6. Integrar SessionProvider y actualizar CTAButton
  - [x] 6.1 Modificar `app/layout.tsx` para envolver con `SessionProvider`
    - Importar `SessionProvider` de `next-auth/react` y envolver `{children}`
    - _Requirements: 6.2_
  - [x] 6.2 Modificar `app/page.tsx` — cambiar `CTAButton` href de `/onboarding` a `/login`
    - _Requirements: 4.1_
  - [ ]* 6.3 Escribir unit test para `app/page.tsx`
    - Verificar que `CTAButton` tiene `href="/login"`
    - _Requirements: 4.1_
  - [ ]* 6.4 Escribir unit test para `app/layout.tsx`
    - Verificar que el árbol de componentes está envuelto con `SessionProvider`
    - _Requirements: 6.2_

- [x] 7. Checkpoint final — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada task referencia los requisitos específicos para trazabilidad
- Los property tests usan `fast-check` con mínimo 100 iteraciones por propiedad
- NextAuth v5 usa JWT sessions por defecto (stateless) — no se requiere base de datos
