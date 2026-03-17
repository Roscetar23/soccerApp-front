# Implementation Plan: admin-equipos

## Overview

Implementación incremental siguiendo el patrón existente de partidos. Se crean los tipos, luego las funciones API, luego las vistas, conectando todo al final.

## Tasks

- [x] 1. Crear tipos TypeScript para Equipo
  - Crear `types/equipo.types.ts` con `Liga`, `Equipo`, `CreateEquipoDto` y `UpdateEquipoDto`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Agregar funciones API para equipos en lib/api.ts
  - [x] 2.1 Implementar fetchEquipos, fetchEquipoById, createEquipo, updateEquipo y deleteEquipo
    - Seguir el mismo patrón de partidos: `cache: 'no-store'` en fetchEquipos, mensajes de error en español, throw Error si `!response.ok`
    - `fetchEquipos` debe aceptar `liga?: Liga` y agregar `?liga={liga}` a la URL cuando se proporciona
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 2.2 Escribir property test para Property 1: URLs y métodos HTTP correctos
    - **Property 1: Las funciones API construyen URLs y métodos HTTP correctos**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
    - Usar fast-check con `fc.string()` para ids y `fc.constantFrom('colombiana','española','inglesa')` para liga
    - Mock de `fetch`, verificar URL y método para cada función

  - [ ]* 2.3 Escribir property test para Property 2: Errores HTTP lanzan Error en español
    - **Property 2: Errores HTTP lanzan Error con mensaje en español**
    - **Validates: Requirements 2.6**
    - Usar `fc.integer({ min: 400, max: 599 })` para status codes
    - Verificar que todas las funciones lanzan `Error` con mensaje en español

- [x] 3. Checkpoint — Asegurarse de que los tests pasan, consultar al usuario si hay dudas.

- [ ] 4. Implementar vista de listado app/admin/equipos/page.tsx
  - [x] 4.1 Crear el componente de listado con tabla, filtro por liga y eliminación
    - Client component con `useState` para equipos, filtro activo, loading y error
    - `useEffect` que llama `loadEquipos()` cuando cambia el filtro seleccionado
    - Tabla con columnas: nombre, escudo (img), liga, fechaCreacion, acciones
    - Select con opciones: "Todas", "colombiana", "española", "inglesa"
    - `handleDelete` con `confirm()` antes de llamar `deleteEquipo`, recarga lista al éxito
    - Usar `<Spinner>` durante carga y `<ErrorMessage>` si falla el fetch
    - Mensaje "No hay equipos registrados" cuando la lista está vacía
    - Link a `/admin/equipos/crear`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

  - [ ]* 4.2 Escribir property test para Property 3: La tabla renderiza todos los datos
    - **Property 3: La tabla renderiza todos los datos de los equipos**
    - **Validates: Requirements 3.1**
    - Usar `fc.array(equipoArbitrary, { minLength: 1 })` para generar listas de equipos
    - Verificar que cada fila contiene nombre, img del escudo, liga y fecha

  - [ ]* 4.3 Escribir property test para Property 4: El filtro re-fetcha con la liga correcta
    - **Property 4: El filtro por liga re-fetcha con el valor correcto**
    - **Validates: Requirements 3.5**
    - Usar `fc.constantFrom('colombiana', 'española', 'inglesa', undefined)` para simular selección
    - Verificar que `fetchEquipos` es llamado con el argumento correcto (o sin argumento para "Todas")

- [ ] 5. Implementar formulario de creación app/admin/equipos/crear/page.tsx
  - [x] 5.1 Crear el formulario de creación de equipo
    - Client component con campos: nombre (text), escudo (url), fechaCreacion (date), liga (select)
    - Todos los campos con `required`
    - `handleSubmit` lee `FormData`, convierte `fechaCreacion` a ISO con `new Date(value).toISOString()`, llama `createEquipo`, redirige a `/admin/equipos`
    - Botón deshabilitado con label "Creando..." durante submit
    - Mostrar error inline si `createEquipo` lanza, sin redirigir
    - Link de cancelar a `/admin/equipos`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 5.2 Escribir property test para Property 5: Fecha convertida a ISO string
    - **Property 5: El formulario convierte la fecha a ISO string**
    - **Validates: Requirements 4.7**
    - Usar `fc.date()` para generar fechas arbitrarias
    - Simular input `type="date"` (formato `YYYY-MM-DD`) y verificar que el resultado es un ISO string válido

  - [ ]* 5.3 Escribir property test para Property 6: Envío exitoso redirige a /admin/equipos
    - **Property 6: Envío exitoso del formulario redirige a /admin/equipos**
    - **Validates: Requirements 4.3**
    - Usar `createEquipoDtoArbitrary` para generar datos válidos
    - Mock de `createEquipo` resolviendo, verificar que `router.push('/admin/equipos')` es llamado

  - [ ]* 5.4 Escribir property test para Property 7: Errores de creación se muestran en el formulario
    - **Property 7: Errores de creación se muestran en el formulario**
    - **Validates: Requirements 4.5**
    - Usar `fc.string({ minLength: 1 })` para mensajes de error arbitrarios
    - Mock de `createEquipo` lanzando `Error(errorMessage)`, verificar que el mensaje es visible y no hay redirección

- [x] 6. Checkpoint final — Asegurarse de que todos los tests pasan, consultar al usuario si hay dudas.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Librería recomendada para property tests: **fast-check**
- Seguir el patrón existente de partidos en todo momento para mantener consistencia
