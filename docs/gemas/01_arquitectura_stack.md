# GEMA 01: Arquitectura y Stack Tecnológico (soccerApp-front)

Esta Gema contiene el contexto técnico del proyecto de fútbol (soccerApp-front). La IA debe leer este documento antes de proponer soluciones o escribir código, para asegurar la consistencia del proyecto.

## 1. Stack Principal
- **Framework:** Next.js (v16)
- **Router:** App Router (usa la carpeta `app/`, NO usar `pages/`)
- **UI & Componentes:** React (v19)
- **Lenguaje:** TypeScript (Tipado fuerte obligatorio)
- **Estilos:** Tailwind CSS (v4)

## 2. Herramientas y Librerías Secundarias
- **Autenticación:** `next-auth` (v5 beta)
- **Gráficos/Estadísticas:** `recharts`
- **Internacionalización:** `next-intl`

## 3. Arquitectura y Carpetas
- `app/`: Contiene las rutas de la aplicación principal (`/admin`, `/login`, `/contador`, `/onboarding`).
- `components/`: Componentes organizados por dominio de negocio (ej. `/torneos`, `/dashboard`, `/contador`, `/ui`).
- `lib/api.ts`: Capa de servicios. Todas las llamadas a backend/API deben centralizarse aquí.
- `types/`: Definiciones de interfaces de TypeScript (`equipo.types.ts`, `torneo.types.ts`, etc.). Usar estas interfaces al tipar las props y los estados.

## 4. Diseño y UI/UX (Próximos Pasos)
- **Estado Actual:** El diseño actual se considera base/plano.
- **Objetivo de Diseño:** Se buscará mejorar la interfaz para que sea más dinámica, premium y menos "plana", utilizando mejores paletas de colores, micro-interacciones y buenas prácticas de Tailwind CSS modernas. Nunca proponer componentes genéricos o aburridos.
