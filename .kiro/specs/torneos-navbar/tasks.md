# Implementation Plan: torneos-navbar

## Overview

Implementación incremental del módulo de torneos siguiendo el patrón existente del proyecto. Se crean primero los tipos, luego las funciones API, luego se modifica la Navbar, y finalmente se crean los componentes y la página, conectando todo al final.

## Tasks

- [x] 1. Crear tipos TypeScript para torneos
  - Crear `types/torneo.types.ts` con `TipoTorneo`, `EquipoTorneo`, `Torneo` y `CreateTorneoDto`
  - Seguir el mismo patrón de `types/equipo.types.ts`
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 2. Agregar funciones API para torneos en lib/api.ts
  - [x] 2.1 Implementar fetchTorneos, fetchTorneoById, createTorneo y deleteTorneo
    - Seguir el patrón existente: `cache: 'no-store'` en fetchTorneos, mensajes de error en español, `throw new Error(...)` si `!response.ok`
    - `createTorneo` usa `method: 'POST'` con `Content-Type: application/json`
    - `deleteTorneo` usa `method: 'DELETE'` y retorna `void`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 2.2 Escribir property test para Property 8: API lanza error en respuesta no exitosa
    - **Property 8: API lanza error en respuesta no exitosa**
    - **Validates: Requirements 6.5**
    - Usar `fc.integer({ min: 400, max: 599 })` para status codes no exitosos
    - Verificar que `fetchTorneos`, `createTorneo` y `deleteTorneo` lanzan `Error` con mensaje descriptivo

  - [ ]* 2.3 Escribir property test para Property 9: fetchTorneos retorna el array del backend
    - **Property 9: fetchTorneos retorna el array del backend sin modificaciones**
    - **Validates: Requirements 6.2**
    - Generar arrays arbitrarios de `Torneo` con fast-check, mockear `fetch` para retornarlos
    - Verificar que `fetchTorneos` retorna exactamente el mismo array

- [x] 3. Agregar enlace "Torneos" en la Navbar
  - Modificar `components/ui/Navbar.tsx` agregando `{ href: '/navegacion/torneos', label: 'Torneos' }` al array `links`
  - No se requiere ningún otro cambio; el mecanismo de estilo activo ya funciona con `usePathname()`
  - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 3.1 Escribir property test para Property 1: Enlace activo en Navbar
    - **Property 1: Solo el enlace cuyo href coincide con el pathname actual tiene clase activa**
    - **Validates: Requirements 1.2**
    - Generar pathnames aleatorios con `fc.constantFrom('/navegacion', '/navegacion/equipos', '/navegacion/partidos', '/navegacion/torneos')`
    - Renderizar `Navbar` con `usePathname` mockeado, verificar que solo el enlace activo tiene la clase `text-emerald-400`

- [x] 4. Checkpoint — Asegurarse de que los tests pasan, consultar al usuario si hay dudas.

- [x] 5. Crear componente TorneosList
  - Crear `components/torneos/TorneosList.tsx` como componente de presentación
  - Recibe `torneos: Torneo[]`, `onDelete: (id: string) => Promise<void>`, `deletingId: string | null`
  - Renderiza cada torneo con: nombre, badge de tipo, número de equipos y botón de eliminar
  - El botón de eliminar se deshabilita cuando `deletingId === torneo._id`
  - _Requirements: 3.5, 5.1, 5.5_

  - [ ]* 5.1 Escribir property test para Property 2: Renderizado completo de torneos
    - **Property 2: Cada torneo aparece en el DOM con nombre, tipo y número de equipos**
    - **Validates: Requirements 3.1, 3.5**
    - Generar arrays arbitrarios de `Torneo` con fast-check
    - Verificar que nombre, tipo y `equipos.length` de cada torneo aparecen en el DOM

  - [ ]* 5.2 Escribir property test para Property 3: Acción de eliminar presente por torneo
    - **Property 3: Hay exactamente un botón de eliminar por torneo**
    - **Validates: Requirements 5.1**
    - Generar arrays arbitrarios de `Torneo`, renderizar `TorneosList`
    - Verificar que el número de botones de eliminar es igual al número de torneos

- [x] 6. Crear componente TorneoForm
  - Crear `components/torneos/TorneoForm.tsx` como formulario controlado
  - Recibe `onCreated: (torneo: Torneo) => void`
  - Estado interno: `nombre`, `tipo: TipoTorneo`, `equipos: EquipoTorneo[]`, `submitting`, `error`
  - Permite agregar/eliminar equipos dinámicamente (nombre + URL de escudo por equipo)
  - Select de tipo con opciones `eliminacion_directa` y `liga`
  - Botón de envío deshabilitado si `submitting === true` o `equipos.length === 0`
  - Llama `createTorneo` al enviar y propaga el resultado con `onCreated`
  - Muestra error inline si `createTorneo` falla, sin cerrar el formulario
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [ ]* 6.1 Escribir property test para Property 4: Creación llama a la API con los datos correctos
    - **Property 4: createTorneo es invocada con exactamente el CreateTorneoDto enviado**
    - **Validates: Requirements 4.6, 6.3**
    - Generar `CreateTorneoDto` arbitrarios con fast-check
    - Simular envío del formulario, verificar que `createTorneo` es llamada con esos datos exactos

  - [ ]* 6.2 Escribir property test para Property 10: Equipos dinámicos en el formulario
    - **Property 10: El estado del formulario contiene exactamente los N equipos agregados**
    - **Validates: Requirements 4.4**
    - Generar N equipos aleatorios (N entre 1 y 10) con fast-check
    - Simular agregar cada equipo al formulario, verificar que el estado contiene exactamente esos N equipos

