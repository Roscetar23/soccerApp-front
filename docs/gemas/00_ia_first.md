# GEMA 00: Metodología IA First (Iniciativas y Soluciones)

Esta Gema define el flujo de trabajo entre el Desarrollador (Humano) y la Inteligencia Artificial (IA) para la creación de nuevas funcionalidades bajo el enfoque "IA First".

## Objetivo
La programación la ejecuta la IA bajo la dirección del humano. Para garantizar el éxito, NUNCA se escribe código sin antes haber definido un **Archivo de Iniciativa** y un **Archivo de Solución**.

## Flujo de Trabajo Obligatorio

### Paso 1: Archivo de Iniciativa (El "Qué")
Cuando se solicite una nueva funcionalidad, la IA **no debe asumir nada**. En su lugar, debe actuar como Analista y entrevistar al usuario (quien actúa como **Cliente**).
- La IA realizará preguntas clave sobre: valor de negocio, experiencia de usuario y criterios de aceptación.
- Una vez el usuario (Cliente) responda, la IA redactará y generará el `archivo_de_iniciativa.md`.

### Paso 2: Archivo de Solución (El "Cómo")
Con la Iniciativa aprobada, la IA pasará a definir la arquitectura técnica. Para ello, debe entrevistar al usuario (quien ahora actúa como **Ingeniero/Arquitecto**).
- La IA realizará preguntas puntuales sobre: modelos de datos, endpoints a usar, consideraciones de rendimiento y estructura de componentes en base a la `Gema 01 (Arquitectura y Stack)`.
- Una vez el usuario (Ingeniero) responda, la IA redactará y generará el `archivo_de_solucion.md`.

### Paso 3: Ejecución de Slices (El Código)
Solo cuando el Archivo de Solución esté aprobado, la IA propondrá "Slices" (pequeños trozos verticales funcionales) y procederá a escribir el código paso a paso según las instrucciones detalladas.

> **Regla de Oro para la IA:** No crees los archivos de Iniciativa y Solución de forma automática. Siempre DEBES PREGUNTAR primero al usuario para co-crearlos.
