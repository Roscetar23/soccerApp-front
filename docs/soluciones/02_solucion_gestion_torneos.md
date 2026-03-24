---
taxonomy: solution
key: gestion-torneos-core
solution: Creación y Gestión de Torneos
initiative: 01_iniciativa_mvp_rediseno.md
product: SoccerApp
author: Cliente / Anti Gravity
created: 2026-03-24
updated: 2026-03-24
version: "1.0.0"
status: drafting
language: es
changelog:
  - date: 2026-03-24
    author: Anti Gravity
    change: "Creación inicial — Diseño de Arquitectura NestJS y especificación de UI para Múltiples Formatos."
---

# Gestión de Torneos Core — Documento de Solución

## 1. Overview
El núcleo de SoccerApp: empoderar a los jugadores y organizadores locales para digitalizar la "Copa del Barrio". Esta solución abarca la integración **End-to-End** (Backend en NestJS + Frontend en Next.js) permitiendo crear torneos, suscribir equipos, generar enfrentamientos (Partidos/Versus) y renderizar el avance de la competencia mediante tablas de puntuación clásicas o gráficas de eliminación en formato de árbol.

Esta solución está estrictamente alineada con la **Gema 02 (Stack Backend)** y respeta su inyección de dependencias y Módulos.

## 2. Solution Narrative (Flujos Backend a Frontend)

### 2.1 Modelado en Base de Datos (NestJS x MongoDB)
Se expandirán y conectarán dos Módulos Principales de NestJS:
1. **Schema de Torneo:** 
   - Nombre del Torneo.
   - Arreglo de `equipos` (Referencias ObjectId al schema Equipos).
   - Campo estricto `tipoFormato`: Enum(`'liguilla'`, `'eliminacion_directa'`).
2. **Schema de Partido (Resultados):** 
   - Pertenece a un Torneo (ObjectId).
   - `equipoLocal` y `equipoVisitante`.
   - `fechaHora` del partido.
   - Resultantes: `golesLocal`, `golesVisitante`.
   - `estado`: `'programado'`, `'finalizado'`.

### 2.2 Renderer de Frontend: Formato "Liguilla" (Puntos)
- **Lógica:** Formato tipo liga profesional (ej. Premier). El equipo que sume más puntos, gana.
- **UI:** Un componente nativo en Next.js `LiguillaTable.tsx` que leerá dinámicamente el historial de partidos de ese torneo y calculará "al vuelo" los Partidos Jugados (PJ), Ganados (G), Empatados (E), Perdidos (P) y Puntos (PTS).

### 2.3 Renderer de Frontend: "Eliminación Directa"
- **Lógica:** Knockout (Ganador avanza, perdedor es borrado de la llave).
- **UI:** Un componente `KnockoutBracket.tsx`. Usando CSS Grid y Flexbox, dibujaremos los populares "cuadritos" que conectan Octavos de final, Cuartos y Semifinales. El equipo ganador destacará con la clase `--neon` (verde luminoso).

## 3. Out of Scope
- Simulación automática o "Matchmaking" inteligente en el backend. El organizador dictamina quién juega contra quién.
- Lógicas complejas de "Gol de Oro" o Penaltis algorítmicos. El organizador simplemente ingresa el marcador final o nombra al ganador de la llave.
- Pasarelas de Pago para inscripciones a la liga.

## 4. Technical Context

| Capa | Aspecto | Decisión |
|------|---------|----------|
| **Backend** | Framework | NestJS v11 + MongoDB (Mongoose Schema estricto). |
| **Backend** | Validación | `class-validator` con `@IsEnum` para forzar que el formato de torneo sea exacto. |
| **Frontend** | Visualización | CSS puro de Tailwind para dibujar líneas del *Bracket* de eliminación (Sin librerías pesadas extra). |

## 5. Acceptance Criteria
- [ ] La API de NestJS tiene un Endpoint POST `/torneos` que recibe array de equipos y formato.
- [ ] Existe una tabla/colección `partidos` aislada que almacena fecha, hora y score global.
- [ ] Al visualizar un Torneo en el frontend, si es tipo `liguilla` aparece la tabla de posiciones clásica calculada.
- [ ] Al visualizarlo, si es tipo `eliminacion_directa` aparece el esquema visual de llaves conectadas.

## 6. Slices (Arquitectura de Ejecución)

| # | Slice | Objective | Status |
|---|-------|-----------|--------|
| 01 | **NestJS: Schemas & DTOs** | Estructurar Modelos/Mongoose (Torneo, Partido) en BD. | ✅ completed |
| 02 | **NestJS: Logica & Endpoints** | Crear Controladores y Servicios CRUD para Torneos y Resultados. | ✅ completed |
| 03 | **UI: Panel Organizador** | Formulario Frontend para armar el torneo, escoger tipo y matricular equipos. | ✅ completed |
| 04 | **UI: Formulario Resultados** | Componente para dictar qué equipo ganó, cuántos goles y a qué hora. | ✅ completed |
| 05 | **UI: Renderers Finales** | Visualizador de Tabla de Liguilla o Bracket Cuadritos, embebidos en el Dashboard. | ✅ completed |
| 06 | **Torneos: Lógica Estricta de Restricciones** | Evitar choques ilícitos en fase de eliminación, y control de ida/vuelta en liguillas. Soporte matemático a Penales.  | ✅ completed |
| 07 | **Torneos: Exclusividad de Usuario** | Los torneos creados pertenecen estrictamente a quien los creó vinculándolo al `useSession` oficial del Back/Front. | ✅ completed |
| 08 | **Clubes: Privacidad de Equipos Inventados** | Los equipos de "barrio" le pertenecerán secretamente al `userId` del creador, combinándose a la perfección con la lista de equipos globales públicos (Liga Inglesa, Española, etc.). | ✅ completed |
| 09 | **Historial de Resultados Puros** | Bitácora temporal donde se enlistan todos los resultados oficiales dictaminados para este torneo. | ✅ completed |
