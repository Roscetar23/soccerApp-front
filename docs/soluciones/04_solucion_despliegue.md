---
taxonomy: solution
key: soccerapp-despliegue-mvp
initiative: "SoccerApp Fútbol de Barrio - Rediseño y MVP"
component: Infraestructura y DevOps
author: Anti Gravity
created: 2026-03-24
status: draft
---

# Estrategia de Despliegue (Producción) de SoccerApp

Este documento arquitectónico es el paso a paso ("Spec") sobre cómo llevaremos los dos microservicios (Backend y Frontend) y la Base de Datos desde nuestro entorno local a servidores públicos gratuitos o de muy bajo costo en la nube para que cualquiera pueda usar SoccerApp.

---

## 1. Topología de la Nube (El Plan)

Nuestra aplicación está dividida en 3 piezas que deben vivir en 3 servicios especializados:

1. **Base de Datos (MongoDB):** Vivirá en **MongoDB Atlas**. Es la creadora original de Mongo, ofrecen un clúster totalmente gratuito y blindado en la nube sin necesidad de configurar servidores de datos a mano.
2. **Backend (NestJS API):** Lo desplegaremos en **Render** (o Railway). Render es la plataforma más amigable actualmente para levantar APIs hechas en Node.js de forma gratuita, conectándose directamente a tu cuenta de GitHub para que cada vez que hagas `git push`, el servidor se actualice solo.
3. **Frontend (Next.js App):** Lo llevaremos naturalmente a **Vercel**. Vercel no solo son los creadores de Next.js, por lo que su sistema está diseñado a la medida, sino que es totalmente gratuito, provee CDNs globales ultra rápidos y certificados SSL de seguridad automáticos.

---

## 2. Roadmap Paso a Paso para la Ejecución

Cuando estemos listos para "echar código" y comandos de terminal, seguiremos estrictamente este orden:

### Paso 1: Empaquetar y Subir el Código (GitHub)
- Asegurarnos de tener 2 repositorios en GitHub: `soccerback` y `soccerfront`.
- No subir archivos sensibles (Revisar los `.gitignore` para omitir `node_modules` y todo archivo `.env`).

### Paso 2: La Base de Datos (MongoDB Atlas)
- Crear una cuenta en MongoDB Atlas.
- Generar un Clúster gratuito (M0).
- Crear un usuario de base de datos con contraseña.
- Otorgar acceso de red ("Network Access") agregando la IP `0.0.0.0/0` para permitir que nuestro futuro Backend hable con ella.
- Obtener nuestra *URI de conexión oficial de producción*.

### Paso 3: Lanzar el Backend (Render)
- Vincular nuestra cuenta de GitHub a Render.com.
- Crear un nuevo **"Web Service"** conectado al repositorio `soccerback`.
- Configurar el Build Command: `npm install && npm run build`
- Configurar el Start Command: `npm run start:prod`
- **Variables de Entorno Clave:** Pegaremos la URI de MongoDB aquí como `MONGO_URI`.
- Esperar que Render nos regale la URL de la API (Ej: `https://soccerback.onrender.com`).

### Paso 4: Lanzar el Frontend (Vercel)
- Vincular GitHub a Vercel.com.
- Seleccionar el repositorio `soccerfront`. Vercel detectará inmediatamente que es Next.js e iniciará las configuraciones correctas por sí solo.
- **Variables de Entorno Clave:** Pegaremos la nueva URL del backend que nos dio Render nombrándola igual a nuestro local `NEXT_PUBLIC_BACKEND_URL` (Ej: `https://soccerback.onrender.com`).
- Compilar.

---

## 3. Checklist de Variables de Entorno y Configuración CERO

Una vez desplegada, nadie en el mundo real tendrá que usar `npm run dev`. La app vivirá sola. Esto requerirá que reemplacemos cualquier mención a `http://localhost:3000` en nuestro código por variables de entorno dinámicas. 

### Frontend (`.env.production`)
- `NEXT_PUBLIC_BACKEND_URL = "https://tu-api.onrender.com"`

### Backend (`.env`)
- `PORT = 8080` (Render asignará un puerto dinámico al azar)
- `MONGO_URI = "mongodb+srv://admin:xxxxxx@cluster0.mongodb.net/soccerapp"`
- `FRONTEND_URL = "https://soccerapp.vercel.app"` (Para habilitar y bloquear el CORS limitándolo a nuestra página web).

---

> **Notas de Progreso:** *Ningún código fue alterado durante la especificación de este documento según instrucciones.* Cuando estés listo para comenzar el despliegue a la nube, avísame y daremos inicio al Paso 1 dictándote cada configuración necesaria.
