# Requirements Document

## Introduction

Esta funcionalidad agrega un módulo de torneos integrado en la aplicación Next.js existente. Incluye un botón "Torneos" en la Navbar de navegación, una vista de torneos accesible tras el inicio de sesión, y la capacidad de crear, ver y eliminar torneos con sus equipos. Los torneos pueden ser de tipo eliminación directa o liga, y cada equipo tiene nombre y escudo (URL de imagen).

## Glossary

- **Torneo**: Competición deportiva con nombre, tipo y lista de equipos participantes.
- **Equipo_Torneo**: Equipo participante en un torneo, compuesto por nombre y URL de escudo.
- **Tipo_Torneo**: Modalidad del torneo: `eliminacion_directa` o `liga`.
- **Torneos_API**: Servicio backend disponible en `http://localhost:3000` que expone los endpoints de torneos.
- **Navbar**: Barra de navegación principal de la aplicación, ubicada en `components/ui/Navbar.tsx`.
- **Vista_Torneos**: Página en `/navegacion/torneos` que lista los torneos existentes y permite crear y eliminar torneos.
- **Formulario_Torneo**: Componente de creación de torneo que recoge nombre, tipo y equipos.
- **Vista_Detalle_Torneo**: Página en `/navegacion/torneos/[id]` que muestra la información completa de un torneo.
- **Bracket_Eliminacion**: Componente visual que representa el cuadro de eliminación directa con los equipos en sus slots.
- **Tabla_Liga**: Componente visual que muestra los equipos de un torneo de liga en formato de lista/tabla.

---

## Requirements

### Requirement 1: Botón de Torneos en la Navbar

**User Story:** Como usuario autenticado, quiero ver un enlace "Torneos" en la Navbar, para poder acceder a la sección de torneos desde cualquier página de navegación.

#### Acceptance Criteria

1. THE Navbar SHALL mostrar un enlace con la etiqueta "Torneos" junto a los enlaces existentes de "Inicio", "Equipos" y "Partidos".
2. WHEN el usuario navega a `/navegacion/torneos`, THE Navbar SHALL aplicar el estilo activo al enlace "Torneos" de la misma forma que lo hace con los demás enlaces activos.
3. WHEN el usuario hace clic en el enlace "Torneos", THE Navbar SHALL navegar a la ruta `/navegacion/torneos`.

---

### Requirement 3: Vista de listado de torneos

**User Story:** Como usuario autenticado, quiero ver todos los torneos existentes en la Vista_Torneos, para conocer los torneos disponibles.

#### Acceptance Criteria

1. WHEN el usuario accede a `/navegacion/torneos`, THE Vista_Torneos SHALL obtener y mostrar todos los torneos desde `GET /torneos`.
2. WHEN la lista de torneos está vacía, THE Vista_Torneos SHALL mostrar un mensaje indicando que no hay torneos creados.
3. WHEN ocurre un error al obtener los torneos, THE Vista_Torneos SHALL mostrar un mensaje de error descriptivo.
4. WHILE los torneos se están cargando, THE Vista_Torneos SHALL mostrar un indicador de carga.
5. THE Vista_Torneos SHALL mostrar para cada torneo: nombre, tipo y número de equipos participantes.

---

### Requirement 4: Creación de un torneo

**User Story:** Como usuario autenticado, quiero crear un torneo con nombre, tipo y equipos, para organizar competiciones deportivas.

#### Acceptance Criteria

1. THE Vista_Torneos SHALL proporcionar acceso al Formulario_Torneo para crear un nuevo torneo.
2. THE Formulario_Torneo SHALL requerir un campo de nombre de torneo de tipo texto.
3. THE Formulario_Torneo SHALL requerir la selección del Tipo_Torneo entre `eliminacion_directa` y `liga`.
4. THE Formulario_Torneo SHALL permitir agregar uno o más Equipo_Torneo, cada uno con nombre y URL de escudo.
5. THE Formulario_Torneo SHALL requerir al menos un Equipo_Torneo antes de permitir el envío.
6. WHEN el usuario envía el Formulario_Torneo con datos válidos, THE Formulario_Torneo SHALL llamar a `POST /torneos` con el body `{ nombre, tipo, equipos: [{ nombre, escudo }] }`.
7. WHEN la creación del torneo es exitosa, THE Vista_Torneos SHALL actualizar la lista de torneos mostrando el nuevo torneo.
8. IF la llamada a `POST /torneos` falla, THEN THE Formulario_Torneo SHALL mostrar un mensaje de error descriptivo sin cerrar el formulario.
9. WHILE el Formulario_Torneo está enviando datos, THE Formulario_Torneo SHALL deshabilitar el botón de envío para evitar envíos duplicados.

---

### Requirement 5: Eliminación de un torneo

**User Story:** Como usuario autenticado, quiero eliminar un torneo existente, para mantener la lista de torneos actualizada.

