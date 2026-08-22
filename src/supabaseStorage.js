import { createClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/*  Conexión a Supabase                                                */
/*  Puedes sobreescribir estos valores con variables de entorno de     */
/*  Vercel (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) si algún día    */
/*  rotas las llaves. Si no las configuras, usa las de abajo.          */
/* ------------------------------------------------------------------ */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nwjvoieyqtintwmixtxl.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_VSGnqZkAyNd6hWpUH7xD-w_aOwkSoEq";

const TABLE = "app_data";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ------------------------------------------------------------------ */
/*  window.storage respaldado por la tabla app_data de Supabase.       */
/*  Misma forma que el storage de artefactos de Claude (get/set/       */
/*  delete/list), así que el resto de la app (App.jsx) no cambia nada. */
/* ------------------------------------------------------------------ */

window.storage = {
  async get(key) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`No existe la clave: ${key}`);
    return { key, value: JSON.stringify(data.value) };
  },

  async set(key, value) {
    const parsed = JSON.parse(value);
    const { error } = await supabase
      .from(TABLE)
      .upsert({ key, value: parsed, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw error;
    return { key, value };
  },

  async delete(key) {
    const { error } = await supabase.from(TABLE).delete().eq("key", key);
    if (error) throw error;
    return { key, deleted: true };
  },

  async list(prefix) {
    let query = supabase.from(TABLE).select("key");
    if (prefix) query = query.like("key", `${prefix}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { keys: (data || []).map((d) => d.key) };
  },
};
