# Requirements Document

## Introduction

La página principal (`/`) ya existe y muestra un countdown clock con la información del próximo partido. Se añadirá únicamente un botón CTA en la parte inferior de esa página existente, sin modificar ningún contenido ni estilo actual. Dicho botón redirigirá al usuario a una nueva vista (`/navegacion`) que incluirá un navbar de navegación para moverse entre las secciones de la aplicación.

## Glossary

- **Home_Page**: La página principal de la aplicación ubicada en la ruta `/`.
- **Navigation_View**: La nueva vista ubicada en la ruta `/navegacion` que contiene el Navbar.
- **Navbar**: Componente de navegación horizontal que muestra enlaces a las rutas disponibles de la aplicación.
- **CTA_Button**: Botón de llamada a la acción ubicado en la parte inferior de la Home_Page que redirige a la Navigation_View.

## Requirements

### Requirement 1: Botón de acceso en la página principal

**User Story:** Como usuario, quiero ver un botón en la parte inferior de la página principal existente (que ya muestra el countdown clock y la información del partido), para poder acceder a la vista de navegación sin que se altere el contenido actual.

#### Acceptance Criteria

1. THE Home_Page SHALL conservar íntegramente el countdown clock, la información del partido y todos los estilos actuales sin ninguna modificación.
2. THE Home_Page SHALL renderizar el CTA_Button únicamente en la parte inferior del contenido principal existente, como elemento adicional.
3. WHEN el usuario hace clic en el CTA_Button, THE Home_Page SHALL redirigir al usuario a la ruta `/navegacion`.
4. THE CTA_Button SHALL mantener coherencia visual con el diseño oscuro existente (gradientes slate/emerald).

### Requirement 2: Nueva vista con navbar

**User Story:** Como usuario, quiero una vista dedicada con navbar de navegación, para poder desplazarme entre las secciones de la aplicación.

#### Acceptance Criteria

1. THE Navigation_View SHALL estar disponible en la ruta `/navegacion`.
2. THE Navigation_View SHALL renderizar el Navbar en la parte superior de la vista.
3. THE Navbar SHALL mostrar enlaces de navegación hacia las rutas existentes: `/` (Inicio) y `/contador` (Partidos).
4. WHEN el usuario hace clic en un enlace del Navbar, THE Navbar SHALL navegar a la ruta correspondiente.
5. THE Navbar SHALL resaltar visualmente el enlace correspondiente a la ruta activa.

### Requirement 3: No regresión sobre contenido existente

**User Story:** Como desarrollador, quiero que los cambios no afecten las vistas existentes, para garantizar la estabilidad de la aplicación.

#### Acceptance Criteria

1. THE Home_Page SHALL conservar todo su contenido actual (countdown clock e información del partido) y sus estilos sin ninguna modificación, siendo el CTA_Button el único elemento añadido.
2. THE RootLayout SHALL no incluir el Navbar de forma global, de modo que las rutas `/` y `/contador` no se vean afectadas.
