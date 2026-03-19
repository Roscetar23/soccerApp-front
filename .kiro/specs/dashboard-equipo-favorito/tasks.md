# Plan de Implementación: Dashboard Equipo Favorito

## Visión General

Implementar el dashboard del equipo favorito en `/navegacion` y el módulo de estadísticas para administradores en `/admin/equipos/:id/estadisticas`, incluyendo los tipos, funciones de API y componentes visuales necesarios.

## Tareas

- [x] 1. Agregar tipos `ResultadoPartido` y `EstadisticasEquipo` en la capa de tipos
  - Agregar `export type ResultadoPartido = "G" | "P" | "E"` en `types/equipo.types.ts`
  - Agregar `export interface EstadisticasEquipo` con los campos `ultimosPartidos`, `porcentajeVictorias`, `promedioPases`, `promedioTirosAlArco` y `promedioFaltas`
  - _Requisitos: 5.1, 5.2_

- [ ] 2. Agregar funciones de API para estadísticas en `lib/api.ts`
  - [x] 2.1 Implementar `fetchEstadisticasEquipo(id: string): Promise<EstadisticasEquipo>`
    - Realizar `GET /equipos/:id/estadisticas` con `cache: 'no-store'`
    - Lanzar error descriptivo si la respuesta no es `ok`
    - Importar `EstadisticasEquipo` desde `types/equipo.types.ts`
    - _Requisitos: 4.1, 4.2, 4.3, 5.3_

  - [x] 2.2 Implementar `saveEstadisticasEquipo(id: string, data: EstadisticasEquipo): Promise<EstadisticasEquipo>`
    - Realizar `POST /equipos/:id/estadisticas` con `Content-Type: application/json`
    - Lanzar error descriptivo si la respuesta no es `ok`
    - _Requisitos: 4.4, 4.5, 4.6_

  - [ ]* 2.3 Escribir tests de propiedad para las funciones de API
    - **Propiedad 1: fetchEstadisticasEquipo retorna un objeto con todos los campos requeridos de EstadisticasEquipo**
    - **Valida: Requisitos 4.2, 5.1**

- [x] 3. Checkpoint — Verificar que los tipos y funciones de API compilan sin errores
  - Asegurarse de que no hay errores de TypeScript en `types/equipo.types.ts` y `lib/api.ts`, consultar al usuario si surgen dudas.

- [ ] 4. Crear componentes del dashboard
  - [x] 4.1 Crear `components/dashboard/EquipoHeader.tsx`
    - Recibir prop `equipo: Equipo`
    - Mostrar escudo (80×80px), nombre en texto grande emerald y badge de liga
    - _Requisitos: 2.3_

  - [x] 4.2 Crear `components/dashboard/UltimosPartidosChart.tsx`
    - Recibir prop `resultados: ResultadoPartido[]`
    - Renderizar badges coloreados: verde (`bg-emerald-500`) para `"G"`, rojo (`bg-red-500`) para `"P"`, amarillo (`bg-yellow-500`) para `"E"`
    - Mostrar "Sin partidos recientes" si el array está vacío
    - _Requisitos: 3.4, 3.6_

  - [ ]* 4.3 Escribir tests de propiedad para `UltimosPartidosChart`
    - **Propiedad 2: Para cualquier array de ResultadoPartido, cada elemento se mapea al color correcto sin excepción**
    - **Valida: Requisitos 3.4**

  - [x] 4.4 Crear `components/dashboard/EstadisticasGrid.tsx`
    - Recibir prop `estadisticas: EstadisticasEquipo`
    - Mostrar 4 tarjetas en grid 2×2 (md: 4 columnas) con `porcentajeVictorias`, `promedioPases`, `promedioTirosAlArco` y `promedioFaltas`
    - Usar `RadialBarChart` de Recharts para `porcentajeVictorias` y `BarChart` para los promedios
    - Todos los componentes con Recharts deben tener `'use client'`
    - _Requisitos: 3.3_

  - [ ]* 4.5 Escribir tests unitarios para `EstadisticasGrid`
    - Verificar que los 4 valores numéricos se renderizan correctamente
    - _Requisitos: 3.3_

- [x] 5. Implementar la página del dashboard en `app/navegacion/page.tsx`
  - Reemplazar el contenido actual con un Client Component (`'use client'`)
  - Leer `localStorage.getItem('equipoFavorito')` al montar el componente
  - Si no existe el ID → mostrar mensaje con enlace a `/onboarding`
  - Si existe → disparar en paralelo `fetchEquipoById(id)` y `fetchEstadisticasEquipo(id)`
  - Mostrar `Spinner` mientras cargan los datos
  - Al resolver → renderizar `EquipoHeader`, `EstadisticasGrid` y `UltimosPartidosChart`
  - Si `fetchEquipoById` falla → mostrar `ErrorMessage` con opción de reintentar
  - Si `fetchEstadisticasEquipo` falla → mostrar mensaje de estadísticas no disponibles sin ocultar los datos del equipo
  - _Requisitos: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 6. Checkpoint — Verificar que el dashboard compila y los componentes se integran correctamente
  - Asegurarse de que no hay errores de TypeScript ni de importación, consultar al usuario si surgen dudas.

- [x] 7. Agregar botón "Estadísticas" en la tabla de `app/admin/equipos/page.tsx`
  - Agregar un `Link` con texto "Estadísticas" por cada fila de equipo, apuntando a `/admin/equipos/${equipo._id}/estadisticas`
  - Ubicar el enlace junto a las acciones existentes (columna "Acciones")
  - _Requisitos: 6.1, 6.2_

- [ ] 8. Crear la página del formulario de estadísticas en `app/admin/equipos/[id]/estadisticas/page.tsx`
  - [x] 8.1 Crear la estructura de la página con Client Component (`'use client'`)
    - Obtener `params.id` de la ruta dinámica
    - Al montar, intentar cargar estadísticas existentes con `fetchEstadisticasEquipo(id)`
    - Si hay datos → pre-rellenar el formulario; si hay error → mostrar formulario vacío
    - Mostrar `Spinner` durante la carga inicial
    - _Requisitos: 6.3, 6.4, 6.5_

  - [x] 8.2 Implementar el formulario con validación local
    - Campos: `porcentajeVictorias` (número 0–100), `promedioPases`, `promedioTirosAlArco`, `promedioFaltas` (enteros positivos)
    - Campo para `ultimosPartidos`: hasta 5 selectores con opciones `"G"`, `"P"`, `"E"` y opción de agregar/quitar entradas
    - Validar `porcentajeVictorias` en rango 0–100 antes de enviar; mostrar mensaje de validación si falla
    - _Requisitos: 7.1, 7.2, 7.6_

  - [x] 8.3 Implementar el envío del formulario
    - Al enviar con datos válidos → llamar `saveEstadisticasEquipo(id, data)`
    - Si éxito → mostrar mensaje de confirmación y redirigir a `/admin/equipos` con `router.push`
    - Si error → mostrar mensaje de error descriptivo sin limpiar el formulario
    - _Requisitos: 7.3, 7.4, 7.5_

  - [ ]* 8.4 Escribir tests de propiedad para la validación del formulario
    - **Propiedad 3: Para cualquier valor de `porcentajeVictorias` fuera del rango [0, 100], el formulario nunca envía la solicitud**
    - **Valida: Requisitos 7.6**

- [x] 9. Checkpoint final — Verificar que todos los tests pasan y el flujo completo funciona
  - Asegurarse de que no hay errores de TypeScript en ningún archivo nuevo o modificado, consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Recharts debe instalarse si no está en `package.json` (`npm install recharts`)
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints garantizan validación incremental
