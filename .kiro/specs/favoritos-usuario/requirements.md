# Requirements Document

## Introduction

Esta feature permite que cada usuario autenticado guarde su liga y equipo favorito una sola vez. Al entrar al onboarding, el sistema consulta si el usuario ya tiene un favorito registrado en el backend. Si ya existe, redirige directamente a `/navegacion` sin mostrar el wizard. Si no existe, muestra el wizard normalmente. Al guardar, el frontend maneja el caso de error cuando el backend rechaza un segundo intento de guardado.

## Glossary

- **Onboarding_Wizard**: Página en `app/onboarding/page.tsx` que permite al usuario seleccionar liga y equipo favorito en dos pasos.
- **Favorito**: Registro en el backend que asocia un usuario con una liga y un equipo. Solo puede existir uno por usuario.
- **Favoritos_API**: Endpoint REST del backend en `http://localhost:3000/favoritos` que gestiona los favoritos de usuarios.
- **Session**: Objeto de sesión de NextAuth que contiene `session.user.id` para identificar al usuario autenticado.
- **localStorage**: Almacenamiento local del navegador usado como caché para `ligaFavorita` y `equipoFavorito`.

## Requirements

### Requirement 1: Verificación de favorito existente al entrar al onboarding

**User Story:** As a usuario autenticado, I want que el sistema verifique si ya tengo un favorito guardado al entrar al onboarding, so that no tenga que repetir el proceso de selección si ya lo completé.

#### Acceptance Criteria

1. WHEN el usuario navega a `/onboarding`, THE Onboarding_Wizard SHALL consultar el endpoint `GET /favoritos` antes de renderizar el wizard.
2. WHILE la consulta a `GET /favoritos` está en curso, THE Onboarding_Wizard SHALL mostrar un indicador de carga en lugar del contenido del wizard.
3. WHEN la respuesta de `GET /favoritos` contiene al menos un registro, THE Onboarding_Wizard SHALL redirigir al usuario a `/navegacion` sin mostrar el wizard.
4. WHEN la respuesta de `GET /favoritos` es un array vacío, THE Onboarding_Wizard SHALL mostrar el wizard de selección normalmente.
5. IF la consulta a `GET /favoritos` falla con un error de red o respuesta no exitosa, THEN THE Onboarding_Wizard SHALL mostrar el wizard de selección normalmente para no bloquear al usuario.

### Requirement 2: Guardado único de favorito por usuario

**User Story:** As a usuario autenticado, I want que el sistema maneje correctamente el intento de guardar un favorito cuando ya tengo uno registrado, so that reciba retroalimentación clara en lugar de un error silencioso.

#### Acceptance Criteria

1. WHEN el usuario selecciona un equipo en el paso 2 del wizard, THE Onboarding_Wizard SHALL llamar a `POST /favoritos` con `{ liga, equipo }`.
2. WHEN `POST /favoritos` responde con éxito, THE Onboarding_Wizard SHALL guardar `ligaFavorita` y `equipoFavorito` en localStorage y redirigir al usuario a `/navegacion`.
3. IF `POST /favoritos` responde con un error indicando que el favorito ya existe, THEN THE Onboarding_Wizard SHALL redirigir al usuario a `/navegacion` sin mostrar un mensaje de error, ya que el favorito ya está guardado.
4. IF `POST /favoritos` responde con un error distinto al de favorito duplicado, THEN THE Onboarding_Wizard SHALL mostrar un mensaje de error al usuario e indicar que intente de nuevo.

### Requirement 3: Función de consulta de favoritos en la capa de API

**User Story:** As a desarrollador, I want una función `getFavoritos` en `lib/api.ts`, so that el Onboarding_Wizard pueda consultar los favoritos del usuario de forma centralizada y reutilizable.

#### Acceptance Criteria

1. THE Favoritos_API SHALL exponer una función `getFavoritos` en `lib/api.ts` que realice `GET /favoritos` y retorne el array de favoritos.
2. WHEN `GET /favoritos` responde con éxito, THE Favoritos_API SHALL retornar el array de objetos favorito recibido.
3. IF `GET /favoritos` responde con un error HTTP, THEN THE Favoritos_API SHALL lanzar un error con un mensaje descriptivo.
