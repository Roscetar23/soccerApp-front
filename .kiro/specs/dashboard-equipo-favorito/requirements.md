# Documento de Requisitos

## Introducción

Esta feature reemplaza la página vacía de `/navegacion` con un dashboard visual que muestra las estadísticas del equipo favorito del usuario autenticado. El ID del equipo se obtiene del `localStorage` (`equipoFavorito`). Adicionalmente, se agrega un módulo en `/admin/equipos` que permite a los administradores crear o actualizar las estadísticas de cualquier equipo mediante un formulario accesible desde la lista existente.

## Glosario

- **Dashboard**: Página principal post-login en `app/navegacion/page.tsx` que muestra información visual del equipo favorito del usuario.
- **Equipo_Favorito**: Equipo cuyo ID está almacenado en `localStorage` bajo la clave `equipoFavorito`, establecido durante el onboarding.
- **Estadisticas_API**: Endpoints REST del backend que gestionan las estadísticas de un equipo: `GET /equipos/:id/estadisticas` y `POST /equipos/:id/estadisticas`.
- **EstadisticasEquipo**: Objeto con los campos `ultimosPartidos`, `porcentajeVictorias`, `promedioPases`, `promedioTirosAlArco` y `promedioFaltas`.
- **Resultado_Partido**: Valor de tipo `"G"` (ganado), `"P"` (perdido) o `"E"` (empatado) que representa el resultado de un partido reciente.
- **Admin_Equipos**: Página en `app/admin/equipos/page.tsx` que lista los equipos y desde la cual se accede al módulo de estadísticas.
- **Formulario_Estadisticas**: Componente o página que permite al administrador ingresar y guardar las estadísticas de un equipo específico.
- **Equipos_API**: Funciones en `lib/api.ts` que encapsulan las llamadas HTTP a los endpoints de equipos y estadísticas.

---

## Requisitos

### Requisito 1: Lectura del equipo favorito desde localStorage

**User Story:** Como usuario autenticado, quiero que el dashboard lea mi equipo favorito desde el localStorage, para que la página cargue la información correcta sin requerir una selección adicional.

#### Criterios de Aceptación

1. WHEN el usuario navega a `/navegacion`, THE Dashboard SHALL leer el valor de `equipoFavorito` desde `localStorage`.
2. IF `equipoFavorito` no existe en `localStorage` o su valor es nulo, THEN THE Dashboard SHALL mostrar un mensaje indicando que el usuario debe completar el onboarding y un enlace a `/onboarding`.
3. WHEN `equipoFavorito` contiene un ID válido, THE Dashboard SHALL proceder a cargar los datos del equipo y sus estadísticas.

---

### Requisito 2: Carga de datos del equipo favorito

**User Story:** Como usuario autenticado, quiero ver el nombre, escudo y liga de mi equipo favorito en el dashboard, para identificar visualmente de qué equipo se trata.

#### Criterios de Aceptación

1. WHEN el Dashboard obtiene el ID del equipo desde `localStorage`, THE Equipos_API SHALL realizar una llamada `GET /equipos/:id` para obtener los datos del equipo.
2. WHILE la llamada a `GET /equipos/:id` está en curso, THE Dashboard SHALL mostrar un indicador de carga.
3. WHEN la respuesta de `GET /equipos/:id` es exitosa, THE Dashboard SHALL mostrar el nombre, escudo y liga del equipo.
4. IF `GET /equipos/:id` responde con un error HTTP, THEN THE Dashboard SHALL mostrar un mensaje de error descriptivo y ofrecer la opción de reintentar.

---

### Requisito 3: Carga y visualización de estadísticas del equipo

**User Story:** Como usuario autenticado, quiero ver las estadísticas de mi equipo favorito de forma visual, para entender su rendimiento reciente de un vistazo.

#### Criterios de Aceptación

1. WHEN el Dashboard obtiene el ID del equipo desde `localStorage`, THE Equipos_API SHALL realizar una llamada `GET /equipos/:id/estadisticas` para obtener las estadísticas.
2. WHILE la llamada a `GET /equipos/:id/estadisticas` está en curso, THE Dashboard SHALL mostrar un indicador de carga.
3. WHEN la respuesta de `GET /equipos/:id/estadisticas` es exitosa, THE Dashboard SHALL mostrar `porcentajeVictorias`, `promedioPases`, `promedioTirosAlArco` y `promedioFaltas` como métricas individuales.
4. WHEN la respuesta de `GET /equipos/:id/estadisticas` es exitosa, THE Dashboard SHALL mostrar los `ultimosPartidos` como una secuencia visual de resultados, donde cada `Resultado_Partido` se representa con un color distinto: verde para `"G"`, rojo para `"P"` y amarillo para `"E"`.
5. IF `GET /equipos/:id/estadisticas` responde con un error HTTP, THEN THE Dashboard SHALL mostrar un mensaje indicando que las estadísticas no están disponibles, sin ocultar los datos del equipo ya cargados.
6. IF `GET /equipos/:id/estadisticas` responde con un array vacío en `ultimosPartidos`, THEN THE Dashboard SHALL mostrar el texto "Sin partidos recientes" en lugar de la secuencia de resultados.

---

