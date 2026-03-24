---
taxonomy: initiative
key: soccerapp-barrio-mvp
initiative: "SoccerApp Fútbol de Barrio - Rediseño y MVP"
product: SoccerApp
author: Cliente / Anti Gravity
created: 2026-03-24
updated: 2026-03-24
version: "2.0.0"
status: approved
language: es
changelog:
  - date: 2026-03-24
    author: Anti Gravity
    change: "Refactorización a estándar PRD de 9 fases según los nuevos requerimientos y constraints"
---

# SoccerApp: Plataforma de Fútbol de Barrio — Documento de Iniciativa

---

## Fase 1: Contexto del Problema (As-Is)

### 1.1 Estado Actual
Para los torneos de "fútbol de barrio" o ligas aficionadas, no existe un ecosistema digital de información unificado y ordenado. Actualmente, la administración de puntos, resultados y tablas de posiciones se lleva informalmente mediante hojas de Excel o se difunde por grupos de WhatsApp, dificultando el acceso y la transparencia. 
A su vez, aplicaciones masivas del mercado (como 365 Score o Apple Sports) están saturadas de ruido e información desordenada de cientos de ligas que abruman al hincha promedio que solo busca seguir a sus equipos.

### 1.2 Pain Points (Puntos de Dolor)
1. **Descentralización y opacidad:** La tabla de posiciones de un torneo de barrio solo la "sabe" el organizador en su cabeza o en su cuaderno.
2. **Exceso de Información (Ruido):** Las apps comerciales sobre-estimulan al usuario con datos que no aportan valor a su contexto local.
3. **Ausencia de Plataformas para el Barrio:** Los equipos aficionados no tienen una "vitrina" que los haga sentir profesionales y dignos de presumir sus estadísticas.

---

## Fase 2: Visión de Producto y Beneficio final

### 2.1 Declaración de Visión
Ser la plataforma web "Go-To" donde cualquier jugador, organizador o fanático del fútbol pueda desde vibrar con la cuenta regresiva de la Copa del Mundo, hasta administrar y presumir las estadísticas del torneo de su propio barrio, con un nivel de diseño Premium e intuitivo.

### 2.2 Beneficio
- **El Hincha:** Vive una experiencia libre de ruido. Se enfoca en la Copa del Mundo y en las estadísticas puntuales de sus equipos marcados como favoritos.
- **El Organizador:** Empodera su torneo de barrio dándole un aspecto visual sumamente profesional, eliminando la dependencia de enviar PDFs al grupo de WhatsApp.

---

## Fase 3: Descripción de las Capacidades y Flujos (Core)

### 3.1 Flujos Principales del Usuario
- **Flujo 1 (El Gancho Visual / Visitante):** El usuario ingresa a la Home y lo primero que visualiza es un contador inmersivo y llamativo centrado en un partido de talla mundial (Ej. Final de la Copa del Mundo).
- **Flujo 2 (El Consumidor / Hincha):** El usuario se loguea en la app. Consigue acceso a una zona privada donde visualiza las estadísticas exclusivas de sus equipos favoritos (partidos, posición local, puntos).
- **Flujo 3 (El Organizador de Barrio):** El usuario navega al apartado de creación de torneos. Logra estructurar un torneo desde cero (Ej. "Copa Relámpago Barrio"), inscribe equipos, postea manualmente qué equipo ganó en el fin de semana y el sistema gráfica automáticamente la tabla y el rendimiento de los equipos.

---

## Fase 4: Alcance y Límites (Scope and Boundaries)

### 4.1 In-Scope (Lo que construiremos)
- Frontend y Navegación Responsive (Funcional en escritorio y perfecta visualización en navegadores móviles/celulares).
- Sistema híbrido (Consumo de datos globales + Creación de datos super-locales como torneos de barrio).
- Un panel cerrado donde el admin carga / actualiza puntajes manualmente tras finalizar los partidos.

### 4.2 Out-of-Scope (Totalmente prohibido para este MVP)
- **NO Apps Nativas:** No se destinarán esfuerzos a compilar para App Store (iOS) o Google Play (Android).
- **NO Monetización:** No habrá cobros, membresías, ni validaciones de pasarelas de pago. La plataforma es gratuita.
- **NO Tiempo Real:** No habrá integración de APIs costosas de Live-Score automáticos. La actualización de es asíncrona y manual.
- **NO Chats:** No se construirá lógica de WebSockets para chats en vivo entre hinchas.

---

## Fase 5: Criterios de Éxito (Success Criteria)

Al no poseer cobros, la plataforma es un producto puramente orientado a Comunidad (Product-Led Growth). Su éxito no es monetario, sino de profunda satisfacción.

### 5.1 Indicadores Subjetivos (Satisfacción)
- Lograr el *"Efecto Wow"*. Validar que un usuario aficionado logre expresar: _"¡Wow! Pude crear mi torneo, administrarlo y ver exactamente los puntos de mi equipo favorito gratis"_.
- Que el diseño no entorpezca la experiencia, sino que sea tan limpio que rivalice con grandes apps sin estar saturado.

---

## Mapa de Soluciones (Solution Map)

| # | Solución Técnica | Flujos que cubre | Estado |
|---|------------------|------------------|--------|
| **01.1** | **Foundations UI Base** | Flujo 1, 2 y 3 | ✅ Completado |
| **02** | **Plataforma de Gestión de Torneos** (9 Slices Completos) | Flujo 3 (Organizador de Barrio) | ✅ Completado |
| **03** | **Dashboard IA: Probabilidades de Victoria** | Flujo 2 (Consumidor / Hincha) | ✅ Completado |
| **04** | **Arquitectura de Despliegue (Producción)** | Accesibilidad Pública Total | ⏳ Pendiente |
