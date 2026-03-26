---
taxonomy: solution
key: ligas-profesionales-dashboard
solution: Dashboard de Ligas Profesionales y Carga de Excel
initiative: 01_iniciativa_mvp_rediseno.md
product: SoccerApp
author: Cliente / Anti Gravity
created: 2026-03-25
updated: 2026-03-25
version: "1.0.0"
status: approved
language: es
changelog:
  - date: 2026-03-25
    author: Anti Gravity
    change: "Creación de la solución arquitectónica central con directrices de Excel y UI Split-Screen."
---

# Dashboard de Ligas Profesionales y Carga por Excel — Documento de Solución

## 1. Overview
Se requiere la integración de tres competiciones profesionales (Liga Colombiana, Liga Española, Liga de Inglaterra). El sistema centralizará el ingreso de la información mediante la subida manual de un archivo Excel desde el panel del Administrador.
Los usuarios (Hinchas) consumirán esta información en un único Dashboard interactivo. La pantalla estará dividida en dos: a la izquierda, la tabla de posiciones de la liga seleccionada, y a la derecha, el detalle puntual de un equipo (estadísticas y próximos partidos). 

## 2. Technical Context
| Aspecto | Decisión |
|---------|----------|
| **Frontend Layout** | Split-Screen (Grid/Flex) con Selector de Ligas superior. |
| **Animaciones UI** | Exclusivamente Framer Motion (Gema 04). |
| **Backend Storage** | Endpoint NestJS capaz de recibir un FormData con archivo Excel, parsear sus hojas e ingestar en MongoDB. |
| **Capa Lógica** | Backend devuelve DTOs rígidos con toda la data "masticada", el Front solo renderiza. |
| **Actualidad de Datos** | Sin WebSockets. Datos estáticos / fechas de partidos guardados en BD. |

### 2.1 Estructura del Excel Requerido (Contrato de Datos)
El Backend esperará que el Administrador suba un archivo `.xlsx` estructurado en **3 hojas (Tabs)**, con las siguientes columnas estrictas:

**Hoja 1: `Equipos`**
- `nombre` (string)
- `liga` (string: "Colombiana" | "Española" | "Inglesa")
- `escudo_url` (string, opcional)

**Hoja 2: `Partidos`**
- `equipo_local` (string, debe coincidir con el nombre de la Hoja 1)
- `equipo_visitante` (string)
- `fecha_hora` (fecha/string, ej. "2026-04-10T20:00:00Z")
- `liga` (string)

**Hoja 3: `Estadisticas`**
- `equipo` (string, coincide con Hoja 1)
- `puntos` (number)
- `partidos_jugados` (number)
- `victorias` (number)
- `empates` (number)
- `derrotas` (number)
- `goles_favor` (number)
- `goles_contra` (number)

## 3. Acceptance Criteria (Global)
- [ ] El administrador puede subir el archivo Excel `.xlsx` desde una sección en `/admin`, parseándolo y alimentando la BD del backend exitosamente.
- [ ] El backend expone rutas públicas (`GET`) para enviar la información ya unida ("masticada").
- [ ] El Hincha uede alternar dinámicamente entre las 3 ligas en el Dashboard sin recargar la página.
- [ ] Dar clic a un equipo en la tabla actualiza inmediatamente la mitad derecha de la pantalla para mostrar "Próximo Pártido" y sus "Estadísticas".
- [ ] Todo está animado según el estándar de `Framer Motion`.

## 4. Slices Consolidados (Hoja de Ruta)

| # | Slice | Objective | Status |
|---|-------|-----------|--------|
| 01 | **Backend: Módulo de Importación Excel** | Endpoint NestJS con librería (`xlsx` o `exceljs`) para leer el archivo subido y guardar Colecciones en MongoDB. | ✅ completed |
| 02 | **Backend: Endpoints de Dashboard** | Crear el servicio/controlador GET para despachar la tabla de posiciones y las stats/partidos de un equipo ("masticado"). | ✅ completed |
| 03 | **Frontend: Panel Admin Upload** | Componente arrastrar/soltar para subir el Excel conectado a NextAuth. | ✅ completed |
| 04 | **Frontend: Dashboard Estático (UI Split)** | Maquetado HTML/Tailwind en dos columnas responsivas (Tabla + Detalle). | ✅ completed |
| 05 | **Frontend: Conexión API y Motion** | Fetching a las rutas creadas, control de estados (equipo seleccionado) y aplicación de Gema 04. | ✅ completed |
