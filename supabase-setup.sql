-- ============================================================
-- Delicias A.V.P. — Registro de Ventas
-- Ejecuta este script UNA sola vez en:
-- Supabase → tu proyecto → SQL Editor → New query → pega esto → Run
-- ============================================================

-- Tabla única tipo "llave/valor" donde vivirán productos, config y ventas.
create table if not exists app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Habilitar seguridad a nivel de fila (obligatorio en Supabase)
alter table app_data enable row level security;

-- Permitir lectura pública (la app necesita leer productos/ventas sin login)
drop policy if exists "app_data_select_public" on app_data;
create policy "app_data_select_public"
  on app_data for select
  using (true);

-- Permitir insertar/actualizar públicamente (ver nota de seguridad abajo)
drop policy if exists "app_data_upsert_public" on app_data;
create policy "app_data_upsert_public"
  on app_data for insert
  with check (true);

drop policy if exists "app_data_update_public" on app_data;
create policy "app_data_update_public"
  on app_data for update
  using (true)
  with check (true);

-- ============================================================
-- NOTA DE SEGURIDAD:
-- Estas políticas dejan la tabla abierta a cualquiera que tenga
-- la URL y la llave pública del proyecto (que van dentro del código
-- de la página web, visibles para quien inspeccione el sitio).
-- La contraseña "100Millonesde$" de la app solo protege la pantalla
-- de Configuración dentro de la interfaz, NO protege la base de datos
-- a este nivel. Para un negocio pequeño el riesgo práctico es bajo,
-- pero si más adelante quieres protección real a nivel de base de
-- datos, hay que agregar autenticación de Supabase (login real) y
-- cambiar estas políticas para exigir un usuario autenticado.
-- ============================================================
