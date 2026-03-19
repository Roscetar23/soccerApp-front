# Implementation Plan: auth-credentials

## Overview

Reemplazar OAuth (Google + GitHub) por autenticación con usuario y contraseña usando `CredentialsProvider` de NextAuth v5. Implica actualizar `auth.ts`, reemplazar `app/login/page.tsx` con un formulario cliente, y crear `app/admin/register/page.tsx`.

## Tasks

- [x] 1. Actualizar `auth.ts` con CredentialsProvider y callbacks
  - [x] 1.1 Reemplazar providers Google/GitHub por `CredentialsProvider`
    - Eliminar imports de `next-auth/providers/google` y `next-auth/providers/github`
    - Añadir `CredentialsProvider` que llama a `POST ${NEXT_PUBLIC_API_URL}/auth/login` con `{ username, password }`
    - Retornar `{ id }` si el backend responde con éxito, `null` si falla o lanza excepción
    - Añadir callbacks `jwt` (propaga `token.id = user.id`) y `session` (propaga `session.user.id = token.id`)
    - Extender tipos de NextAuth para incluir `id` en `Session` y `JWT`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1_

  - [ ]* 1.2 Escribir property test: authorize retorna usuario con id en éxito
    - **Property 1: authorize retorna usuario con id cuando el backend responde con éxito**
    - Usar `fc.asyncProperty` con `username`, `password` e `id` arbitrarios
    - Mockear `fetch` para devolver `{ ok: true, json: () => ({ id }) }`
    - Verificar que `result !== null && result.id === id`
    - **Validates: Requirements 1.3, 2.2, 2.3**

  - [ ]* 1.3 Escribir property test: authorize retorna null cuando el backend falla
    - **Property 2: authorize retorna null cuando el backend falla**
    - Usar `fc.asyncProperty` con `username`, `password` y `status` en rango 400–599
    - Mockear `fetch` para devolver `{ ok: false, status }`
    - Verificar que `result === null`
    - **Validates: Requirements 2.4**

  - [ ]* 1.4 Escribir property test: session incluye el id del usuario
    - **Property 3: La sesión incluye el id del usuario**
    - Usar `fc.property` con `id` arbitrario
    - Llamar directamente al callback `session` con `token = { id }`
    - Verificar que `session.user.id === id`
    - **Validates: Requirements 2.5**

- [x] 2. Reemplazar `app/login/page.tsx` con formulario de credenciales
  - [x] 2.1 Convertir LoginPage a componente cliente con formulario username/password
    - Añadir `'use client'` y eliminar lógica server-side de OAuth
    - Mantener la redirección a `/onboarding` si hay sesión activa (usando `useSession` o `auth()` según aplique)
    - Añadir `useState` para `{ username, password, error, isPending }`
    - `handleSubmit` llama a `signIn('credentials', { username, password, redirectTo: '/onboarding' })`
    - Si `signIn` retorna error, mostrar mensaje descriptivo sin recargar
    - Deshabilitar botón y mostrar `<Spinner />` mientras `isPending === true`
    - Eliminar botones de Google y GitHub
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 4.2_

  - [ ]* 2.2 Escribir unit tests para LoginPage
    - Renderiza campos `username` y `password` (Req 1.1)
    - No renderiza botones de Google ni GitHub (Req 4.2)
    - Deshabilita botón y muestra spinner durante submit (Req 1.5)
    - Muestra mensaje de error cuando `signIn` falla (Req 1.4)
    - _Requirements: 1.1, 1.4, 1.5, 4.2_

- [x] 3. Checkpoint — Verificar auth.ts y LoginPage
  - Asegurarse de que el login con credenciales funciona end-to-end en local.
  - Ejecutar los tests existentes y los nuevos. Preguntar al usuario si hay dudas.

- [x] 4. Crear `app/admin/register/page.tsx` con RegisterForm
  - [x] 4.1 Crear la página de registro en el área de admin
    - Crear `app/admin/register/page.tsx` como componente cliente (`'use client'`)
    - Añadir `useState` para `{ username, password, error, success, isPending }`
    - `handleSubmit` llama a `fetch(`${NEXT_PUBLIC_API_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ username, password }) })`
    - Si respuesta ok: `setSuccess(true)` y limpiar campos
    - Si error: `setError(mensaje)` sin limpiar campos
    - Deshabilitar botón y mostrar `<Spinner />` mientras `isPending === true`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 4.2 Escribir property test: registerUser envía el payload correcto
    - **Property 4: registerUser llama al endpoint con los credentials correctos**
    - Usar `fc.asyncProperty` con `username` y `password` arbitrarios
    - Capturar la llamada a `fetch` y verificar que el body JSON contiene exactamente `{ username, password }`
    - Verificar que la URL es `${NEXT_PUBLIC_API_URL}/auth/register` y el método es `POST`
    - **Validates: Requirements 3.3**

  - [ ]* 4.3 Escribir unit tests para RegisterForm
    - Renderiza campos `username` y `password` (Req 3.2)
    - Muestra mensaje de éxito y limpia campos tras registro exitoso (Req 3.4)
    - Muestra error sin limpiar campos cuando el backend falla (Req 3.5)
    - Deshabilita botón durante submit (Req 3.6)
    - _Requirements: 3.2, 3.4, 3.5, 3.6_

- [x] 5. Añadir enlace a `/admin/register` desde el área de admin
  - Añadir un `<Link href="/admin/register">` en `app/admin/page.tsx` junto a los demás accesos del panel
  - _Requirements: 3.1_

- [x] 6. Checkpoint final — Asegurarse de que todos los tests pasan
  - Ejecutar todos los tests. Verificar que `middleware.ts` no fue modificado.
  - Preguntar al usuario si hay dudas antes de cerrar.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- `middleware.ts` NO debe modificarse en ningún momento
- Los property tests usan `fast-check` (`fc`) que ya está en `devDependencies`
- Los callbacks `jwt` y `session` son necesarios para que `session.user.id` esté disponible en el cliente
