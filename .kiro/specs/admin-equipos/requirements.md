# Requirements Document

## Introduction

Esta feature conecta la vista de administración del frontend (Next.js) con los endpoints de equipos del backend (NestJS). Se necesitan tipos TypeScript para el modelo `Equipo`, funciones de API que repliquen el patrón existente de partidos, una vista de listado con filtro por liga, y un formulario de creación. Todo bajo la ruta `/admin/equipos`.

## Glossary

- **Admin_Equipos_Page**: Página en `/admin/equipos` que lista todos los equipos con opción de filtrar y eliminar.
- **Crear_Equipo_Page**: Página en `/admin/equipos/crear` con formulario para registrar un nuevo equipo.
- **API_Client**: Módulo `lib/api.ts` que centraliza las llamadas HTTP al backend.
- **Equipo**: Entidad con campos `nombre`, `escudo` (URL), `fechaCreacion` (ISO date) y `liga`.
- **Liga**: Categoría de competición de un equipo. Valores válidos: `"colombiana"`, `"española"`, `"inglesa"`.
- **Backend**: Servicio NestJS corriendo en `BACKEND_URL` (por defecto `http://localhost:3000`).

---

## Requirements

### Requirement 1: Tipos TypeScript para Equipo

**User Story:** As a developer, I want typed interfaces for the Equipo entity, so that I get compile-time safety across the codebase.

#### Acceptance Criteria

1. THE `types/equipo.types.ts` file SHALL export an `Equipo` interface with fields: `_id: string`, `nombre: string`, `escudo: string`, `fechaCreacion: string`, and `liga: Liga`.
2. THE `types/equipo.types.ts` file SHALL export a `Liga` type defined as `"colombiana" | "española" | "inglesa"`.
3. THE `types/equipo.types.ts` file SHALL export a `CreateEquipoDto` interface with all fields of `Equipo` except `_id`.
4. THE `types/equipo.types.ts` file SHALL export an `UpdateEquipoDto` interface where all fields of `CreateEquipoDto` are optional.

---

### Requirement 2: Funciones API para equipos

**User Story:** As a developer, I want API functions for the equipos endpoints, so that components can interact with the backend without duplicating fetch logic.

#### Acceptance Criteria

1. THE `API_Client` SHALL export a `fetchEquipos(liga?: Liga)` function that calls `GET /equipos` and, when `liga` is provided, appends `?liga={liga}` to the URL.
2. THE `API_Client` SHALL export a `fetchEquipoById(id: string)` function that calls `GET /equipos/:id`.
3. THE `API_Client` SHALL export a `createEquipo(data: CreateEquipoDto)` function that calls `POST /equipos` with a JSON body.
4. THE `API_Client` SHALL export a `updateEquipo(id: string, data: UpdateEquipoDto)` function that calls `PATCH /equipos/:id` with a JSON body.
5. THE `API_Client` SHALL export a `deleteEquipo(id: string)` function that calls `DELETE /equipos/:id`.
6. WHEN the Backend returns a non-OK HTTP status, THE `API_Client` SHALL throw an `Error` with a descriptive Spanish message, following the same pattern used for partidos.
7. THE `fetchEquipos` function SHALL use `cache: 'no-store'` to always return fresh data.

---

### Requirement 3: Vista de listado de equipos

**User Story:** As an admin, I want to see all teams in a table with the option to filter by league and delete entries, so that I can manage the team catalog efficiently.

#### Acceptance Criteria

1. THE `Admin_Equipos_Page` SHALL fetch and display all equipos in a table with columns: nombre, escudo (imagen), liga, fechaCreacion, and acciones.
2. THE `Admin_Equipos_Page` SHALL render a loading spinner while the data is being fetched.
3. IF the fetch fails, THEN THE `Admin_Equipos_Page` SHALL display an error message using the existing `ErrorMessage` component.
4. THE `Admin_Equipos_Page` SHALL display a filter control with the three valid liga values (`colombiana`, `española`, `inglesa`) plus an "Todas" option.
5. WHEN the user selects a liga filter, THE `Admin_Equipos_Page` SHALL re-fetch equipos passing the selected liga to `fetchEquipos` and update the table.
6. WHEN the user clicks "Eliminar" on a row, THE `Admin_Equipos_Page` SHALL request confirmation before calling `deleteEquipo`.
7. WHEN deletion succeeds, THE `Admin_Equipos_Page` SHALL reload the equipo list.
8. IF deletion fails, THEN THE `Admin_Equipos_Page` SHALL display an alert with the error message.
9. THE `Admin_Equipos_Page` SHALL include a link to `/admin/equipos/crear` to create a new equipo.
10. WHILE the equipo list is empty, THE `Admin_Equipos_Page` SHALL display a "No hay equipos registrados" message.

---

### Requirement 4: Formulario de creación de equipo

**User Story:** As an admin, I want a form to create a new team, so that I can add teams to the system without using the API directly.

#### Acceptance Criteria

1. THE `Crear_Equipo_Page` SHALL render a form with fields: nombre (text), escudo (URL text), fechaCreacion (date), and liga (select with the three valid values).
2. THE `Crear_Equipo_Page` SHALL mark all form fields as required.
3. WHEN the form is submitted with valid data, THE `Crear_Equipo_Page` SHALL call `createEquipo` with the form values and redirect to `/admin/equipos` on success.
4. WHILE the form submission is in progress, THE `Crear_Equipo_Page` SHALL disable the submit button and show a "Creando..." label.
5. IF `createEquipo` throws an error, THEN THE `Crear_Equipo_Page` SHALL display the error message and keep the user on the form.
6. THE `Crear_Equipo_Page` SHALL include a cancel link that navigates back to `/admin/equipos`.
7. THE `Crear_Equipo_Page` SHALL convert the `fechaCreacion` date input value to an ISO string before sending it to the API.
