---
taxonomy: solution
key: ui-core-redesign
solution: Rediseño Premium UX/UI Global
initiative: 01_iniciativa_mvp_rediseno.md
product: SoccerApp
author: Cliente / Anti Gravity
created: 2026-03-24
updated: 2026-03-24
version: "3.0.0"
status: drafting
language: es
changelog:
  - date: 2026-03-24
    author: Anti Gravity
    change: "Consolidación masiva: TODAS las vistas de UI (Foundations, Login, Onboarding) unificadas en este SOLO archivo a petición del cliente."
---

# Rediseño Premium UX/UI Global — Documento de Solución Único

## 1. Overview
A petición de simplificación, todas las refactorizaciones visuales (Home, Login, Onboarding y futuras piezas de UI) quedan agrupadas bajo esta **Macro-Solución**. 
Aquí convergen las decisiones de purgar la deuda técnica de colores estáticos (`slate`, `emerald`), la implementación de la fuente inmersiva *Bebas Neue*, los modos Claro/Oscuro dinámicos y la estandarización Premium para todo el SoccerApp.

## 2. Technical Context
| Aspecto | Decisión |
|---------|----------|
| **Framework CSS** | Tailwind CSS v4 con variables CSS en `globals.css` |
| **Theme Manager** | `next-themes` (Class strategy) |
| **Tipografía** | `Bebas Neue` (Títulos) + `Inter/Sans` (Body) importadas vía Google Fonts |
| **Design System** | Glassmorphism (Blur), Dark Mode Suave (#111111) y Verde Neón de Acento |

## 3. Acceptance Criteria (Global)
- [x] El Theme Toggle cambia el CSS semántico sin fallos en toda la app.
- [x] El Login Page adopta Glassmorphism y la tipografía base.
- [ ] La vista de Onboarding y Dashboard barren los últimos rastros de colores hardcodeados para sincronizarse completamente con el sistema de temas.

## 4. Slices Consolidados (Hoja de Ruta)

| # | Slice | Objective | Status |
|---|-------|-----------|--------|
| 01 | **Architecture Base** | Configuración de Tailwind v4 y variables CSS (.dark / :root) | ✅ completed |
| 02 | **Layout & Home** | Implementación de ThemeToggle y tipografía principal | ✅ completed |
| 03 | **Login Page** | Conversión total a vista animada con Glassmorphism | ✅ completed |
| 04 | **Onboarding View** | Quitar bg estáticos de Onboarding y aplicar nueva estética | ✅ completed |
| 05 | **Navegación / Dashboard** | Refactor masivo de paneles y vistas de tabla a bg-background dinámico | ✅ completed |
| 06 | **Tipografía Global** | Inyectar Bebas Neue como fuente absoluta para todos los títulos (`h1`-`h6`) del proyecto | ✅ completed |
