# Requirements Document

## Introduction

Flujo de onboarding de 2 pasos que se inserta entre la página principal y la vista `/navegacion`. El usuario selecciona primero su liga favorita y luego su equipo favorito antes de acceder a la navegación principal. El objetivo es personalizar la experiencia desde el primer acceso.

## Glossary

- **Onboarding_Wizard**: Componente de página que gestiona el flujo de 2 pasos de selección de liga y equipo.
- **Liga**: Categoría de competición futbolística. Valores posibles: `"colombiana"`, `"española"`, `"inglesa"`.
- **Equipo**: Entidad con campos `_id`, `nombre`, `escudo` (URL), `fechaCreacion` y `liga`.
- **LigaCard**: Tarjeta seleccionable que representa una liga en el paso 1.
- **EquipoCard**: Tarjeta seleccionable que muestra el escudo y nombre de un equipo en el paso 2.
- **API**: Servicio backend accesible mediante las funciones de `lib/api.ts`.

---

## Requirements

### Requirement 1: Redirección del CTA principal

**User Story:** As a user, I want the "Ver todos los partidos" button to take me to the onboarding flow, so that I can personalize my experience before entering the app.

#### Acceptance Criteria

1. THE `CTAButton` en `app/page.tsx` SHALL apuntar a `/onboarding` en lugar de `/navegacion`.

---

### Requirement 2: Paso 1 — Selección de liga

**User Story:** As a user, I want to see the available leagues as selectable cards, so that I can choose my favorite league.

#### Acceptance Criteria

1. WHEN el usuario navega a `/onboarding`, THE `Onboarding_Wizard` SHALL mostrar el paso 1 con el título "Selecciona tu liga favorita".
2. THE `Onboarding_Wizard` SHALL renderizar exactamente tres `LigaCard`: una para `"colombiana"`, una para `"española"` y una para `"inglesa"`.
3. WHEN el usuario selecciona una `LigaCard`, THE `Onboarding_Wizard` SHALL marcar visualmente esa tarjeta como seleccionada y avanzar al paso 2.
4. THE `Onboarding_Wizard` SHALL mostrar un indicador de progreso que refleje que el usuario está en el paso 1 de 2.

---

### Requirement 3: Paso 2 — Selección de equipo

**User Story:** As a user, I want to see the teams of my selected league, so that I can choose my favorite team.

#### Acceptance Criteria

1. WHEN el usuario avanza al paso 2, THE `Onboarding_Wizard` SHALL llamar a `fetchEquipos(liga)` con la liga seleccionada en el paso 1.
2. WHILE la petición a la API está en curso, THE `Onboarding_Wizard` SHALL mostrar un indicador de carga.
3. WHEN la API devuelve los equipos, THE `Onboarding_Wizard` SHALL renderizar una `EquipoCard` por cada equipo recibido, mostrando el escudo (`escudo`) y el nombre (`nombre`).
4. IF la petición a la API falla, THEN THE `Onboarding_Wizard` SHALL mostrar un mensaje de error descriptivo y ofrecer la opción de reintentar.
5. THE `Onboarding_Wizard` SHALL mostrar un indicador de progreso que refleje que el usuario está en el paso 2 de 2.
6. THE `Onboarding_Wizard` SHALL mostrar un botón "Atrás" que permita al usuario regresar al paso 1 sin perder la liga seleccionada.

---

### Requirement 4: Navegación tras selección de equipo

**User Story:** As a user, I want to be redirected to the main navigation after selecting my team, so that I can start using the app.

#### Acceptance Criteria

1. WHEN el usuario selecciona una `EquipoCard`, THE `Onboarding_Wizard` SHALL guardar la liga y el `_id` del equipo seleccionado en `localStorage` bajo las claves `ligaFavorita` y `equipoFavorito`.
2. WHEN el equipo es guardado en `localStorage`, THE `Onboarding_Wizard` SHALL redirigir al usuario a `/navegacion`.

---

### Requirement 5: Consistencia visual

**User Story:** As a user, I want the onboarding screens to match the app's visual style, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE `Onboarding_Wizard` SHALL aplicar el fondo `bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950` consistente con el resto de la aplicación.
2. THE `LigaCard` y la `EquipoCard` SHALL usar el sistema de colores slate/emerald definido en el tema de la aplicación.
3. THE `EquipoCard` SHALL mostrar la imagen del escudo del equipo usando el componente `next/image` con un fallback visible si la imagen no carga.
