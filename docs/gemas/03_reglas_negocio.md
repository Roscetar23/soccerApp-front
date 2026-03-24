# GEMA 03: Reglas de Negocio (Dominio de Fútbol)

Esta Gema contiene el conocimiento funcional de la aplicación. Describe "qué" es el producto y las reglas que rigen su comportamiento.

## 1. Naturaleza del Producto
Es una plataforma web para la gestión de torneos de fútbol, equipos, y el seguimiento de partidos, diseñada para mantener a los aficionados y administradores al tanto de las estadísticas y resultados.

## 2. Entidades Principales (Dominio)
- **Usuarios / Auth:** Personas que consumen la aplicación. Tienen la capacidad de registrarse, loguearse y guardar "Favoritos".
- **Equipos:** Conjunto de jugadores. Un equipo participa en Torneos y juega Partidos.
- **Torneos:** La competición mayor (ej. Mundial, Liga Local). Agrupa múltiples equipos y múltiples partidos.
- **Partidos:** El encuentro entre dos Equipos (Un equipo Local y un equipo Visitante). Ocurren en una fecha y estadio determinados, y pertenecen a un Torneo.

## 3. Funcionalidades Clave
1. **Contador / Cuenta Regresiva:** El sistema destaca los partidos importantes (como finales o mundiales) mostrando un reloj contador en la pantalla principal.
2. **Favoritos:** Los usuarios registrados pueden marcar equipos o torneos como favoritos para darles seguimiento.
3. **Panel Administrativo (`/admin`):** Zona privada (con NextAuth) para la creación, edición y administración de Equipos y Torneos.

## 4. Idioma de la Aplicación
- El código técnico del framework y sintaxis va en Inglés.
- El nombre de las variables de dominio, entidades (modelos en DB), colecciones y URLs va en Español (`equipos`, `torneos`, `partidos`) por convención del proyecto heredado.
- La aplicación cuenta con soporte multi-idioma (i18n usando `next-intl`).
