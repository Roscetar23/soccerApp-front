# Implementation Plan: navbar-navigation

## Overview

Añadir un botón CTA al final de `app/page.tsx` y crear la ruta `/navegacion` con su nested layout y Navbar de enlaces activos. El Navbar no se incluye en el root layout para no afectar rutas existentes.

## Tasks

- [x] 1. Crear componente CTAButton
  - Crear `components/ui/CTAButton.tsx` como Server Component
  - Recibe props `href: string` y `label: string`
  - Estilo coherente con el tema oscuro slate/emerald existente
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 2. Añadir CTAButton al final de app/page.tsx
  - Importar `CTAButton` en `app/page.tsx`
  - Renderizarlo al final del `<main>` existente con `href="/navegacion"`
  - No modificar ningún otro contenido ni estilo existente
  - _Requirements: 1.1, 1.2, 3.1_

- [ ] 3. Crear componente Navbar
  - [x] 3.1 Implementar `components/ui/Navbar.tsx`
    - Marcar como `'use client'`
    - Definir array `links: NavLink[]` con `{ href: '/', label: 'Inicio' }` y `{ href: '/contador', label: 'Partidos' }`
    - Usar `usePathname()` de `next/navigation` para detectar ruta activa
    - Renderizar `<Link>` por cada entrada; aplicar clase activa cuando `pathname === href`
    - Manejar el caso `pathname === null` sin errores (ningún enlace activo)
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ]* 3.2 Escribir property test — Property 1: Navbar siempre contiene los enlaces requeridos
    - **Property 1: Navbar siempre contiene los enlaces requeridos**
    - Usar `fc.constantFrom('/', '/contador', '/navegacion', '/otro')` como pathname
    - Verificar que siempre existen exactamente los links `href="/"` (Inicio) y `href="/contador"` (Partidos)
    - Mínimo 100 iteraciones (`numRuns: 100`)
    - **Validates: Requirements 2.3**

  - [ ]* 3.3 Escribir property test — Property 2: Enlace activo recibe estilo diferenciado
    - **Property 2: Enlace activo recibe estilo diferenciado**
    - Usar `fc.constantFrom('/', '/contador')` como pathname activo
    - Verificar que el enlace activo tiene clase diferenciada y el inactivo no la tiene
    - Mínimo 100 iteraciones (`numRuns: 100`)
    - **Validates: Requirements 2.5**

- [ ] 4. Crear nested layout y página de /navegacion
  - [x] 4.1 Crear `app/navegacion/layout.tsx`
    - Importar y renderizar `<Navbar />` encima de `{children}`
    - No modificar `app/layout.tsx`
    - _Requirements: 2.1, 2.2, 3.2_

  - [x] 4.2 Crear `app/navegacion/page.tsx`
    - Exportar un componente por defecto con contenido placeholder
    - _Requirements: 2.1_

- [x] 5. Checkpoint — Verificar que todos los tests pasan
  - Asegurarse de que todos los tests pasan. Consultar al usuario si surgen dudas.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los property tests usan fast-check con mínimo 100 iteraciones
- El Navbar NO se añade al root layout (`app/layout.tsx`) para no afectar `/` ni `/contador`