#### Acceptance Criteria

1. THE Vista_Torneos SHALL mostrar una acción de eliminar para cada torneo en la lista.
2. WHEN el usuario confirma la eliminación de un torneo, THE Vista_Torneos SHALL llamar a `DELETE /torneos/:id`.
3. WHEN la eliminación es exitosa, THE Vista_Torneos SHALL remover el torneo eliminado de la lista sin recargar la página.
4. IF la llamada a `DELETE /torneos/:id` falla, THEN THE Vista_Torneos SHALL mostrar un mensaje de error descriptivo.
5. WHILE la eliminación de un torneo está en progreso, THE Vista_Torneos SHALL deshabilitar la acción de eliminar para ese torneo.

---

### Requirement 6: Integración con la API de Torneos

**User Story:** Como desarrollador, quiero que todas las operaciones de torneos pasen por funciones centralizadas en `lib/api.ts`, para mantener consistencia con el patrón existente del proyecto.

#### Acceptance Criteria

1. THE Torneos_API SHALL exponer las funciones `fetchTorneos`, `fetchTorneoById`, `createTorneo` y `deleteTorneo` en `lib/api.ts`.
2. WHEN `fetchTorneos` es llamada, THE Torneos_API SHALL realizar una petición `GET /torneos` y retornar un array de torneos.
3. WHEN `createTorneo` es llamada con datos válidos, THE Torneos_API SHALL realizar una petición `POST /torneos` con el body correspondiente y retornar el torneo creado.
4. WHEN `deleteTorneo` es llamada con un id válido, THE Torneos_API SHALL realizar una petición `DELETE /torneos/:id`.
5. IF cualquier petición a la Torneos_API retorna un status no exitoso, THEN THE Torneos_API SHALL lanzar un error con un mensaje descriptivo.

---

### Requirement 8: Botón "Ver torneo" en la lista de torneos

**User Story:** Como usuario autenticado, quiero un botón "Ver torneo" en cada torneo de la lista, para poder acceder a la vista de detalle de ese torneo.

#### Acceptance Criteria

1. THE Vista_Torneos SHALL mostrar un botón "Ver torneo" para cada torneo en la lista.
2. WHEN el usuario hace clic en el botón "Ver torneo" de un torneo, THE Vista_Torneos SHALL navegar a `/navegacion/torneos/[id]` donde `[id]` es el `_id` del torneo seleccionado.

---

### Requirement 9: Vista de detalle del torneo

**User Story:** Como usuario autenticado, quiero ver el detalle de un torneo al acceder a su URL, para conocer su nombre, tipo y los equipos participantes con su visualización correspondiente.

#### Acceptance Criteria

1. WHEN el usuario accede a `/navegacion/torneos/[id]`, THE Vista_Detalle_Torneo SHALL obtener el torneo llamando a `fetchTorneoById(id)`.
2. WHILE el torneo se está cargando, THE Vista_Detalle_Torneo SHALL mostrar un indicador de carga.
3. IF `fetchTorneoById` falla, THEN THE Vista_Detalle_Torneo SHALL mostrar un mensaje de error descriptivo.
4. THE Vista_Detalle_Torneo SHALL mostrar el nombre del torneo y un badge con su tipo (`eliminacion_directa` o `liga`).
5. WHEN el torneo es de tipo `eliminacion_directa`, THE Vista_Detalle_Torneo SHALL renderizar el Bracket_Eliminacion con los equipos ubicados en los slots de primera ronda, mostrando el escudo y nombre de cada equipo.
6. WHEN el torneo es de tipo `liga`, THE Vista_Detalle_Torneo SHALL renderizar la Tabla_Liga con el escudo y nombre de cada equipo participante.
7. THE Bracket_Eliminacion SHALL mantener la paleta de colores oscura de la aplicación (slate-900, emerald).
8. THE Tabla_Liga SHALL mantener la paleta de colores oscura de la aplicación (slate-900, emerald).

---

### Requirement 7: Tipos TypeScript para torneos

**User Story:** Como desarrollador, quiero que los tipos de torneos estén definidos en el sistema de tipos del proyecto, para garantizar seguridad de tipos en toda la funcionalidad.

#### Acceptance Criteria

1. THE Sistema SHALL definir el tipo `Torneo` con los campos: `_id: string`, `nombre: string`, `tipo: TipoTorneo`, `equipos: EquipoTorneo[]`.
2. THE Sistema SHALL definir el tipo `EquipoTorneo` con los campos: `nombre: string`, `escudo: string`.
3. THE Sistema SHALL definir el tipo `TipoTorneo` como `"eliminacion_directa" | "liga"`.
4. THE Sistema SHALL definir el tipo `CreateTorneoDto` con los campos: `nombre: string`, `tipo: TipoTorneo`, `equipos: EquipoTorneo[]`.
