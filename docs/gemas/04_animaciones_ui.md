---
type: gema
id: "04_animaciones_ui"
title: "Animaciones y Experiencia Interactiva (Framer Motion)"
description: "Define los estándares visuales interactivos y micro-interacciones para toda la SoccerApp."
---

# Gema 04: Animaciones y Experiencia Interactiva

## 1. Filosofía
Las animaciones en SoccerApp no son adornos irrelevantes; son el lenguaje corporal de la aplicación (UX). Al ser una plataforma enfocada en los deportes, el diseño requiere sentirse rápido, orgánico, e interactivo. Deben premiar las acciones del usuario generando el llamado *"Efecto Premium"* sin causar mareos ni retrasar la navegación.

## 2. Herramienta Core
- **Framer Motion**: Única librería aprobada para montar, desmontar y transicionar componentes de UI renderizados en cliente (`"use client"`).

## 3. Estándares y Variantes Comunes
Todo desarrollo nuevo debe adherirse a estos fragmentos de código base para asegurar coherencia visual en toda la app.

### 3.1. Entrada de Página o Contenedor (Page Mount)
Cada vez que el usuario aterriza en una vista nueva o cambia de paso (Ej. Onboarding), el contenedor principal JAMÁS debe aparecer de golpe.
- **Fade Up**: Deslizar sutilmente desde abajo mientras sube la opacidad.
```jsx
<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {content}
</motion.div>
```

### 3.2. Listas en Cascada (Staggered Grids)
Al cargar un catálogo (Ej. Lista de ligas, lista de equipos, tabla de posiciones), los elementos no deben renderizarse simultáneamente. Deben aparecer en un estallido consecutivo.
- **Padre**: `variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}`
- **Hijos**: `variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}`

### 3.3. Micro-interacciones (Elementos Táctiles)
Todo botón, "Card" de equipo, o selector debe tener respuesta háptica virtual:
- **Hover (Mouse encima)**: `whileHover={{ scale: 1.02 }}`
- **Tap (Click presionado)**: `whileTap={{ scale: 0.95 }}`

### 3.4. Indicadores de Carga
- Los Skeleton Loaders o Spinners deben estar envueltos en opacidades dinámicas. Nada de interrupciones abruptas (flashbacks) entre peticiones a la API.

---
> **Nota de Arquitectura:** Integrar esta gema significa que cualquier ingeniero o agente de IA que construya vistas de ahora en adelante, está OBLIGADO a usar estas animaciones predefinidas. No se pueden inventar transiciones incoherentes o "rebotonas".
