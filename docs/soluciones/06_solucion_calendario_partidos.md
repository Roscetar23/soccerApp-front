---
taxonomy: solution
key: partidos-dashboard-premium
solution: Filtros Dinámicos y Dashboard de Partidos
initiative: 01_iniciativa_mvp_rediseno.md
product: SoccerApp
author: Cliente / Anti Gravity
created: 2026-03-25
version: "1.0.0"
status: approved
language: es
changelog:
  - date: 2026-03-25
    author: Anti Gravity
    change: "Definición del rediseño UI/UX para el módulo de partidas."
---

# Rediseño Premium de la Vista de Partidos — Documento de Solución

## 1. Overview
Actualmente la vista de Partidos (en el dashboard autenticado) existe, contiene relojes cronómetros y cumple su función inicial. Sin embargo, se requiere un "Efecto WOW" (Gema 04) aplicando el layout *Split-Screen* que ha resultado exitoso en otras pantallas, introduciendo adicionalmente un motor robusto de **filtros en cascada**.

## 2. Technical Context
- **Framework Frontend**: Next.js (uso de `"use client"` para manejo de estados de filtrado).
- **Lado Izquierdo (Módulo de Exploración):**
  - Un cabezal de control de filtros: Tres selectores/dropdowns (`Liga`, `Equipo`, `Estadio`).
  - Una lista infinita de los partidos encontrados que hagan match con el filtro, en formato de tarjetas en escala con animación *staggerChildren*.
- **Lado Derecho (Hero Widget de Partido):**
  - Al hacer clic en una tarjeta de la lista izquierda, se actualiza el Panel Derecho.
  - Monta un espectacular `CountdownClock` (reloj de arena del partido).
  - Incluye datos del estadio y la liga de forma inmersiva.

## 3. Criterios de Aceptación Técnicos
- [ ] No alterar/borrar ni las peticiones API que ya están funcionando ni el componente exacto del reloj, sino reorganizarlos en el nuevo layout de código.
- [ ] Los filtros deben actuar de manera cruzada (si elijo la Liga Colombiana, en el combo de Equipos solo pueden salir los que tienen partido allí).
- [ ] Uso exclusivo de Tailwind v4 y React Framer Motion para asegurar la excelencia del UI Premium.

## 4. Slices (Hoja de Ruta de Programación)
| # | Slice | Objective | Status |
|---|-------|-----------|--------|
| 01 | **Estado y Lógica de Filtros** | Extraer las listas únicas (ligas, equipos, estadios) desde el arreglo de partidos devuelto por la API e inicializar el buscador local. | ✅ completed |
| 02 | **Layout Split-Screen** | Reestructurar visualmente la vista actual del listado en dos columnas (Listado y Hero/Reloj de Partido Local). | ✅ completed |
| 03 | **Gema 04: UX / Pulido** | Aplicar el background oscuro interactivo con las micro-interacciones de la Gema 04 para los clicks. | ✅ completed |
