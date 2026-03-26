---
taxonomy: solution
key: hub-mundial-2026
solution: Hub Estático Informativo del Mundial 2026
initiative: 01_iniciativa_mvp_rediseno.md
status: approved
---

# Hub Mundialista 2026 — Documento de Solución

## 1. Overview
Se desea crear un apartado público accesible mediante un botón "Ir al Mundial" desde el Home Page. Esta pantalla será el *"Hub Mundial 2026"*, que actuará como biblioteca introductoria a los eventos magnos de USA/MEX/CAN utilizando la clásica y estética arquitectura "Split-Screen" de la plataforma, pero con una ambientación o paleta de colores evocativa a la esencia de la Copa del Mundo.

## 2. Technical Context
- **Ruta de Acceso**: `/mundial` (Pública, estática).
- **Home UI**: Modificación de `app/page.tsx` para agregar el botón "Ir al Mundial" que dirige a `/mundial`.
- **Estructura Split-Screen (Layout)**:
  - **Lado Izquierdo (Menú de Exploración)**: Selector lateral o tarjetas de menú interactivo: "Historia", "Sedes & Estadios", "Equipos Clasificados", "Fase de Grupos".
  - **Lado Derecho (Hero de Contenido)**: Panel colosal donde la información estática del archivo JSON/Constante es renderizada con elegancia (ej: Logos de los estadios, banderas de los clasificados, tablas de grupos).
- **Data Source**: Colección fija en frontend (`data/mundial.ts` temporal) que simpla la entrega para el MVP, con vías a ser actualizada a futuro si lo requiere el admin mediante backend.

## 3. Slices (Hoja de Ruta de Programación)
| # | Slice | Objective | Status |
|---|-------|-----------|--------|
| 01 | **Botón de Acceso y Ruta Inicial** | Crear el botón en `app/page.tsx` apuntando a `/mundial/page.tsx` e instanciar el cascarón Layout CSS Grid y paleta. | ✅ completed |
| 02 | **Módulo Backend NestJS (Base de Datos)** | Eliminar Mocks. Crear `MundialModule`, `Sedes`, `Grupos` en Mongoose, y un Seeder automático para GET `/mundial`. | ⏳ pending |
| 03 | **Lógica Frontend Selectores** | Consumir la data real servida por el backend usando hooks y programar las pestañas. | ✅ completed |
| 04 | **UI Motion y Tablas Atractivas** | Renderizar el panel inyectando Framer Motion con el "Wow effect" de transición. | ✅ completed |
