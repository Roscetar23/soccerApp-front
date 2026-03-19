# Requirements Document

## Introduction

Esta feature reemplaza el sistema de autenticación OAuth (Google + GitHub) por un sistema de login con usuario y contraseña que se comunica con un backend propio. Incluye dos partes: (1) una página de login con formulario de credenciales, y (2) una vista en el área de admin para registrar nuevos usuarios.

## Glossary

- **LoginForm**: Componente de formulario en `/login` que recibe usuario y contraseña.
- **RegisterForm**: Componente de formulario en el área de admin para crear nuevos usuarios.
- **Auth_API**: Backend propio accesible en `NEXT_PUBLIC_API_URL` que expone los endpoints `/auth/login` y `/auth/register`.
- **Session**: Objeto de sesión gestionado por NextAuth que representa al usuario autenticado.
- **Credentials_Provider**: Proveedor de NextAuth que valida credenciales contra la Auth_API.
- **Admin_Area**: Sección de la aplicación bajo la ruta `/admin`, protegida por autenticación.

---

## Requirements

### Requirement 1: Login con usuario y contraseña

**User Story:** Como usuario registrado, quiero iniciar sesión con mi nombre de usuario y contraseña, para acceder a la aplicación sin depender de cuentas de terceros.

#### Acceptance Criteria

1. THE LoginForm SHALL mostrar un campo de texto para el nombre de usuario y un campo de contraseña.
2. WHEN el usuario envía el formulario con usuario y contraseña, THE LoginForm SHALL llamar al endpoint `POST /auth/login` con el body `{ username, password }`.
3. WHEN la Auth_API responde con un objeto que contiene `id`, THE Credentials_Provider SHALL crear una sesión válida y redirigir al usuario a `/onboarding`.
4. IF la Auth_API responde con un error o credenciales inválidas, THEN THE LoginForm SHALL mostrar un mensaje de error descriptivo sin recargar la página.
5. WHILE el formulario está siendo enviado, THE LoginForm SHALL deshabilitar el botón de submit y mostrar un indicador de carga.
6. IF el usuario ya tiene una sesión activa, THEN THE LoginForm SHALL redirigir al usuario a `/onboarding` sin mostrar el formulario.

---

### Requirement 2: Configuración del Credentials Provider en NextAuth

**User Story:** Como desarrollador, quiero que NextAuth use el backend propio para validar credenciales, para mantener la gestión de sesiones centralizada en NextAuth.

#### Acceptance Criteria

1. THE Credentials_Provider SHALL reemplazar los providers de Google y GitHub en la configuración de NextAuth.
2. WHEN el Credentials_Provider recibe `username` y `password`, THE Credentials_Provider SHALL hacer una petición `POST` a `${NEXT_PUBLIC_API_URL}/auth/login`.
3. WHEN la Auth_API devuelve `{ id }`, THE Credentials_Provider SHALL retornar un objeto de usuario con al menos el campo `id`.
4. IF la Auth_API devuelve un error o la petición falla, THEN THE Credentials_Provider SHALL retornar `null` para indicar autenticación fallida.
5. THE Session SHALL incluir el campo `id` del usuario para que esté disponible en el cliente.

---

### Requirement 3: Registro de nuevos usuarios desde el área de admin

**User Story:** Como administrador, quiero registrar nuevos usuarios desde el panel de administración, para gestionar el acceso a la aplicación sin exponer el registro al público.

#### Acceptance Criteria

1. THE Admin_Area SHALL incluir una sección o página accesible desde `/admin` para registrar nuevos usuarios.
2. THE RegisterForm SHALL mostrar un campo para el nombre de usuario y un campo para la contraseña.
3. WHEN el administrador envía el RegisterForm con usuario y contraseña válidos, THE RegisterForm SHALL llamar al endpoint `POST /auth/register` con el body `{ username, password }`.
4. WHEN la Auth_API confirma la creación del usuario, THE RegisterForm SHALL mostrar un mensaje de éxito y limpiar los campos del formulario.
5. IF la Auth_API responde con un error al registrar, THEN THE RegisterForm SHALL mostrar el mensaje de error recibido sin limpiar el formulario.
6. WHILE el RegisterForm está siendo enviado, THE RegisterForm SHALL deshabilitar el botón de submit y mostrar un indicador de carga.

---

### Requirement 4: Eliminación de dependencias OAuth

**User Story:** Como desarrollador, quiero eliminar la configuración de Google y GitHub OAuth, para simplificar la configuración y eliminar credenciales innecesarias.

#### Acceptance Criteria

1. THE Auth_API configuration SHALL eliminar los providers de Google y GitHub de NextAuth.
2. THE LoginForm SHALL eliminar los botones de "Continuar con Google" y "Continuar con GitHub".
3. THE Auth_API configuration SHALL mantener la protección de rutas existente definida en `middleware.ts` sin cambios en el matcher.
