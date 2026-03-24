# GEMA 02: Arquitectura y Stack del Backend (soccerApp-back)

Esta Gema contiene el contexto técnico del proyecto Backend.
**Ruta del Repositorio:** `/Users/oscargomez/Desktop/soccerback`

## 1. Stack Principal
- **Framework:** NestJS (v11)
- **Lenguaje:** TypeScript (Avanzado, decoradores estables)
- **Base de Datos:** MongoDB
- **ORM / ODM:** Mongoose (a través de `@nestjs/mongoose`)

## 2. Herramientas y Librerías Secundarias
- **Validación:** `class-validator` y `class-transformer` (Obligatorio en todos los DTOs).
- **Seguridad:** `bcrypt` para el hash de contraseñas.

## 3. Arquitectura y Carpetas
La arquitectura sigue la convención modular estricta de NestJS. Las funcionalidades se agrupan en módulos independientes (`/src/users`, `/src/auth`, `/src/equipos`, `/src/torneos`, `/src/partidos`, `/src/favoritos`).

Dentro de cada módulo se debe respetar la siguiente estructura:
- `[nombre].module.ts`: Definición del módulo y sus dependencias.
- `[nombre].controller.ts`: Rutas HTTP y manejo de request/response.
- `[nombre].service.ts`: Lógica de negocio y consultas a MongoDB.
- `dto/`: Clases para tipos de entrada (`CreateDto`, `UpdateDto`).
- `entities/` (o `schemas/`): Definición del esquema de Mongoose (`@Schema()`).

## 4. Reglas de Desarrollo Backend
1. Nunca hacer consultas a la base de datos desde el Controlador. Siempre usar el Servicio.
2. Todas las respuestas de la API deben ser consistentes (ej. devolver JSON estructurado).
3. Todas las contraseñas deben ser hasheadas con Bcrypt antes de guardarse en MongoDB.
4. Usar Inyección de Dependencias.
