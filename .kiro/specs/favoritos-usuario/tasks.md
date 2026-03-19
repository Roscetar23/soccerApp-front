# Implementation Plan: favoritos-usuario

## Overview

Añadir verificación de favorito existente al flujo de onboarding: nueva función `getFavoritos()` y clase `ApiError` en `lib/api.ts`, y modificaciones al componente `OnboardingWizard` para verificar al montar y manejar errores de duplicado.

## Tasks

- [x] 1. Añadir `ApiError` y `getFavoritos()` en `lib/api.ts`
  - [x] 1.1 Crear la clase `ApiError` con `status: number` y `message: string`
    - Exportar la clase desde `lib/api.ts`
    - `ApiError` extiende `Error` y asigna `this.name = 'ApiError'`
    - _Requirements: 2.3, 2.4_

  - [x] 1.2 Modificar `saveFavorito` para lanzar `ApiError` en lugar de `Error` genérico
    - Capturar el status HTTP de la respuesta y lanzar `new ApiError(response.status, ...)`
    - _Requirements: 2.3, 2.4_

  - [ ]* 1.3 Escribir property test para `saveFavorito` lanza `ApiError` con status correcto
    - **Property 8 (parcial): getFavoritos retorna array o lanza error según respuesta HTTP**
    - **Validates: Requirements 3.3**
    - Para cualquier status HTTP de error (400–599), `saveFavorito` debe lanzar `ApiError` con ese status

  - [x] 1.4 Implementar `getFavoritos(): Promise<Favorito[]>`
    - Hacer `fetch` a `${BACKEND_URL}/favoritos` con `cache: 'no-store'`
    - Si la respuesta es exitosa, retornar `response.json()`
    - Si la respuesta no es exitosa, lanzar `Error` con mensaje descriptivo
    - Definir el tipo `Favorito` (inline o en `types/api.types.ts`)
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 1.5 Escribir property test para `getFavoritos` round-trip
    - **Property 8: getFavoritos retorna array o lanza error según respuesta HTTP**
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - Para cualquier `Favorito[]`, si el fetch mock retorna status 200 con ese array, `getFavoritos()` retorna exactamente ese array
    - Para cualquier status HTTP de error (400–599), `getFavoritos()` lanza un `Error`

- [x] 2. Checkpoint — Verificar que `lib/api.ts` compila sin errores
  - Asegurarse de que todos los tests pasan. Consultar al usuario si hay dudas.

- [x] 3. Modificar `OnboardingWizard` en `app/onboarding/page.tsx`
  - [x] 3.1 Añadir estado `checkingFavorito` e importar `getFavoritos` y `ApiError`
    - Añadir `const [checkingFavorito, setCheckingFavorito] = useState(true)` (estado inicial `true`)
    - Importar `getFavoritos` y `ApiError` desde `@/lib/api`
    - _Requirements: 1.2_

  - [ ]* 3.2 Escribir property test: Spinner se muestra cuando `checkingFavorito === true`
    - **Property 2: Spinner durante verificación inicial**
    - **Validates: Requirements 1.2**
    - Para cualquier estado donde `checkingFavorito=true`, el render contiene `<Spinner>` y no el contenido del wizard

  - [x] 3.3 Añadir `useEffect` de montaje que llama a `getFavoritos()`
    - Si `array.length >= 1` → `router.push('/navegacion')`
    - Si array vacío → `setCheckingFavorito(false)`
    - Si error (cualquier tipo) → `setCheckingFavorito(false)` (no bloquear al usuario)
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [ ]* 3.4 Escribir property test: array no vacío implica redirección
    - **Property 3: Array no vacío implica redirección**
    - **Validates: Requirements 1.3**
    - Para cualquier array de favoritos con `length >= 1`, el componente llama a `router.push('/navegacion')` y no renderiza el wizard

  - [ ]* 3.5 Escribir property test: error en `getFavoritos` no bloquea el wizard
    - **Property 4: Error en getFavoritos no bloquea el wizard**
    - **Validates: Requirements 1.5**
    - Para cualquier error lanzado por `getFavoritos`, el wizard se muestra normalmente (`checkingFavorito` pasa a `false`)

  - [x] 3.6 Modificar el render para mostrar `<Spinner />` mientras `checkingFavorito === true`
    - Retornar `<Spinner />` centrado (pantalla completa) cuando `checkingFavorito === true`
    - Mostrar el wizard normalmente cuando `checkingFavorito === false`
    - _Requirements: 1.2_

  - [x] 3.7 Modificar `handleSelectEquipo` para manejar `ApiError` de duplicado
    - Si `saveFavorito` lanza `ApiError` con `status === 409` → `router.push('/navegacion')`
    - Si `saveFavorito` lanza otro error → `setError(...)` con mensaje para el usuario
    - Si `saveFavorito` tiene éxito → guardar en `localStorage` y `router.push('/navegacion')`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.8 Escribir property test: `saveFavorito` recibe los parámetros correctos
    - **Property 5: saveFavorito recibe los parámetros correctos**
    - **Validates: Requirements 2.1**
    - Para cualquier `Equipo` generado aleatoriamente, `handleSelectEquipo` llama a `saveFavorito(equipo.liga, equipo._id)`

  - [ ]* 3.9 Escribir property test: éxito persiste en localStorage y redirige
    - **Property 6: Éxito en saveFavorito persiste en localStorage y redirige**
    - **Validates: Requirements 2.2**
    - Para cualquier `Equipo`, tras éxito de `saveFavorito`, `localStorage` contiene `ligaFavorita=equipo.liga` y `equipoFavorito=equipo._id`, y se redirige a `/navegacion`

  - [ ]* 3.10 Escribir property test: error no-duplicado muestra mensaje de error
    - **Property 7: Error no-duplicado en saveFavorito muestra mensaje de error**
    - **Validates: Requirements 2.4**
    - Para cualquier `ApiError` con `status !== 409`, el componente muestra un mensaje de error y no llama a `router.push`

- [x] 4. Checkpoint final — Asegurarse de que todos los tests pasan
  - Verificar que el wizard funciona end-to-end: verificación al montar, redirección si ya existe favorito, guardado y manejo de errores.
  - Consultar al usuario si hay dudas.

## Notes

- Las sub-tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los property tests usan **fast-check** (ya disponible o instalar con `npm install --save-dev fast-check`)
- `ApiError` debe exportarse desde `lib/api.ts` para que el componente pueda hacer `instanceof ApiError`
