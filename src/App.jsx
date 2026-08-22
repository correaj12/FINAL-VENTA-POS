import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Coffee, Search, Plus, Minus, Trash2, Smartphone, CreditCard, Banknote,
  DollarSign, Coins, Settings, BarChart3, ClipboardList, Pencil, X, Check,
  AlertTriangle, PackagePlus, Loader2, Receipt, TrendingUp,
  ArrowLeftRight, CalendarDays, Printer, Lock, Unlock, Boxes
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/* ------------------------------------------------------------------ */
/*  Datos base                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEYS = {
  PRODUCTS: "avp_productos",
  CONFIG: "avp_config",
  SALES: "avp_ventas",
};

const CONFIG_PASSWORD = "100Millonesde$";

const CATEGORIAS_BASE = ["Bebidas", "Chuchería", "Menú"];

const DEFAULT_PRODUCTS = [
  { id: "b1", name: "Agua MIBRISA 1,5", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "b2", name: "Agua MIBRISA 500ml 1x24", category: "Bebidas", priceUSD: 1.25, stock: 0, alertaStock: 5 },
  { id: "b3", name: "Agua SABORIZADA", category: "Bebidas", priceUSD: 1.7, stock: 0, alertaStock: 5 },
  { id: "b4", name: "Batido 1 Sabor", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "b5", name: "Batido con Leche", category: "Bebidas", priceUSD: 4.0, stock: 0, alertaStock: 5 },
  { id: "b6", name: "Gatorade PET 500Ml x 12 Unid", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "b7", name: "Gelatina FRESA", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5 },
  { id: "b8", name: "VALLE 250ml", category: "Bebidas", priceUSD: 1.7, stock: 0, alertaStock: 5 },
  { id: "b9", name: "Jugo FRICA 250ml", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5 },
  { id: "b10", name: "Jugo LALO Durz / Manz / Naranja 0,40Lts", category: "Bebidas", priceUSD: 2.3, stock: 0, alertaStock: 5 },
  { id: "b11", name: "Lipton 500Ml x 12 Unid", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "b12", name: "Malta de LATA", category: "Bebidas", priceUSD: 2.6, stock: 0, alertaStock: 5 },
  { id: "b13", name: "Maltin N/R 225ml x 12Unid", category: "Bebidas", priceUSD: 1.5, stock: 0, alertaStock: 5 },
  { id: "b14", name: "Maltin POLAR Botella Ret 222ml x 36Unid", category: "Bebidas", priceUSD: 1.0, stock: 0, alertaStock: 5 },
  { id: "b15", name: "Refresco / Valle 1,5Lts", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "b16", name: "Refresco coca cola 2lt", category: "Bebidas", priceUSD: 2.6, stock: 0, alertaStock: 5 },
  { id: "b17", name: "Refresco Coca cola LATA", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "b18", name: "Refresco PET 355ML N/R", category: "Bebidas", priceUSD: 1.5, stock: 0, alertaStock: 5 },
  { id: "b19", name: "Refrescos 1litro variado x 6Unid", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5 },
  { id: "b20", name: "Refrescos Botella Mezclados 350Ml 24Unid", category: "Bebidas", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "b21", name: "Rikomalt / Chica / Avena 250ml PARMALAT", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "b22", name: "Rockstar 24Unid", category: "Bebidas", priceUSD: 2.3, stock: 0, alertaStock: 5 },
  { id: "b23", name: "Santal Active ZANH-NARJ 1500ml 1x6", category: "Bebidas", priceUSD: 8.5, stock: 0, alertaStock: 5 },
  { id: "b24", name: "Santal Active ZANH-NARJ 500ml 1x6", category: "Bebidas", priceUSD: 3.6, stock: 0, alertaStock: 5 },
  { id: "b25", name: "Soda", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5 },
  { id: "b26", name: "Té LALO Durz / Limo", category: "Bebidas", priceUSD: 2.3, stock: 0, alertaStock: 5 },
  { id: "b27", name: "Té PARMALAT 250ml", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5 },
  { id: "b28", name: "Yogurt FIRME Fresa LALO", category: "Bebidas", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "b29", name: "Yogurt Con cereal LALO", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "b30", name: "YOKA", category: "Bebidas", priceUSD: 3.2, stock: 0, alertaStock: 5 },
  { id: "b31", name: "YOLO Yogurt liq", category: "Bebidas", priceUSD: 3.5, stock: 0, alertaStock: 5 },
  { id: "b32", name: "Yogurt firme YOLO", category: "Bebidas", priceUSD: 3.5, stock: 0, alertaStock: 5 },
  { id: "b33", name: "Migurt FRUTA", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "c1", name: "Arfajores", category: "Chuchería", priceUSD: 1.9, stock: 0, alertaStock: 5 },
  { id: "c2", name: "Aros de cebolla TOM", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c3", name: "Belvita Hony Bran / Kraket Bran 9x28Gr", category: "Chuchería", priceUSD: 0.7, stock: 0, alertaStock: 5 },
  { id: "c4", name: "Bocaditos", category: "Chuchería", priceUSD: 0.95, stock: 0, alertaStock: 5 },
  { id: "c5", name: "Brownies", category: "Chuchería", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "c6", name: "Brownies MINI 175gr", category: "Chuchería", priceUSD: 2.8, stock: 0, alertaStock: 5 },
  { id: "c7", name: "Bubaloo", category: "Chuchería", priceUSD: 0.25, stock: 0, alertaStock: 5 },
  { id: "c8", name: "Caramelos VARIOS 3 x 100", category: "Chuchería", priceUSD: 0.15, stock: 0, alertaStock: 5 },
  { id: "c9", name: "Chicle BOLA AGOGO 24U", category: "Chuchería", priceUSD: 0.5, stock: 0, alertaStock: 5 },
  { id: "c10", name: "Chocolate de leche / RIKITY 1x12 SAVOY", category: "Chuchería", priceUSD: 2.2, stock: 0, alertaStock: 5 },
  { id: "c11", name: "Chupeta Pin Pon", category: "Chuchería", priceUSD: 0.25, stock: 0, alertaStock: 5 },
  { id: "c12", name: "Club Social 6x26gr", category: "Chuchería", priceUSD: 0.7, stock: 0, alertaStock: 5 },
  { id: "c13", name: "Cocosette / Susy Maxi 18 x 50g", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5 },
  { id: "c14", name: "Cocosette MINI 18x25gr", category: "Chuchería", priceUSD: 1.3, stock: 0, alertaStock: 5 },
  { id: "c15", name: "CriCri chocolate", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "c16", name: "De todito XXXL 360gr", category: "Chuchería", priceUSD: 8.34, stock: 0, alertaStock: 5 },
  { id: "c17", name: "Flaquito", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "c18", name: "Flips 120gs", category: "Chuchería", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "c19", name: "FREEGELLS VITAC 12Unds", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "c20", name: "Galleta DANI CHIP", category: "Chuchería", priceUSD: 0.6, stock: 0, alertaStock: 5 },
  { id: "c21", name: "Galleta TIP TOP", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5 },
  { id: "c22", name: "Galletas AVENA / GRANOLA / CHIPS", category: "Chuchería", priceUSD: 1.7, stock: 0, alertaStock: 5 },
  { id: "c23", name: "Galletas KATY", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c24", name: "Galletas SALUDABLE", category: "Chuchería", priceUSD: 1.9, stock: 0, alertaStock: 5 },
  { id: "c25", name: "JaenCAke", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "c26", name: "Life Savers Surtido 10U", category: "Chuchería", priceUSD: 2.56, stock: 0, alertaStock: 5 },
  { id: "c27", name: "Mani JAP / SAL MUNCHY", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "c28", name: "Mani Mixto", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c29", name: "Mento 12U", category: "Chuchería", priceUSD: 1.0, stock: 0, alertaStock: 5 },
  { id: "c30", name: "Mini MARIA bolsa 200Gr", category: "Chuchería", priceUSD: 2.2, stock: 0, alertaStock: 5 },
  { id: "c31", name: "Nutelini 1x12", category: "Chuchería", priceUSD: 0.6, stock: 0, alertaStock: 5 },
  { id: "c32", name: "OREO Chocolate paq (1x6)", category: "Chuchería", priceUSD: 1.0, stock: 0, alertaStock: 5 },
  { id: "c33", name: "Palitos mostrador 18x30", category: "Chuchería", priceUSD: 0.95, stock: 0, alertaStock: 5 },
  { id: "c34", name: "Palmerita", category: "Chuchería", priceUSD: 0.85, stock: 0, alertaStock: 5 },
  { id: "c35", name: "Pepito 180g XXL", category: "Chuchería", priceUSD: 3.5, stock: 0, alertaStock: 5 },
  { id: "c36", name: "Piruetas 20g x 24Unid", category: "Chuchería", priceUSD: 0.6, stock: 0, alertaStock: 5 },
  { id: "c37", name: "REX Bolsa 200Gr", category: "Chuchería", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "c38", name: "Rikiti 12x30Gr", category: "Chuchería", priceUSD: 1.9, stock: 0, alertaStock: 5 },
  { id: "c39", name: "Samba MINI", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c40", name: "Cheetos Mega Puff", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5 },
  { id: "c41", name: "Boliqueso", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5 },
  { id: "c42", name: "Chees tris", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5 },
  { id: "c43", name: "pepitos", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5 },
  { id: "c44", name: "Chiskesito Orig", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "c45", name: "Toci", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "c46", name: "Dorito Dina - Queso", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5 },
  { id: "c47", name: "D TODITO", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5 },
  { id: "c48", name: "Papas PUNCH", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5 },
  { id: "c49", name: "Platatito", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5 },
  { id: "c50", name: "Raquety PICANT", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c51", name: "NORMAL", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c52", name: "ChisKronch T", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c53", name: "Kesito", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c54", name: "BoliKruch", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c55", name: "Ruffles", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "c56", name: "Chicharron", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "c57", name: "Tocinetikas", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "c58", name: "Yuca", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5 },
  { id: "c59", name: "Tronkolate MINI", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c60", name: "Turrón Maní", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5 },
  { id: "c61", name: "Torta Manzana (1x6)", category: "Chuchería", priceUSD: 2.5, stock: 0, alertaStock: 5 },
  { id: "m1", name: "Empanada", category: "Menú", priceUSD: 1.3, stock: 0, alertaStock: 5 },
  { id: "m2", name: "Tequeñon", category: "Menú", priceUSD: 1.5, stock: 0, alertaStock: 5 },
  { id: "m3", name: "Tequeñon PROMO", category: "Menú", priceUSD: 2.0, stock: 0, alertaStock: 5 },
  { id: "m4", name: "Pizza SLICE", category: "Menú", priceUSD: 1.2, stock: 0, alertaStock: 5 },
  { id: "m5", name: "sandwich jamó y queso", category: "Menú", priceUSD: 3.0, stock: 0, alertaStock: 5 },
  { id: "m6", name: "Arepa asada", category: "Menú", priceUSD: 3.6, stock: 0, alertaStock: 5 },
  { id: "m7", name: "Dasayuno CRIOLLO", category: "Menú", priceUSD: 5.0, stock: 0, alertaStock: 5 },
  { id: "m8", name: "Desayuno AMERICANO", category: "Menú", priceUSD: 5.0, stock: 0, alertaStock: 5 },
  { id: "m9", name: "Omelet", category: "Menú", priceUSD: 4.0, stock: 0, alertaStock: 5 },
  { id: "m10", name: "Milanesa de pollo", category: "Menú", priceUSD: 9.0, stock: 0, alertaStock: 5 },
  { id: "m11", name: "Chuleta de CERDO", category: "Menú", priceUSD: 12.0, stock: 0, alertaStock: 5 },
  { id: "m12", name: "Solomo de Res", category: "Menú", priceUSD: 12.0, stock: 0, alertaStock: 5 },
  { id: "m13", name: "Chuleta AHUMADA", category: "Menú", priceUSD: 7.5, stock: 0, alertaStock: 5 },
  { id: "m14", name: "Calamares rebozados", category: "Menú", priceUSD: 15.0, stock: 0, alertaStock: 5 },
  { id: "m15", name: "Camarones al ajillo", category: "Menú", priceUSD: 15.0, stock: 0, alertaStock: 5 },
  { id: "m16", name: "Pasta Bologna", category: "Menú", priceUSD: 5.5, stock: 0, alertaStock: 5 },
  { id: "m17", name: "Parrilla mixta", category: "Menú", priceUSD: 18.0, stock: 0, alertaStock: 5 },
  { id: "m18", name: "Ensalada cesar con Pollo", category: "Menú", priceUSD: 8.0, stock: 0, alertaStock: 5 },
  { id: "m19", name: "Smash Burguer con queso", category: "Menú", priceUSD: 5.5, stock: 0, alertaStock: 5 },
  { id: "m20", name: "Hamburguesa Clasica + PAPAS", category: "Menú", priceUSD: 8.0, stock: 0, alertaStock: 5 },
  { id: "m21", name: "Hamburguesa DOBLE + PAPAS", category: "Menú", priceUSD: 10.0, stock: 0, alertaStock: 5 },
  { id: "m22", name: "Club House + PAPAS", category: "Menú", priceUSD: 12.0, stock: 0, alertaStock: 5 },
];

const DEFAULT_CONFIG = { tasaCambio: 800 };

const PAYMENT_METHODS = [
  { id: "pago_movil", label: "Pago Móvil", currency: "Bs", icon: Smartphone, needsRef: true },
  { id: "debito", label: "Débito", currency: "Bs", icon: CreditCard, needsRef: false },
  { id: "efectivo_bs", label: "Efectivo Bs", currency: "Bs", icon: Banknote, needsRef: false },
  { id: "efectivo_usd", label: "Efectivo $", currency: "$", icon: DollarSign, needsRef: false },
  { id: "usdt", label: "USDT", currency: "$", icon: Coins, needsRef: false },
];

const TABS = [
  { id: "venta", label: "Nueva Venta", icon: Receipt },
  { id: "jornada", label: "Jornada", icon: ClipboardList },
  { id: "historial", label: "Historial", icon: BarChart3 },
  { id: "productos", label: "Productos", icon: Coffee },
  { id: "config", label: "Configuración", icon: Settings },
];

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}
function thisMonthKey() {
  return todayISO().slice(0, 7);
}
function formatUSD(n) {
  return `$${(Number(n) || 0).toFixed(2)}`;
}
function formatBs(n) {
  return `${(Number(n) || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
}
function formatFechaLarga(fecha) {
  try {
    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-VE", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch { return fecha; }
}
function formatHora(ts) {
  try { return new Date(ts).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}
function paymentMeta(id) {
  return PAYMENT_METHODS.find((m) => m.id === id) || PAYMENT_METHODS[0];
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("venta");
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [sales, setSales] = useState([]);
  const [displayCurrency, setDisplayCurrency] = useState("USD"); // 'USD' | 'BS'
  const [toast, setToast] = useState(null);
  const [printData, setPrintData] = useState(null);

  const showToast = useCallback((text, kind = "error") => {
    setToast({ text, kind, key: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const triggerPrint = useCallback((data) => {
    setPrintData(data);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }, []);

  // Carga inicial
  useEffect(() => {
    (async () => {
      let p = null, c = null, s = null;
      try { p = await window.storage.get(STORAGE_KEYS.PRODUCTS); } catch (e) { /* no existe aún */ }
      try { c = await window.storage.get(STORAGE_KEYS.CONFIG); } catch (e) { /* no existe aún */ }
      try { s = await window.storage.get(STORAGE_KEYS.SALES); } catch (e) { /* no existe aún */ }

      const initialProducts = p ? JSON.parse(p.value) : DEFAULT_PRODUCTS;
      const initialConfig = c ? JSON.parse(c.value) : DEFAULT_CONFIG;
      const initialSales = s ? JSON.parse(s.value) : [];

      setProducts(initialProducts);
      setConfig(initialConfig);
      setSales(initialSales);

      try {
        if (!p) await window.storage.set(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        if (!c) await window.storage.set(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      } catch (e) { /* se reintenta en el próximo guardado */ }

      setLoading(false);
    })();
  }, []);

  const persistProducts = useCallback(async (next) => {
    setProducts(next);
    try { await window.storage.set(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); }
    catch (e) { showToast("No se pudo guardar la lista de productos. Intenta de nuevo."); }
  }, [showToast]);

  const persistConfig = useCallback(async (next) => {
    setConfig(next);
    try { await window.storage.set(STORAGE_KEYS.CONFIG, JSON.stringify(next)); }
    catch (e) { showToast("No se pudo guardar la configuración. Intenta de nuevo."); }
  }, [showToast]);

  const persistSales = useCallback(async (next) => {
    setSales(next);
    try { await window.storage.set(STORAGE_KEYS.SALES, JSON.stringify(next)); }
    catch (e) { showToast("No se pudo guardar la venta. Revisa tu conexión e intenta de nuevo."); }
  }, [showToast]);

  const resetAll = useCallback(async () => {
    try {
      await window.storage.set(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      await window.storage.set(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      await window.storage.set(STORAGE_KEYS.SALES, JSON.stringify([]));
      setProducts(DEFAULT_PRODUCTS);
      setConfig(DEFAULT_CONFIG);
      setSales([]);
      showToast("Datos restablecidos.", "ok");
    } catch (e) { showToast("No se pudo restablecer los datos."); }
  }, [showToast]);

  if (loading) {
    return (
      <div className="gy-root gy-loading">
        <StyleBlock />
        <Loader2 className="animate-spin" size={28} />
        <p>Abriendo la caja…</p>
      </div>
    );
  }

  return (
    <div className="gy-root">
      <StyleBlock />
      <Header displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} tasa={config.tasaCambio} />
      <TabNav tab={tab} setTab={setTab} />

      <main className="gy-main">
        {tab === "venta" && (
          <NuevaVentaTab
            products={products}
            config={config}
            sales={sales}
            persistSales={persistSales}
            persistProducts={persistProducts}
            displayCurrency={displayCurrency}
            showToast={showToast}
            triggerPrint={triggerPrint}
          />
        )}
        {tab === "jornada" && (
          <JornadaTab sales={sales} persistSales={persistSales} triggerPrint={triggerPrint} />
        )}
        {tab === "historial" && (
          <HistorialTab sales={sales} />
        )}
        {tab === "productos" && (
          <ProductosTab
            products={products}
            persistProducts={persistProducts}
            config={config}
            displayCurrency={displayCurrency}
          />
        )}
        {tab === "config" && (
          <ConfiguracionTab
            config={config}
            persistConfig={persistConfig}
            resetAll={resetAll}
            products={products}
            persistProducts={persistProducts}
            showToast={showToast}
          />
        )}
      </main>

      {toast && (
        <div className={`gy-toast ${toast.kind === "ok" ? "gy-toast-ok" : "gy-toast-error"}`} key={toast.key}>
          {toast.kind === "ok" ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      <PrintableTicket data={printData} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header + navegación                                                */
/* ------------------------------------------------------------------ */

function Header({ displayCurrency, setDisplayCurrency, tasa }) {
  return (
    <header className="gy-header">
      <div className="gy-brand">
        <span className="gy-brand-icon"><Coffee size={22} /></span>
        <div>
          <h1>Delicias A.V.P.</h1>
          <p>Restaurante · Cafetería · Coworking</p>
        </div>
      </div>
      <div className="gy-header-right">
        <div className="gy-rate-pill">
          <ArrowLeftRight size={14} />
          <span>1$ = {tasa.toLocaleString("es-VE")} Bs</span>
        </div>
        <button
          type="button"
          className="gy-currency-toggle"
          onClick={() => setDisplayCurrency((c) => (c === "USD" ? "BS" : "USD"))}
          title="Cambiar moneda de visualización"
        >
          <span className={displayCurrency === "USD" ? "on" : ""}>$</span>
          <span className={displayCurrency === "BS" ? "on" : ""}>Bs</span>
        </button>
      </div>
    </header>
  );
}

function TabNav({ tab, setTab }) {
  return (
    <nav className="gy-tabnav">
      {TABS.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            className={`gy-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            <Icon size={17} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Tique imprimible (solo visible en @media print)                     */
/* ------------------------------------------------------------------ */

function PrintableTicket({ data }) {
  if (!data) return null;
  const pago = data.formaPago ? paymentMeta(data.formaPago) : null;
  return (
    <div className="gy-print-ticket">
      <div className="gy-print-head">DELICIAS A.V.P.</div>
      <div className="gy-print-sub">Restaurante · Cafetería · Coworking</div>
      <div className="gy-print-line" />
      <div className="gy-print-sub">Tique #{data.numeroTicket || "—"}</div>
      <div className="gy-print-sub">{formatFechaLarga(data.fecha)}</div>
      <div className="gy-print-line" />
      {(data.items || []).map((i) => (
        <div className="gy-print-item" key={i.productId}>
          <span>{i.qty}&times; {i.name}</span>
          <span>{formatUSD(i.priceUSD * i.qty)}</span>
        </div>
      ))}
      <div className="gy-print-line" />
      <div className="gy-print-total"><span>Total $</span><span>{formatUSD(data.totalUSD)}</span></div>
      <div className="gy-print-total"><span>Total Bs</span><span>{formatBs(data.totalBs)}</span></div>
      <div className="gy-print-line" />
      <div className="gy-print-sub">
        {pago ? pago.label : "Pago pendiente"}{data.referencia ? ` · Ref. ${data.referencia}` : ""}
      </div>
      <div className="gy-print-thanks">¡Gracias por tu visita!</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Nueva Venta                                                    */
/* ------------------------------------------------------------------ */

function NuevaVentaTab({ products, config, sales, persistSales, persistProducts, displayCurrency, showToast, triggerPrint }) {
  const [fecha, setFecha] = useState(todayISO());
  const [cart, setCart] = useState([]); // {productId, name, priceUSD, qty}
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [numeroTicket, setNumeroTicket] = useState("");
  const [formaPago, setFormaPago] = useState(null);
  const [referencia, setReferencia] = useState("");
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  const suggestTicket = useCallback((forFecha, salesList) => {
    const count = salesList.filter((s) => s.fecha === forFecha).length;
    return String(count + 1);
  }, []);

  useEffect(() => {
    setNumeroTicket((prev) => (prev ? prev : suggestTicket(fecha, sales)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setNumeroTicket((prev) => {
      if (prev === "" || /^\d+$/.test(prev)) return suggestTicket(fecha, sales);
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, products]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const lowStock = useMemo(
    () => products.filter((p) => typeof p.stock === "number" && typeof p.alertaStock === "number" && p.stock <= p.alertaStock),
    [products]
  );

  const addToCart = useCallback((product) => {
    if (typeof product.stock === "number" && product.stock <= 0) {
      showToast(`«${product.name}» figura sin stock en el inventario.`, "error");
    }
    setCart((prev) => {
      const found = prev.find((i) => i.productId === product.id);
      if (found) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { productId: product.id, name: product.name, priceUSD: product.priceUSD, qty: 1 }];
    });
    setQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [showToast]);

  const changeQty = useCallback((productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const totalUSD = useMemo(() => cart.reduce((sum, i) => sum + i.priceUSD * i.qty, 0), [cart]);
  const totalBs = totalUSD * config.tasaCambio;

  const pago = formaPago ? paymentMeta(formaPago) : null;

  function handleKeyDown(e) {
    if (!showDropdown || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); addToCart(results[activeIndex]); }
    else if (e.key === "Escape") { setShowDropdown(false); }
  }

  function validate() {
    const errs = {};
    if (cart.length === 0) errs.cart = "Agrega al menos un producto.";
    if (!numeroTicket.trim()) errs.numeroTicket = "Coloca el número de tique.";
    if (!formaPago) errs.formaPago = "Selecciona la forma de pago.";
    if (formaPago === "pago_movil" && !referencia.trim()) errs.referencia = "Coloca el número de referencia.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleGuardar() {
    if (!validate()) return;
    const nueva = {
      id: uid("venta"),
      fecha,
      numeroTicket: numeroTicket.trim(),
      items: cart,
      totalUSD,
      totalBs,
      tasaUsada: config.tasaCambio,
      formaPago,
      referencia: formaPago === "pago_movil" ? referencia.trim() : "",
      timestamp: new Date().toISOString(),
    };
    const next = [...sales, nueva];
    await persistSales(next);

    // Descontar del inventario los productos vendidos
    const nextProducts = products.map((p) => {
      const item = cart.find((i) => i.productId === p.id);
      if (!item || typeof p.stock !== "number") return p;
      return { ...p, stock: Math.max(0, p.stock - item.qty) };
    });
    await persistProducts(nextProducts);

    showToast(`Venta #${nueva.numeroTicket} registrada.`, "ok");
    setCart([]);
    setFormaPago(null);
    setReferencia("");
    setErrors({});
    setNumeroTicket(suggestTicket(fecha, next));
  }

  function handlePrint() {
    triggerPrint({
      numeroTicket: numeroTicket.trim(),
      fecha,
      items: cart,
      totalUSD,
      totalBs,
      formaPago,
      referencia,
    });
  }

  return (
    <div className="gy-venta-grid">
      <section className="gy-panel">
        {lowStock.length > 0 && (
          <div className="gy-lowstock-banner">
            <AlertTriangle size={14} />
            <span>
              Stock bajo: {lowStock.slice(0, 6).map((p) => p.name).join(", ")}
              {lowStock.length > 6 ? ` y ${lowStock.length - 6} más` : ""}
            </span>
          </div>
        )}

        <div className="gy-field">
          <label>Fecha de la venta</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="gy-input" />
        </div>

        <div className="gy-field gy-search-field">
          <label>Buscar producto</label>
          <div className="gy-search-box">
            <Search size={16} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe el nombre… ej: empanada"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
              onKeyDown={handleKeyDown}
              className="gy-search-input"
            />
          </div>
          {showDropdown && query && (
            <div className="gy-dropdown">
              {results.length === 0 && <div className="gy-dropdown-empty">Sin coincidencias para “{query}”.</div>}
              {results.map((p, idx) => {
                const low = typeof p.stock === "number" && typeof p.alertaStock === "number" && p.stock <= p.alertaStock;
                return (
                  <button
                    type="button"
                    key={p.id}
                    className={`gy-dropdown-item ${idx === activeIndex ? "active" : ""}`}
                    onMouseDown={() => addToCart(p)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div>
                      <span className="gy-dd-name">{p.name}</span>
                      <span className={`gy-dd-cat ${low ? "low" : ""}`}>
                        {p.category}{typeof p.stock === "number" ? ` · Stock: ${p.stock}` : ""}
                      </span>
                    </div>
                    <span className="gy-dd-price">
                      {displayCurrency === "USD" ? formatUSD(p.priceUSD) : formatBs(p.priceUSD * config.tasaCambio)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {errors.cart && <p className="gy-error-text">{errors.cart}</p>}

        <div className="gy-field">
          <label>Forma de pago</label>
          <div className="gy-payment-grid">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  type="button"
                  key={m.id}
                  className={`gy-payment-btn ${formaPago === m.id ? "active" : ""}`}
                  onClick={() => setFormaPago(m.id)}
                >
                  <Icon size={16} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
          {errors.formaPago && <p className="gy-error-text">{errors.formaPago}</p>}
        </div>

        {formaPago === "pago_movil" && (
          <div className="gy-field">
            <label>Número de referencia (Pago Móvil)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 004521"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="gy-input"
            />
            {errors.referencia && <p className="gy-error-text">{errors.referencia}</p>}
          </div>
        )}
      </section>

      <section className="gy-ticket-wrap">
        <div className="gy-ticket ticket-edge-bottom">
          <div className="gy-ticket-head">
            <Coffee size={18} />
            <span>Delicias A.V.P.</span>
          </div>
          <div className="gy-ticket-sub">
            <span>Tique</span>
            <input
              className="gy-ticket-num-input"
              value={numeroTicket}
              onChange={(e) => setNumeroTicket(e.target.value)}
              placeholder="N°"
            />
          </div>
          {errors.numeroTicket && <p className="gy-error-text">{errors.numeroTicket}</p>}
          <div className="gy-ticket-sub muted">{formatFechaLarga(fecha)}</div>

          <div className="gy-ticket-items">
            {cart.length === 0 && <p className="gy-ticket-empty">Aún no hay productos agregados.</p>}
            {cart.map((i) => (
              <div className="gy-ticket-item" key={i.productId}>
                <div className="gy-ticket-item-info">
                  <span className="gy-ticket-item-name">{i.name}</span>
                  <span className="gy-ticket-item-price">
                    {displayCurrency === "USD" ? formatUSD(i.priceUSD) : formatBs(i.priceUSD * config.tasaCambio)} c/u
                  </span>
                </div>
                <div className="gy-qty-stepper">
                  <button type="button" onClick={() => changeQty(i.productId, -1)}><Minus size={13} /></button>
                  <span>{i.qty}</span>
                  <button type="button" onClick={() => changeQty(i.productId, 1)}><Plus size={13} /></button>
                </div>
                <button type="button" className="gy-remove-item" onClick={() => removeItem(i.productId)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="gy-ticket-totals">
            <div className="gy-total-row"><span>Total $</span><strong>{formatUSD(totalUSD)}</strong></div>
            <div className="gy-total-row"><span>Total Bs</span><strong>{formatBs(totalBs)}</strong></div>
          </div>

          {pago && (
            <div className="gy-ticket-pago">
              <pago.icon size={14} />
              <span>{pago.label}</span>
              {pago.id === "pago_movil" && referencia && <span className="gy-ticket-ref">Ref. {referencia}</span>}
            </div>
          )}
        </div>

        <div className="gy-ticket-actions">
          <button type="button" className="gy-btn-ghost gy-print-btn" onClick={handlePrint} disabled={cart.length === 0}>
            <Printer size={16} /> Imprimir
          </button>
          <button type="button" className="gy-btn-primary gy-save-btn" onClick={handleGuardar}>
            <Check size={17} /> Registrar venta
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Jornada (control diario)                                       */
/* ------------------------------------------------------------------ */

function JornadaTab({ sales, persistSales, triggerPrint }) {
  const [fecha, setFecha] = useState(todayISO());
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const ventasDia = useMemo(
    () => sales.filter((s) => s.fecha === fecha).sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [sales, fecha]
  );

  const totalUSD = ventasDia.reduce((s, v) => s + v.totalUSD, 0);
  const totalBs = ventasDia.reduce((s, v) => s + v.totalBs, 0);

  const porMetodo = useMemo(() => {
    const map = {};
    PAYMENT_METHODS.forEach((m) => { map[m.id] = { count: 0, usd: 0, bs: 0 }; });
    ventasDia.forEach((v) => {
      if (!map[v.formaPago]) map[v.formaPago] = { count: 0, usd: 0, bs: 0 };
      map[v.formaPago].count += 1;
      map[v.formaPago].usd += v.totalUSD;
      map[v.formaPago].bs += v.totalBs;
    });
    return map;
  }, [ventasDia]);

  async function handleDelete(id) {
    await persistSales(sales.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <div className="gy-stack">
      <div className="gy-field gy-date-picker">
        <label><CalendarDays size={15} /> Jornada</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="gy-input" />
      </div>

      <div className="gy-summary-cards">
        <div className="gy-card">
          <span className="gy-card-label">Tiques</span>
          <span className="gy-card-value">{ventasDia.length}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total $</span>
          <span className="gy-card-value">{formatUSD(totalUSD)}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total Bs</span>
          <span className="gy-card-value">{formatBs(totalBs)}</span>
        </div>
      </div>

      <div className="gy-method-grid">
        {PAYMENT_METHODS.map((m) => {
          const d = porMetodo[m.id] || { count: 0, usd: 0, bs: 0 };
          const Icon = m.icon;
          return (
            <div className="gy-method-card" key={m.id}>
              <div className="gy-method-head"><Icon size={15} /><span>{m.label}</span></div>
              <span className="gy-method-count">{d.count} tique{d.count === 1 ? "" : "s"}</span>
              <span className="gy-method-amount">{m.currency === "Bs" ? formatBs(d.bs) : formatUSD(d.usd)}</span>
            </div>
          );
        })}
      </div>

      <div className="gy-list">
        {ventasDia.length === 0 && (
          <p className="gy-empty-state">No hay ventas registradas para el {formatFechaLarga(fecha)}.</p>
        )}
        {ventasDia.map((v) => {
          const pago = paymentMeta(v.formaPago);
          const PagoIcon = pago.icon;
          return (
            <div className="gy-sale-row" key={v.id}>
              <div className="gy-sale-main">
                <span className="gy-sale-ticket">#{v.numeroTicket}</span>
                <span className="gy-sale-hora">{formatHora(v.timestamp)}</span>
                <span className="gy-sale-items">{v.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>
              </div>
              <div className="gy-sale-side">
                <span className="gy-sale-total">{formatUSD(v.totalUSD)} · {formatBs(v.totalBs)}</span>
                <span className="gy-sale-pago"><PagoIcon size={13} /> {pago.label}{v.referencia ? ` · Ref. ${v.referencia}` : ""}</span>
              </div>
              <button
                type="button"
                className="gy-icon-btn"
                title="Imprimir tique"
                onClick={() => triggerPrint({
                  numeroTicket: v.numeroTicket, fecha: v.fecha, items: v.items,
                  totalUSD: v.totalUSD, totalBs: v.totalBs, formaPago: v.formaPago, referencia: v.referencia,
                })}
              >
                <Printer size={15} />
              </button>
              {confirmDeleteId === v.id ? (
                <div className="gy-confirm-inline">
                  <button type="button" className="gy-btn-danger-sm" onClick={() => handleDelete(v.id)}>Eliminar</button>
                  <button type="button" className="gy-btn-ghost-sm" onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
                </div>
              ) : (
                <button type="button" className="gy-icon-btn-danger" onClick={() => setConfirmDeleteId(v.id)} title="Eliminar venta">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Historial mensual                                              */
/* ------------------------------------------------------------------ */

function HistorialTab({ sales }) {
  const [mes, setMes] = useState(thisMonthKey());

  const ventasMes = useMemo(() => sales.filter((s) => s.fecha.startsWith(mes)), [sales, mes]);

  const porDia = useMemo(() => {
    const map = {};
    ventasMes.forEach((v) => {
      if (!map[v.fecha]) map[v.fecha] = { fecha: v.fecha, tickets: 0, totalUSD: 0, totalBs: 0 };
      map[v.fecha].tickets += 1;
      map[v.fecha].totalUSD += v.totalUSD;
      map[v.fecha].totalBs += v.totalBs;
    });
    return Object.values(map).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [ventasMes]);

  const totalUSD = ventasMes.reduce((s, v) => s + v.totalUSD, 0);
  const totalBs = ventasMes.reduce((s, v) => s + v.totalBs, 0);

  const porMetodo = useMemo(() => {
    const map = {};
    PAYMENT_METHODS.forEach((m) => { map[m.id] = { count: 0, usd: 0, bs: 0 }; });
    ventasMes.forEach((v) => {
      if (!map[v.formaPago]) map[v.formaPago] = { count: 0, usd: 0, bs: 0 };
      map[v.formaPago].count += 1;
      map[v.formaPago].usd += v.totalUSD;
      map[v.formaPago].bs += v.totalBs;
    });
    return map;
  }, [ventasMes]);

  const chartData = porDia.map((d) => ({ dia: d.fecha.slice(8, 10), Bs: Math.round(d.totalBs) }));

  return (
    <div className="gy-stack">
      <div className="gy-field gy-date-picker">
        <label><CalendarDays size={15} /> Mes</label>
        <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="gy-input" />
      </div>

      <div className="gy-summary-cards">
        <div className="gy-card">
          <span className="gy-card-label">Días con venta</span>
          <span className="gy-card-value">{porDia.length}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total $</span>
          <span className="gy-card-value">{formatUSD(totalUSD)}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total Bs</span>
          <span className="gy-card-value">{formatBs(totalBs)}</span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="gy-chart-box">
          <span className="gy-chart-title"><TrendingUp size={14} /> Ventas por día (Bs)</span>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1DAC9" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#6F6659" }} axisLine={{ stroke: "#E1DAC9" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6F6659" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip
                formatter={(v) => [`${Number(v).toLocaleString("es-VE")} Bs`, "Total"]}
                labelFormatter={(l) => `Día ${l}`}
                contentStyle={{ borderRadius: 10, border: "1px solid #E1DAC9", fontSize: 12 }}
              />
              <Bar dataKey="Bs" fill="#2E6B47" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="gy-method-grid">
        {PAYMENT_METHODS.map((m) => {
          const d = porMetodo[m.id] || { count: 0, usd: 0, bs: 0 };
          const Icon = m.icon;
          return (
            <div className="gy-method-card" key={m.id}>
              <div className="gy-method-head"><Icon size={15} /><span>{m.label}</span></div>
              <span className="gy-method-count">{d.count} tique{d.count === 1 ? "" : "s"}</span>
              <span className="gy-method-amount">{m.currency === "Bs" ? formatBs(d.bs) : formatUSD(d.usd)}</span>
            </div>
          );
        })}
      </div>

      <div className="gy-table-wrap">
        {porDia.length === 0 ? (
          <p className="gy-empty-state">No hay ventas registradas en este mes.</p>
        ) : (
          <table className="gy-table">
            <thead>
              <tr><th>Fecha</th><th>Tiques</th><th>Total $</th><th>Total Bs</th></tr>
            </thead>
            <tbody>
              {porDia.map((d) => (
                <tr key={d.fecha}>
                  <td>{formatFechaLarga(d.fecha)}</td>
                  <td>{d.tickets}</td>
                  <td>{formatUSD(d.totalUSD)}</td>
                  <td>{formatBs(d.totalBs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Productos                                                      */
/* ------------------------------------------------------------------ */

function ProductosTab({ products, persistProducts, config, displayCurrency }) {
  const [filtro, setFiltro] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: CATEGORIAS_BASE[0], price: "" });

  const categorias = useMemo(() => {
    const set = new Set(CATEGORIAS_BASE);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  }, [products, filtro]);

  const agrupados = useMemo(() => {
    const map = {};
    filtrados.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [filtrados]);

  function toUSD(value) {
    const n = Number(value) || 0;
    return displayCurrency === "USD" ? n : n / config.tasaCambio;
  }
  function fromUSD(priceUSD) {
    return displayCurrency === "USD" ? priceUSD : priceUSD * config.tasaCambio;
  }

  function startEdit(p) {
    setEditingId(p.id);
    setDraft({ name: p.name, category: p.category, price: fromUSD(p.priceUSD).toFixed(2) });
  }
  function cancelEdit() { setEditingId(null); setDraft({}); }

  async function saveEdit(id) {
    const priceUSD = toUSD(draft.price);
    const next = products.map((p) => (p.id === id ? { ...p, name: draft.name.trim() || p.name, category: draft.category, priceUSD } : p));
    await persistProducts(next);
    cancelEdit();
  }

  async function handleDelete(id) {
    await persistProducts(products.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  }

  async function handleAdd() {
    if (!newProduct.name.trim()) return;
    const priceUSD = toUSD(newProduct.price);
    const next = [...products, { id: uid("prod"), name: newProduct.name.trim(), category: newProduct.category, priceUSD, stock: 0, alertaStock: 5 }];
    await persistProducts(next);
    setNewProduct({ name: "", category: newProduct.category, price: "" });
    setShowAdd(false);
  }

  return (
    <div className="gy-stack">
      <div className="gy-productos-toolbar">
        <div className="gy-search-box gy-search-box-flat">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar producto…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="gy-search-input"
          />
        </div>
        <button type="button" className="gy-btn-primary" onClick={() => setShowAdd((v) => !v)}>
          <PackagePlus size={16} /> Agregar producto
        </button>
      </div>

      {showAdd && (
        <div className="gy-add-panel">
          <div className="gy-field">
            <label>Nombre</label>
            <input className="gy-input" value={newProduct.name} onChange={(e) => setNewProduct((n) => ({ ...n, name: e.target.value }))} placeholder="Ej: Té Chai" />
          </div>
          <div className="gy-field">
            <label>Rubro</label>
            <select className="gy-input" value={newProduct.category} onChange={(e) => setNewProduct((n) => ({ ...n, category: e.target.value }))}>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="gy-field">
            <label>Precio ({displayCurrency === "USD" ? "$" : "Bs"})</label>
            <input className="gy-input" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct((n) => ({ ...n, price: e.target.value }))} placeholder="0.00" />
          </div>
          <div className="gy-add-actions">
            <button type="button" className="gy-btn-primary" onClick={handleAdd}><Check size={15} /> Guardar</button>
            <button type="button" className="gy-btn-ghost" onClick={() => setShowAdd(false)}><X size={15} /> Cancelar</button>
          </div>
        </div>
      )}

      {Object.keys(agrupados).length === 0 && <p className="gy-empty-state">No se encontraron productos.</p>}

      {Object.entries(agrupados).map(([cat, items]) => (
        <div key={cat} className="gy-category-block">
          <h3 className="gy-category-title">{cat} <span className="gy-category-count">({items.length})</span></h3>
          <div className="gy-product-list">
            {items.map((p) => (
              <div className="gy-product-row" key={p.id}>
                {editingId === p.id ? (
                  <>
                    <input className="gy-input gy-input-sm" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
                    <select className="gy-input gy-input-sm" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                      {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="gy-input gy-input-sm gy-input-price" type="number" step="0.01" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} />
                    <button type="button" className="gy-icon-btn-ok" onClick={() => saveEdit(p.id)}><Check size={15} /></button>
                    <button type="button" className="gy-icon-btn" onClick={cancelEdit}><X size={15} /></button>
                  </>
                ) : (
                  <>
                    <span className="gy-product-name">{p.name}</span>
                    <span className="gy-product-price">
                      {displayCurrency === "USD" ? formatUSD(p.priceUSD) : formatBs(p.priceUSD * config.tasaCambio)}
                    </span>
                    <button type="button" className="gy-icon-btn" onClick={() => startEdit(p)} title="Editar"><Pencil size={14} /></button>
                    {confirmDeleteId === p.id ? (
                      <div className="gy-confirm-inline">
                        <button type="button" className="gy-btn-danger-sm" onClick={() => handleDelete(p.id)}>Eliminar</button>
                        <button type="button" className="gy-btn-ghost-sm" onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
                      </div>
                    ) : (
                      <button type="button" className="gy-icon-btn-danger" onClick={() => setConfirmDeleteId(p.id)} title="Eliminar"><Trash2 size={14} /></button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Configuración (protegida con contraseña)                       */
/* ------------------------------------------------------------------ */

function ConfiguracionTab({ config, persistConfig, resetAll, products, persistProducts, showToast }) {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  function handleUnlock(e) {
    e.preventDefault();
    if (passwordInput === CONFIG_PASSWORD) {
      setUnlocked(true);
      setPasswordError(false);
      setPasswordInput("");
    } else {
      setPasswordError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="gy-lock-screen">
        <div className="gy-lock-icon"><Lock size={22} /></div>
        <h3>Configuración protegida</h3>
        <p>Ingresa la contraseña para editar la tasa de cambio, el inventario o restablecer datos.</p>
        <form onSubmit={handleUnlock} className="gy-lock-form">
          <input
            type="password"
            className="gy-input"
            placeholder="Contraseña"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
            autoFocus
          />
          <button type="submit" className="gy-btn-primary"><Unlock size={15} /> Entrar</button>
        </form>
        {passwordError && <p className="gy-error-text">Contraseña incorrecta.</p>}
      </div>
    );
  }

  return (
    <ConfiguracionContenido
      config={config}
      persistConfig={persistConfig}
      resetAll={resetAll}
      products={products}
      persistProducts={persistProducts}
      showToast={showToast}
    />
  );
}

function ConfiguracionContenido({ config, persistConfig, resetAll, products, persistProducts, showToast }) {
  const [tasaInput, setTasaInput] = useState(String(config.tasaCambio));
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const n = Number(tasaInput);
    if (!n || n <= 0) return;
    await persistConfig({ ...config, tasaCambio: n });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="gy-stack gy-config-stack">
      <div className="gy-panel">
        <h3 className="gy-panel-title"><ArrowLeftRight size={16} /> Tasa de cambio</h3>
        <p className="gy-panel-help">
          Se usa para calcular el total en bolívares de cada venta y de la lista de productos.
          Las ventas ya registradas conservan la tasa que estaba vigente cuando se guardaron.
        </p>
        <div className="gy-rate-editor">
          <span>1 $ =</span>
          <input
            className="gy-input gy-input-rate"
            type="number"
            step="0.01"
            value={tasaInput}
            onChange={(e) => setTasaInput(e.target.value)}
          />
          <span>Bs</span>
          <button type="button" className="gy-btn-primary" onClick={handleSave}>
            <Check size={15} /> {saved ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>

      <ControlInventario products={products} persistProducts={persistProducts} showToast={showToast} />

      <div className="gy-panel gy-danger-zone">
        <h3 className="gy-panel-title"><AlertTriangle size={16} /> Restablecer datos</h3>
        <p className="gy-panel-help">
          Esto borra todas las ventas registradas y regresa la lista de productos, el inventario y la tasa a los valores iniciales. No se puede deshacer.
        </p>
        {confirmReset ? (
          <div className="gy-confirm-inline">
            <button type="button" className="gy-btn-danger-sm" onClick={() => { resetAll(); setConfirmReset(false); }}>Sí, borrar todo</button>
            <button type="button" className="gy-btn-ghost-sm" onClick={() => setConfirmReset(false)}>Cancelar</button>
          </div>
        ) : (
          <button type="button" className="gy-btn-danger" onClick={() => setConfirmReset(true)}>
            <Trash2 size={15} /> Restablecer todo
          </button>
        )}
      </div>

      <p className="gy-privacy-note">
        Los datos de esta app se guardan de forma privada asociados a tu cuenta y no son visibles para otras personas.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Control de Inventario (dentro de Configuración)                     */
/* ------------------------------------------------------------------ */

function ControlInventario({ products, persistProducts, showToast }) {
  const [filtro, setFiltro] = useState("");
  const [pending, setPending] = useState({}); // id -> { stock?, alertaStock? }

  const filtrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  }, [products, filtro]);

  const agrupados = useMemo(() => {
    const map = {};
    filtrados.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [filtrados]);

  function getValue(p, field) {
    const v = pending[p.id]?.[field];
    return v !== undefined ? v : (p[field] ?? 0);
  }
  function setValue(id, field, value) {
    setPending((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  const totalLowStock = filtrados.filter((p) => Number(getValue(p, "stock")) <= Number(getValue(p, "alertaStock"))).length;
  const hasPending = Object.keys(pending).length > 0;

  async function handleGuardarInventario() {
    const next = products.map((p) => {
      const change = pending[p.id];
      if (!change) return p;
      return {
        ...p,
        stock: change.stock !== undefined ? Number(change.stock) || 0 : p.stock,
        alertaStock: change.alertaStock !== undefined ? Number(change.alertaStock) || 0 : p.alertaStock,
      };
    });
    await persistProducts(next);
    setPending({});
    showToast("Inventario actualizado.", "ok");
  }

  return (
    <div className="gy-panel">
      <h3 className="gy-panel-title"><Boxes size={16} /> Control de inventario</h3>
      <p className="gy-panel-help">
        Define la cantidad disponible de cada producto y a partir de qué número avisar que el stock está bajo.
        Al registrar una venta, el stock se descuenta automáticamente.
      </p>

      <div className="gy-inventory-toolbar">
        <div className="gy-search-box gy-search-box-flat">
          <Search size={16} />
          <input
            className="gy-search-input"
            placeholder="Buscar producto…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        {totalLowStock > 0 && (
          <span className="gy-lowstock-pill"><AlertTriangle size={13} /> {totalLowStock} con stock bajo</span>
        )}
        {hasPending && (
          <button type="button" className="gy-btn-primary" onClick={handleGuardarInventario}>
            <Check size={15} /> Guardar cambios
          </button>
        )}
      </div>

      <div className="gy-inventory-list">
        {Object.entries(agrupados).map(([cat, items]) => (
          <div key={cat} className="gy-category-block">
            <h4 className="gy-category-title-sm">{cat} <span className="gy-category-count">({items.length})</span></h4>
            {items.map((p) => {
              const stockVal = getValue(p, "stock");
              const alertaVal = getValue(p, "alertaStock");
              const low = Number(stockVal) <= Number(alertaVal);
              return (
                <div className="gy-inventory-row" key={p.id}>
                  <span className="gy-inventory-name">{p.name}</span>
                  <label className="gy-inventory-field">
                    <span>Stock</span>
                    <input
                      type="number"
                      className="gy-input gy-input-sm"
                      value={stockVal}
                      onChange={(e) => setValue(p.id, "stock", e.target.value)}
                    />
                  </label>
                  <label className="gy-inventory-field">
                    <span>Alerta</span>
                    <input
                      type="number"
                      className="gy-input gy-input-sm"
                      value={alertaVal}
                      onChange={(e) => setValue(p.id, "alertaStock", e.target.value)}
                    />
                  </label>
                  {low && <span className="gy-lowstock-badge">Stock bajo</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Estilos                                                             */
/* ------------------------------------------------------------------ */

function StyleBlock() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

      .gy-root {
        --ink: #0B4F30;
        --cream: #F8F4F1;
        --parchment: #ECE7DB;
        --paper: #FFFFFF;
        --caramel: #2E6B47;
        --caramel-dark: #1F4F32;
        --forest: #14532D;
        --forest-dark: #0B3B21;
        --rust: #A23E2E;
        --muted: #6F6659;
        --line: #E1DAC9;
        font-family: 'Inter', sans-serif;
        background: var(--cream);
        color: var(--ink);
        border-radius: 16px;
        min-height: 480px;
        max-width: 1000px;
        margin: 0 auto;
        overflow: hidden;
        border: 1px solid var(--line);
      }
      .gy-loading {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 10px; min-height: 420px; color: var(--muted);
      }
      .gy-header {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px; padding: 18px 22px; background: var(--ink); color: var(--cream); flex-wrap: wrap;
      }
      .gy-brand { display: flex; align-items: center; gap: 10px; }
      .gy-brand-icon {
        width: 38px; height: 38px; border-radius: 10px; background: var(--caramel);
        display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
      }
      .gy-brand h1 { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; margin: 0; line-height: 1.1; }
      .gy-brand p { font-size: 12px; margin: 2px 0 0; color: #CFE0D3; }
      .gy-header-right { display: flex; align-items: center; gap: 10px; }
      .gy-rate-pill {
        display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1);
        padding: 6px 10px; border-radius: 999px; font-size: 12px; font-family: 'IBM Plex Mono', monospace;
      }
      .gy-currency-toggle {
        display: flex; background: rgba(255,255,255,0.12); border-radius: 999px; padding: 3px;
        border: none; cursor: pointer;
      }
      .gy-currency-toggle span {
        padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #CFE0D3;
      }
      .gy-currency-toggle span.on { background: var(--caramel); color: white; }

      .gy-tabnav {
        display: flex; gap: 2px; padding: 8px; background: var(--parchment); flex-wrap: wrap;
        border-bottom: 1px solid var(--line);
      }
      .gy-tab {
        display: flex; align-items: center; gap: 6px; border: none; background: transparent;
        color: var(--muted); padding: 9px 13px; border-radius: 9px; font-size: 13px; font-weight: 600;
        cursor: pointer; font-family: 'Inter', sans-serif;
      }
      .gy-tab.active { background: var(--paper); color: var(--ink); box-shadow: 0 1px 0 var(--line); }
      .gy-tab:hover:not(.active) { color: var(--ink); }

      .gy-main { padding: 20px; }
      .gy-stack { display: flex; flex-direction: column; gap: 16px; }

      .gy-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; position: relative; }
      .gy-field label {
        font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em;
        display: flex; align-items: center; gap: 5px;
      }
      .gy-input {
        border: 1px solid var(--line); background: var(--paper); border-radius: 9px; padding: 10px 12px;
        font-size: 14px; color: var(--ink); font-family: 'Inter', sans-serif; outline: none;
      }
      .gy-input:focus { border-color: var(--caramel); }
      .gy-input-sm { padding: 7px 9px; font-size: 13px; }
      .gy-input-price { max-width: 90px; }
      .gy-input-rate { max-width: 110px; font-family: 'IBM Plex Mono', monospace; }

      .gy-venta-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 22px; align-items: start; }
      @media (max-width: 720px) { .gy-venta-grid { grid-template-columns: 1fr; } }

      .gy-panel { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 18px; }
      .gy-panel-title { display: flex; align-items: center; gap: 7px; font-family: 'Fraunces', serif; font-size: 16px; margin: 0 0 6px; }
      .gy-panel-help { font-size: 12.5px; color: var(--muted); margin: 0 0 12px; line-height: 1.5; }

      .gy-lowstock-banner {
        display: flex; align-items: center; gap: 8px; background: #FBEAE6; color: var(--rust);
        border: 1px solid #E9C6BC; padding: 9px 12px; border-radius: 9px; font-size: 12.5px; margin-bottom: 14px;
      }
      .gy-lowstock-pill {
        display: inline-flex; align-items: center; gap: 5px; background: #FBEAE6; color: var(--rust);
        border: 1px solid #E9C6BC; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
      }
      .gy-lowstock-badge {
        background: var(--rust); color: white; font-size: 10.5px; font-weight: 700; padding: 3px 7px;
        border-radius: 999px; white-space: nowrap;
      }

      .gy-search-box {
        display: flex; align-items: center; gap: 8px; border: 1px solid var(--line); background: var(--paper);
        border-radius: 9px; padding: 10px 12px; color: var(--muted);
      }
      .gy-search-box-flat { flex: 1; min-width: 200px; }
      .gy-search-input { border: none; outline: none; background: transparent; font-size: 14px; width: 100%; color: var(--ink); font-family: 'Inter', sans-serif; }
      .gy-search-field { position: relative; }

      .gy-dropdown {
        position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: var(--paper);
        border: 1px solid var(--line); border-radius: 10px; overflow: hidden; z-index: 20;
        box-shadow: 0 8px 20px rgba(11,79,48,0.14); max-height: 260px; overflow-y: auto;
      }
      .gy-dropdown-empty { padding: 12px; font-size: 13px; color: var(--muted); }
      .gy-dropdown-item {
        display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;
        border: none; background: transparent; padding: 10px 12px; cursor: pointer; text-align: left;
        border-bottom: 1px solid var(--line); font-family: 'Inter', sans-serif;
      }
      .gy-dropdown-item:last-child { border-bottom: none; }
      .gy-dropdown-item.active, .gy-dropdown-item:hover { background: var(--parchment); }
      .gy-dd-name { display: block; font-size: 13.5px; font-weight: 600; color: var(--ink); }
      .gy-dd-cat { display: block; font-size: 11px; color: var(--muted); }
      .gy-dd-cat.low { color: var(--rust); font-weight: 700; }
      .gy-dd-price { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--caramel-dark); white-space: nowrap; }

      .gy-payment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(115px,1fr)); gap: 8px; }
      .gy-payment-btn {
        display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 6px;
        border: 1px solid var(--line); background: var(--paper); border-radius: 10px; cursor: pointer;
        font-size: 12px; font-weight: 600; color: var(--muted); font-family: 'Inter', sans-serif;
      }
      .gy-payment-btn.active { background: var(--forest); border-color: var(--forest); color: white; }

      .gy-error-text { color: var(--rust); font-size: 12px; margin: 2px 0 0; }

      .gy-ticket-wrap { display: flex; flex-direction: column; gap: 14px; }
      .gy-ticket {
        background: var(--paper); border: 1px solid var(--line); border-radius: 6px 6px 0 0; padding: 20px 18px 26px;
        position: relative; font-family: 'IBM Plex Mono', monospace;
      }
      .ticket-edge-bottom { margin-bottom: 14px; }
      .ticket-edge-bottom::after {
        content: ""; position: absolute; left: 0; right: 0; bottom: -9px; height: 18px;
        background:
          linear-gradient(-45deg, var(--cream) 9px, transparent 0),
          linear-gradient(45deg, var(--cream) 9px, transparent 0);
        background-size: 18px 18px; background-position: left bottom; background-repeat: repeat-x;
      }
      .gy-ticket-head { display: flex; align-items: center; gap: 8px; font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; justify-content: center; margin-bottom: 10px; }
      .gy-ticket-sub { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
      .gy-ticket-sub.muted { margin-bottom: 10px; }
      .gy-ticket-num-input {
        border: none; border-bottom: 1px dashed var(--line); background: transparent; text-align: center;
        width: 60px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--ink); outline: none;
      }
      .gy-ticket-items { border-top: 1px dashed var(--line); border-bottom: 1px dashed var(--line); padding: 10px 0; margin: 6px 0; min-height: 40px; }
      .gy-ticket-empty { font-size: 12.5px; color: var(--muted); text-align: center; padding: 10px 0; font-family: 'Inter', sans-serif; }
      .gy-ticket-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
      .gy-ticket-item-info { flex: 1; display: flex; flex-direction: column; }
      .gy-ticket-item-name { font-size: 13px; color: var(--ink); }
      .gy-ticket-item-price { font-size: 11px; color: var(--muted); }
      .gy-qty-stepper { display: flex; align-items: center; gap: 6px; }
      .gy-qty-stepper button { width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--line); background: var(--parchment); display: flex; align-items: center; justify-content: center; cursor: pointer; }
      .gy-remove-item { border: none; background: transparent; color: var(--rust); cursor: pointer; padding: 4px; }
      .gy-ticket-totals { padding-top: 4px; }
      .gy-total-row { display: flex; justify-content: space-between; font-size: 14px; padding: 3px 0; }
      .gy-ticket-pago { display: flex; align-items: center; gap: 6px; justify-content: center; margin-top: 10px; font-size: 12px; color: var(--forest-dark); flex-wrap: wrap; }
      .gy-ticket-ref { color: var(--muted); }

      .gy-ticket-actions { display: flex; gap: 8px; }
      .gy-print-btn { flex-shrink: 0; }
      .gy-btn-primary {
        display: flex; align-items: center; justify-content: center; gap: 7px; background: var(--caramel);
        color: white; border: none; border-radius: 10px; padding: 11px 16px; font-size: 14px; font-weight: 700;
        cursor: pointer; font-family: 'Inter', sans-serif;
      }
      .gy-btn-primary:hover { background: var(--caramel-dark); color: white; }
      .gy-save-btn { flex: 1; }

      .gy-btn-ghost { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; }
      .gy-btn-danger { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--rust); color: var(--rust); border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
      .gy-btn-danger-sm, .gy-btn-ghost-sm {
        border: none; border-radius: 7px; padding: 6px 10px; font-size: 12px; font-weight: 700; cursor: pointer;
      }
      .gy-btn-danger-sm { background: var(--rust); color: white; }
      .gy-btn-ghost-sm { background: var(--parchment); color: var(--muted); }
      .gy-confirm-inline { display: flex; gap: 6px; }

      .gy-date-picker { max-width: 240px; }
      .gy-summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr)); gap: 10px; }
      .gy-card { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 4px; }
      .gy-card-label { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }
      .gy-card-value { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--ink); }

      .gy-method-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap: 10px; }
      .gy-method-card { background: var(--parchment); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 3px; }
      .gy-method-head { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--ink); }
      .gy-method-count { font-size: 11px; color: var(--muted); }
      .gy-method-amount { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--caramel-dark); font-weight: 600; }

      .gy-list { display: flex; flex-direction: column; gap: 8px; }
      .gy-sale-row {
        display: flex; align-items: center; gap: 12px; background: var(--paper); border: 1px solid var(--line);
        border-radius: 10px; padding: 11px 13px; flex-wrap: wrap;
      }
      .gy-sale-main { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 200px; }
      .gy-sale-ticket { font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 13px; }
      .gy-sale-hora { font-size: 11px; color: var(--muted); }
      .gy-sale-items { font-size: 12px; color: var(--ink); opacity: 0.8; }
      .gy-sale-side { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
      .gy-sale-total { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600; }
      .gy-sale-pago { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted); }
      .gy-icon-btn-danger { background: transparent; border: none; color: var(--rust); cursor: pointer; padding: 6px; }
      .gy-icon-btn { background: transparent; border: none; color: var(--muted); cursor: pointer; padding: 6px; }
      .gy-icon-btn-ok { background: var(--forest); border: none; color: white; border-radius: 6px; cursor: pointer; padding: 6px; }

      .gy-empty-state { color: var(--muted); font-size: 13.5px; padding: 18px; text-align: center; background: var(--parchment); border-radius: 10px; }

      .gy-chart-box { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
      .gy-chart-title { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--muted); margin-bottom: 6px; }

      .gy-table-wrap { overflow-x: auto; }
      .gy-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .gy-table th { text-align: left; padding: 8px 10px; color: var(--muted); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid var(--line); }
      .gy-table td { padding: 9px 10px; border-bottom: 1px solid var(--line); }
      .gy-table tr:last-child td { border-bottom: none; }

      .gy-productos-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
      .gy-add-panel { background: var(--parchment); border-radius: 12px; padding: 14px; display: grid; grid-template-columns: 2fr 1.3fr 1fr; gap: 10px; align-items: end; }
      .gy-add-panel .gy-field { margin-bottom: 0; }
      .gy-add-actions { grid-column: 1 / -1; display: flex; gap: 8px; }
      @media (max-width: 620px) { .gy-add-panel { grid-template-columns: 1fr; } }

      .gy-category-block { margin-top: 4px; }
      .gy-category-title { font-family: 'Fraunces', serif; font-size: 14.5px; color: var(--caramel-dark); margin: 0 0 8px; }
      .gy-category-title-sm { font-family: 'Fraunces', serif; font-size: 13.5px; color: var(--caramel-dark); margin: 14px 0 8px; }
      .gy-category-count { font-family: 'Inter', sans-serif; font-size: 11.5px; color: var(--muted); font-weight: 500; }
      .gy-product-list { display: flex; flex-direction: column; gap: 6px; }
      .gy-product-row { display: flex; align-items: center; gap: 10px; background: var(--paper); border: 1px solid var(--line); border-radius: 9px; padding: 9px 11px; }
      .gy-product-name { flex: 1; font-size: 13.5px; }
      .gy-product-price { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--caramel-dark); font-weight: 600; }

      .gy-config-stack { max-width: 640px; }
      .gy-rate-editor { display: flex; align-items: center; gap: 8px; font-size: 14px; flex-wrap: wrap; }
      .gy-danger-zone { border-color: #E4B9AF; }
      .gy-privacy-note { font-size: 11.5px; color: var(--muted); text-align: center; }

      .gy-lock-screen {
        max-width: 380px; margin: 40px auto; text-align: center; background: var(--paper);
        border: 1px solid var(--line); border-radius: 16px; padding: 28px 24px; display: flex;
        flex-direction: column; align-items: center; gap: 8px;
      }
      .gy-lock-icon {
        width: 44px; height: 44px; border-radius: 50%; background: var(--parchment); color: var(--ink);
        display: flex; align-items: center; justify-content: center; margin-bottom: 6px;
      }
      .gy-lock-screen h3 { font-family: 'Fraunces', serif; font-size: 17px; margin: 0; }
      .gy-lock-screen p { font-size: 12.5px; color: var(--muted); margin: 0 0 8px; line-height: 1.5; }
      .gy-lock-form { display: flex; gap: 8px; width: 100%; }
      .gy-lock-form .gy-input { flex: 1; }

      .gy-inventory-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 10px; }
      .gy-inventory-list { max-height: 460px; overflow-y: auto; padding-right: 4px; }
      .gy-inventory-row {
        display: flex; align-items: center; gap: 10px; background: var(--paper); border: 1px solid var(--line);
        border-radius: 9px; padding: 8px 11px; margin-bottom: 6px; flex-wrap: wrap;
      }
      .gy-inventory-name { flex: 1; font-size: 13px; min-width: 160px; }
      .gy-inventory-field { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--muted); }
      .gy-inventory-field input { width: 64px; }

      .gy-toast {
        position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); display: flex; align-items: center;
        gap: 8px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; z-index: 50;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15); font-family: 'Inter', sans-serif;
      }
      .gy-toast-error { background: var(--rust); color: white; }
      .gy-toast-ok { background: var(--forest); color: white; }

      .gy-print-ticket { display: none; }
      @media print {
        body * { visibility: hidden !important; }
        .gy-print-ticket, .gy-print-ticket * { visibility: visible !important; }
        .gy-print-ticket {
          display: block !important;
          position: absolute; top: 0; left: 0; width: 280px;
          font-family: 'IBM Plex Mono', monospace;
          color: #000; padding: 10px;
        }
        .gy-print-head { text-align: center; font-weight: 700; font-size: 15px; margin-bottom: 2px; letter-spacing: 0.04em; }
        .gy-print-sub { text-align: center; font-size: 11px; margin-bottom: 2px; }
        .gy-print-line { border-top: 1px dashed #000; margin: 6px 0; }
        .gy-print-item { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; }
        .gy-print-total { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; padding: 2px 0; }
        .gy-print-thanks { text-align: center; font-size: 11px; margin-top: 8px; }
      }
    `}</style>
  );
}