- [x] 7. Crear página app/navegacion/torneos/page.tsx
  - Crear `app/navegacion/torneos/page.tsx` como Client Component
  - Estado: `torneos: Torneo[]`, `loading: boolean`, `error: string | null`, `deletingId: string | null`
  - `useEffect` que llama `fetchTorneos` al montar
  - Muestra `<Spinner>` durante carga, `<ErrorMessage>` en error, mensaje vacío si no hay torneos
  - `handleDelete` llama `deleteTorneo(id)`, actualiza la lista filtrando el torneo eliminado
  - `handleCreated` agrega el nuevo torneo al estado local sin recargar
  - Renderiza `<TorneoForm onCreated={handleCreated} />` y `<TorneosList torneos={torneos} onDelete={handleDelete} deletingId={deletingId} />`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.7, 5.2, 5.3, 5.4_

  - [ ]* 7.1 Escribir property test para Property 5: Lista actualizada tras creación
    - **Property 5: El torneo creado aparece en la lista sin recargar la página**
    - **Validates: Requirements 4.7**
    - Generar un torneo arbitrario, simular creación exitosa vía `onCreated`
    - Verificar que el torneo aparece en la lista renderizada

  - [ ]* 7.2 Escribir property test para Property 6: Eliminación llama a la API con el id correcto
    - **Property 6: deleteTorneo es invocada con el _id del torneo seleccionado**
    - **Validates: Requirements 5.2, 6.4**
    - Generar lista de torneos y elegir uno al azar, simular clic en eliminar
    - Verificar que `deleteTorneo` es llamada con el `_id` de ese torneo

  - [ ]* 7.3 Escribir property test para Property 7: Lista actualizada tras eliminación
    - **Property 7: El torneo eliminado no aparece en la lista tras eliminación exitosa**
    - **Validates: Requirements 5.3**
    - Generar lista de torneos y elegir uno al azar, simular eliminación exitosa
    - Verificar que ese torneo no aparece en la lista renderizada

- [x] 8. Checkpoint final — Asegurarse de que todos los tests pasan, consultar al usuario si hay dudas.

- [x] 9. Agregar botón "Ver torneo" en TorneosList
  - Modificar `components/torneos/TorneosList.tsx` para agregar un botón "Ver torneo" a cada item
  - Usar `useRouter` de `next/navigation` para navegar a `/navegacion/torneos/${torneo._id}`
  - _Requirements: 8.1, 8.2_

- [x] 10. Crear componente BracketEliminacion
  - Crear `components/torneos/BracketEliminacion.tsx`
  - Props: `equipos: EquipoTorneo[]`
  - Renderizar bracket visual de eliminación directa con CSS/Tailwind (sin librerías externas)
  - Slots de primera ronda muestran escudo + nombre; slots vacíos muestran "BYE"
  - Calcular rondas con `Math.ceil(Math.log2(equipos.length))`
  - Paleta oscura: `slate-800`/`slate-900`, bordes `slate-600`, texto blanco, acentos `emerald`
  - _Requirements: 9.5, 9.7_

- [x] 11. Crear componente TablaLiga
  - Crear `components/torneos/TablaLiga.tsx`
  - Props: `equipos: EquipoTorneo[]`
  - Renderizar lista/tabla de equipos con escudo y nombre
  - Paleta oscura: `slate-800`, bordes `slate-700`, texto blanco
  - _Requirements: 9.6, 9.8_

- [x] 12. Crear página de detalle del torneo
  - Crear `app/navegacion/torneos/[id]/page.tsx` como Client Component
  - Estado: `torneo: Torneo | null`, `loading: boolean`, `error: string | null`
  - `useEffect` que llama `fetchTorneoById(params.id)` al montar
  - Mostrar `<Spinner>` durante carga, `<ErrorMessage>` en error
  - Mostrar nombre del torneo + badge de tipo
  - Si `tipo === 'eliminacion_directa'`: renderizar `<BracketEliminacion equipos={torneo.equipos} />`
  - Si `tipo === 'liga'`: renderizar `<TablaLiga equipos={torneo.equipos} />`
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Librería para property tests: **fast-check** (ya usada en el proyecto)
- Configuración mínima: `numRuns: 100` por propiedad
- Cada test de propiedad debe incluir el comentario: `// Feature: torneos-navbar, Property N: <texto>`
- Seguir el patrón existente del proyecto en todo momento para mantener consistencia