### Requisito 4: Funciones de API para estadísticas en la capa de datos

**User Story:** Como desarrollador, quiero funciones `fetchEstadisticasEquipo` y `saveEstadisticasEquipo` en `lib/api.ts`, para que el Dashboard y el módulo de admin puedan consumir y persistir estadísticas de forma centralizada.

#### Criterios de Aceptación

1. THE Equipos_API SHALL exponer una función `fetchEstadisticasEquipo(id: string): Promise<EstadisticasEquipo>` que realice `GET /equipos/:id/estadisticas`.
2. WHEN `GET /equipos/:id/estadisticas` responde con éxito, THE Equipos_API SHALL retornar el objeto `EstadisticasEquipo` recibido.
3. IF `GET /equipos/:id/estadisticas` responde con un error HTTP, THEN THE Equipos_API SHALL lanzar un error con un mensaje descriptivo.
4. THE Equipos_API SHALL exponer una función `saveEstadisticasEquipo(id: string, data: EstadisticasEquipo): Promise<EstadisticasEquipo>` que realice `POST /equipos/:id/estadisticas`.
5. WHEN `POST /equipos/:id/estadisticas` responde con éxito, THE Equipos_API SHALL retornar el objeto `EstadisticasEquipo` guardado.
6. IF `POST /equipos/:id/estadisticas` responde con un error HTTP, THEN THE Equipos_API SHALL lanzar un error con un mensaje descriptivo.

---

### Requisito 5: Tipo `EstadisticasEquipo` en la capa de tipos

**User Story:** Como desarrollador, quiero un tipo `EstadisticasEquipo` en `types/equipo.types.ts`, para que el Dashboard y el módulo de admin tengan tipado estático correcto al manipular estadísticas.

#### Criterios de Aceptación

1. THE Sistema SHALL definir el tipo `EstadisticasEquipo` en `types/equipo.types.ts` con los campos: `ultimosPartidos: Resultado_Partido[]`, `porcentajeVictorias: number`, `promedioPases: number`, `promedioTirosAlArco: number` y `promedioFaltas: number`.
2. THE Sistema SHALL definir el tipo `Resultado_Partido` como `"G" | "P" | "E"` en `types/equipo.types.ts`.
3. THE Equipos_API SHALL importar y usar `EstadisticasEquipo` desde `types/equipo.types.ts` en todas las funciones relacionadas con estadísticas.

---

### Requisito 6: Acceso al formulario de estadísticas desde la lista de equipos en admin

**User Story:** Como administrador, quiero acceder a un formulario de estadísticas desde la lista de equipos, para poder crear o actualizar las estadísticas de cualquier equipo sin salir del panel de administración.

#### Criterios de Aceptación

1. WHEN el Admin_Equipos renderiza la tabla de equipos, THE Admin_Equipos SHALL mostrar un botón "Estadísticas" por cada fila de equipo, junto a las acciones existentes.
2. WHEN el administrador hace clic en el botón "Estadísticas" de un equipo, THE Admin_Equipos SHALL navegar a la página del Formulario_Estadisticas para ese equipo, en la ruta `/admin/equipos/:id/estadisticas`.
3. WHEN el Formulario_Estadisticas carga para un equipo con estadísticas existentes, THE Formulario_Estadisticas SHALL pre-rellenar los campos con los valores actuales obtenidos de `GET /equipos/:id/estadisticas`.
4. WHILE la carga de estadísticas existentes está en curso, THE Formulario_Estadisticas SHALL mostrar un indicador de carga.
5. IF `GET /equipos/:id/estadisticas` responde con un error al cargar el formulario, THEN THE Formulario_Estadisticas SHALL mostrar el formulario vacío sin bloquear al administrador.

---

### Requisito 7: Guardado de estadísticas desde el formulario de admin

**User Story:** Como administrador, quiero guardar las estadísticas de un equipo desde el formulario, para que los usuarios del dashboard vean información actualizada.

#### Criterios de Aceptación

1. THE Formulario_Estadisticas SHALL permitir al administrador ingresar valores para `porcentajeVictorias` (número entre 0 y 100), `promedioPases` (número entero positivo), `promedioTirosAlArco` (número entero positivo) y `promedioFaltas` (número entero positivo).
2. THE Formulario_Estadisticas SHALL permitir al administrador ingresar hasta 5 resultados en `ultimosPartidos`, donde cada resultado es uno de los valores `"G"`, `"P"` o `"E"`.
3. WHEN el administrador envía el formulario con datos válidos, THE Formulario_Estadisticas SHALL llamar a `saveEstadisticasEquipo` con el ID del equipo y los datos ingresados.
4. WHEN `saveEstadisticasEquipo` responde con éxito, THE Formulario_Estadisticas SHALL mostrar un mensaje de confirmación y redirigir al administrador a `/admin/equipos`.
5. IF `saveEstadisticasEquipo` responde con un error, THEN THE Formulario_Estadisticas SHALL mostrar un mensaje de error descriptivo sin limpiar los datos del formulario.
6. IF el administrador intenta enviar el formulario con `porcentajeVictorias` fuera del rango 0–100, THEN THE Formulario_Estadisticas SHALL mostrar un mensaje de validación y no enviar la solicitud.
