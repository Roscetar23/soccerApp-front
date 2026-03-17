# Implementation Plan: onboarding-liga-equipo

## Overview

Wizard de 2 pasos (selección de liga → selección de equipo) que se inserta entre la landing page y `/navegacion`. Implementado como Client Component en Next.js con TypeScript, usando los tipos y funciones de API existentes.

## Tasks

- [x] 1. Modificar CTAButton en app/page.tsx
  - Cambiar `href="/navegacion"` a `href="/onboarding"` en el componente `CTAButton`
  - _Requirements: 1.1_

- [ ] 2. Crear componente LigaCard
  - [x] 2.1 Implementar `components/onboarding/LigaCard.tsx`
    - Props: `liga: Liga`, `seleccionada: boolean`, `onSelect: (liga: Liga) => void`
    - Mostrar nombre de liga y emoji representativo
    - Aplicar borde emerald + fondo destacado cuando `seleccionada === true`
    - Usar colores slate/emerald del tema
    - _Requirements: 2.2, 2.3, 5.2_

  - [ ]* 2.2 Escribir property test para LigaCard (Property 1)
    - **Property 1: Selección de liga avanza al paso 2**
    - **Validates: Requirements 2.3**
    - `// Feature: onboarding-liga-equipo, Property 1: selección de liga avanza al paso 2`

- [ ] 3. Crear componente EquipoCard
  - [x] 3.1 Implementar `components/onboarding/EquipoCard.tsx`
    - Props: `equipo: Equipo`, `onSelect: (equipo: Equipo) => void`
    - Mostrar escudo con `next/image` y nombre del equipo
    - Fallback visible (div con inicial del nombre sobre fondo slate) cuando la imagen falla (`onError`)
    - Usar colores slate/emerald del tema
    - _Requirements: 3.3, 5.2, 5.3_

  - [ ]* 3.2 Escribir unit tests para EquipoCard
    - Verificar que renderiza nombre y escudo del equipo
    - Verificar que muestra fallback cuando la imagen falla
    - _Requirements: 3.3, 5.3_

- [ ] 4. Crear OnboardingWizard en app/onboarding/page.tsx
  - [x] 4.1 Implementar estructura base del wizard
    - Crear `app/onboarding/page.tsx` como Client Component (`"use client"`)
    - Definir estado: `paso: 1 | 2`, `ligaSeleccionada: Liga | null`, `equipos: Equipo[]`, `loading: boolean`, `error: string | null`
    - Aplicar fondo `bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950`
    - Renderizar indicador de progreso "Paso X de 2"
    - _Requirements: 2.1, 2.4, 3.5, 5.1_

  - [x] 4.2 Implementar paso 1 — selección de liga
    - Mostrar título "Selecciona tu liga favorita"
    - Renderizar tres `LigaCard` (colombiana, española, inglesa)
    - Al seleccionar una liga: actualizar `ligaSeleccionada` y avanzar a `paso = 2`
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 4.3 Escribir property test para paso 1 (Property 1 y Property 2)
    - **Property 1: Selección de liga avanza al paso 2**
    - **Property 2: fetchEquipos recibe la liga correcta**
    - **Validates: Requirements 2.3, 3.1**
    - `// Feature: onboarding-liga-equipo, Property 1: selección de liga avanza al paso 2`
    - `// Feature: onboarding-liga-equipo, Property 2: fetchEquipos recibe la liga correcta`

  - [x] 4.4 Implementar paso 2 — carga y selección de equipo
    - `useEffect` que llama `fetchEquipos(ligaSeleccionada)` al entrar al paso 2
    - Mostrar `Spinner` mientras `loading === true`
    - Mostrar `ErrorMessage` + botón "Reintentar" si `error !== null`
    - Renderizar una `EquipoCard` por cada equipo recibido
    - Mostrar botón "Atrás" que regresa a `paso = 1` preservando `ligaSeleccionada`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 4.5 Escribir property test para paso 2 (Property 3 y Property 4)
    - **Property 3: EquipoCards corresponden a los equipos recibidos**
    - **Property 4: Volver atrás preserva la liga seleccionada**
    - **Validates: Requirements 3.3, 3.6**
    - `// Feature: onboarding-liga-equipo, Property 3: EquipoCards corresponden a los equipos recibidos`
    - `// Feature: onboarding-liga-equipo, Property 4: volver atrás preserva la liga seleccionada`

  - [x] 4.6 Implementar persistencia en localStorage y redirección
    - Al seleccionar equipo: guardar `ligaFavorita` y `equipoFavorito` en `localStorage` con try/catch
    - Redirigir a `/navegacion` con `useRouter` tras guardar
    - _Requirements: 4.1, 4.2_

  - [ ]* 4.7 Escribir property test para persistencia (Property 5)
    - **Property 5: Selección de equipo persiste correctamente en localStorage**
    - **Validates: Requirements 4.1**
    - `// Feature: onboarding-liga-equipo, Property 5: selección de equipo persiste en localStorage`

- [x] 5. Checkpoint — Verificar integración completa
  - Ensure all tests pass, ask the user if questions arise.
  - Verificar que el flujo completo `/` → `/onboarding` → `/navegacion` funciona correctamente

## Notes

- Tasks marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Los property tests usan **fast-check** con mínimo 100 iteraciones por propiedad
- Cada property test incluye comentario de trazabilidad `// Feature: onboarding-liga-equipo, Property N: ...`
- `localStorage` se accede con try/catch para manejar entornos SSR o modo privado estricto
- No se introducen nuevos tipos ni dependencias; se reutilizan `Liga`, `Equipo` y `fetchEquipos` existentes
