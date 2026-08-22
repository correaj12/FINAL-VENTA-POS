# Delicias A.V.P. — Registro de Ventas (versión online)

App de registro de ventas diarias, inventario y control mensual, conectada a
una base de datos real en Supabase para que funcione desde cualquier
dispositivo con la misma información.

## 1. Preparar la base de datos (una sola vez)

1. Entra a tu proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor → New query**.
3. Copia y pega todo el contenido de `supabase-setup.sql` (está en esta misma carpeta) y dale **Run**.
4. Deberías ver una tabla nueva llamada `app_data` en **Table Editor**.

No necesitas la contraseña de la base de datos ni el CLI de Supabase para
esto — todo se hace con la URL del proyecto y la llave pública, que ya están
cargadas en `src/supabaseStorage.js`.

## 2. Publicar en Vercel

### Opción A — Con GitHub (recomendada, se actualiza sola)

1. Sube esta carpeta a un repositorio nuevo en GitHub (puede ser privado).
2. Entra a [vercel.com/new](https://vercel.com/new) e importa ese repositorio.
3. Vercel detecta automáticamente que es un proyecto Vite. Dale **Deploy**.
4. En un par de minutos te da una URL como `delicias-avp.vercel.app`.
5. Cada vez que subas un cambio al repositorio, Vercel vuelve a publicar solo.

### Opción B — Sin GitHub, con la terminal

```bash
npm install -g vercel
cd delicias-avp-app
vercel login
vercel --prod
```

Sigue las preguntas en pantalla (nombre del proyecto, etc.) y te entrega la URL al final.

## 3. Usar la app

Abre la URL que te dio Vercel desde cualquier celular, tablet o computadora.
Todos verán las mismas ventas, productos e inventario en tiempo real, porque
todo vive en Supabase, no en el navegador de cada quien.

La contraseña para entrar a **Configuración** (tasa de cambio, inventario,
restablecer datos) sigue siendo `100Millonesde$`.

## Nota de seguridad

La base de datos queda con lectura y escritura abiertas a quien tenga la URL
del sitio (ver el comentario al final de `supabase-setup.sql`). Para un
negocio pequeño el riesgo práctico es bajo, pero no es lo mismo que un login
real. Si más adelante quieres cerrarlo con usuarios y contraseña de verdad a
nivel de base de datos, se puede agregar con Supabase Auth.

## Desarrollo local (opcional)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.
