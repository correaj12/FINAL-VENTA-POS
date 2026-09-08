import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Coffee, Search, Plus, Minus, Trash2, Smartphone, CreditCard, Banknote,
  DollarSign, Coins, Settings, BarChart3, ClipboardList, Pencil, X, Check,
  AlertTriangle, PackagePlus, Loader2, Receipt, TrendingUp,
  ArrowLeftRight, CalendarDays, Printer, Lock, Unlock, Boxes,
  Eye, EyeOff, KeyRound, ChevronDown, ChevronRight, ArrowLeft,
  ImagePlus, LayoutGrid, Croissant, UtensilsCrossed, ChefHat, Store,
  Pizza, IceCream2, CupSoda, Cookie, Sandwich, ShieldCheck, Split,
  Send, BookOpen, Truck, Award, ChevronUp, FileDown, CalendarClock
} from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { Document, Page, View, Text, Image as PDFImage, StyleSheet, pdf } from "@react-pdf/renderer";

/* ------------------------------------------------------------------ */
/*  Datos base                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEYS = {
  PRODUCTS: "avp_productos",
  CONFIG: "avp_config",
  SALES: "avp_ventas",
  MESAS: "avp_mesas",
  MENU: "avp_menu_publico",
  PROVEEDORES: "avp_proveedores",
};

const CATEGORIAS_BASE = ["Bebidas", "Chuchería", "Menú"];

const DEFAULT_PRODUCTS = [
  { id: "b1", name: "Agua MIBRISA 1,5", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b2", name: "Agua MIBRISA 500ml 1x24", category: "Bebidas", priceUSD: 1.25, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b3", name: "Agua SABORIZADA", category: "Bebidas", priceUSD: 1.7, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b4", name: "Batido 1 Sabor", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b5", name: "Batido con Leche", category: "Bebidas", priceUSD: 4.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b6", name: "Gatorade PET 500Ml x 12 Unid", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b7", name: "Gelatina FRESA", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b8", name: "VALLE 250ml", category: "Bebidas", priceUSD: 1.7, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b9", name: "Jugo FRICA 250ml", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b10", name: "Jugo LALO Durz / Manz / Naranja 0,40Lts", category: "Bebidas", priceUSD: 2.3, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b11", name: "Lipton 500Ml x 12 Unid", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b12", name: "Malta de LATA", category: "Bebidas", priceUSD: 2.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b13", name: "Maltin N/R 225ml x 12Unid", category: "Bebidas", priceUSD: 1.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b14", name: "Maltin POLAR Botella Ret 222ml x 36Unid", category: "Bebidas", priceUSD: 1.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b15", name: "Refresco / Valle 1,5Lts", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b16", name: "Refresco coca cola 2lt", category: "Bebidas", priceUSD: 2.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b17", name: "Refresco Coca cola LATA", category: "Bebidas", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b18", name: "Refresco PET 355ML N/R", category: "Bebidas", priceUSD: 1.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b19", name: "Refrescos 1litro variado x 6Unid", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b20", name: "Refrescos Botella Mezclados 350Ml 24Unid", category: "Bebidas", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b21", name: "Rikomalt / Chica / Avena 250ml PARMALAT", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b22", name: "Rockstar 24Unid", category: "Bebidas", priceUSD: 2.3, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b23", name: "Santal Active ZANH-NARJ 1500ml 1x6", category: "Bebidas", priceUSD: 8.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b24", name: "Santal Active ZANH-NARJ 500ml 1x6", category: "Bebidas", priceUSD: 3.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b25", name: "Soda", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b26", name: "Té LALO Durz / Limo", category: "Bebidas", priceUSD: 2.3, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b27", name: "Té PARMALAT 250ml", category: "Bebidas", priceUSD: 2.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b28", name: "Yogurt FIRME Fresa LALO", category: "Bebidas", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b29", name: "Yogurt Con cereal LALO", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b30", name: "YOKA", category: "Bebidas", priceUSD: 3.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b31", name: "YOLO Yogurt liq", category: "Bebidas", priceUSD: 3.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b32", name: "Yogurt firme YOLO", category: "Bebidas", priceUSD: 3.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "b33", name: "Migurt FRUTA", category: "Bebidas", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c1", name: "Arfajores", category: "Chuchería", priceUSD: 1.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c2", name: "Aros de cebolla TOM", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c3", name: "Belvita Hony Bran / Kraket Bran 9x28Gr", category: "Chuchería", priceUSD: 0.7, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c4", name: "Bocaditos", category: "Chuchería", priceUSD: 0.95, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c5", name: "Brownies", category: "Chuchería", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c6", name: "Brownies MINI 175gr", category: "Chuchería", priceUSD: 2.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c7", name: "Bubaloo", category: "Chuchería", priceUSD: 0.25, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c8", name: "Caramelos VARIOS 3 x 100", category: "Chuchería", priceUSD: 0.15, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c9", name: "Chicle BOLA AGOGO 24U", category: "Chuchería", priceUSD: 0.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c10", name: "Chocolate de leche / RIKITY 1x12 SAVOY", category: "Chuchería", priceUSD: 2.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c11", name: "Chupeta Pin Pon", category: "Chuchería", priceUSD: 0.25, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c12", name: "Club Social 6x26gr", category: "Chuchería", priceUSD: 0.7, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c13", name: "Cocosette / Susy Maxi 18 x 50g", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c14", name: "Cocosette MINI 18x25gr", category: "Chuchería", priceUSD: 1.3, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c15", name: "CriCri chocolate", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c16", name: "De todito XXXL 360gr", category: "Chuchería", priceUSD: 8.34, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c17", name: "Flaquito", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c18", name: "Flips 120gs", category: "Chuchería", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c19", name: "FREEGELLS VITAC 12Unds", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c20", name: "Galleta DANI CHIP", category: "Chuchería", priceUSD: 0.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c21", name: "Galleta TIP TOP", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c22", name: "Galletas AVENA / GRANOLA / CHIPS", category: "Chuchería", priceUSD: 1.7, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c23", name: "Galletas KATY", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c24", name: "Galletas SALUDABLE", category: "Chuchería", priceUSD: 1.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c25", name: "JaenCAke", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c26", name: "Life Savers Surtido 10U", category: "Chuchería", priceUSD: 2.56, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c27", name: "Mani JAP / SAL MUNCHY", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c28", name: "Mani Mixto", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c29", name: "Mento 12U", category: "Chuchería", priceUSD: 1.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c30", name: "Mini MARIA bolsa 200Gr", category: "Chuchería", priceUSD: 2.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c31", name: "Nutelini 1x12", category: "Chuchería", priceUSD: 0.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c32", name: "OREO Chocolate paq (1x6)", category: "Chuchería", priceUSD: 1.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c33", name: "Palitos mostrador 18x30", category: "Chuchería", priceUSD: 0.95, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c34", name: "Palmerita", category: "Chuchería", priceUSD: 0.85, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c35", name: "Pepito 180g XXL", category: "Chuchería", priceUSD: 3.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c36", name: "Piruetas 20g x 24Unid", category: "Chuchería", priceUSD: 0.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c37", name: "REX Bolsa 200Gr", category: "Chuchería", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c38", name: "Rikiti 12x30Gr", category: "Chuchería", priceUSD: 1.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c39", name: "Samba MINI", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c40", name: "Cheetos Mega Puff", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c41", name: "Boliqueso", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c42", name: "Chees tris", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c43", name: "pepitos", category: "Chuchería", priceUSD: 1.35, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c44", name: "Chiskesito Orig", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c45", name: "Toci", category: "Chuchería", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c46", name: "Dorito Dina - Queso", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c47", name: "D TODITO", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c48", name: "Papas PUNCH", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c49", name: "Platatito", category: "Chuchería", priceUSD: 1.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c50", name: "Raquety PICANT", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c51", name: "NORMAL", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c52", name: "ChisKronch T", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c53", name: "Kesito", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c54", name: "BoliKruch", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c55", name: "Ruffles", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c56", name: "Chicharron", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c57", name: "Tocinetikas", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c58", name: "Yuca", category: "Chuchería", priceUSD: 1.8, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c59", name: "Tronkolate MINI", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c60", name: "Turrón Maní", category: "Chuchería", priceUSD: 0.9, stock: 0, alertaStock: 5, costo: 0 },
  { id: "c61", name: "Torta Manzana (1x6)", category: "Chuchería", priceUSD: 2.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m1", name: "Empanada", category: "Menú", priceUSD: 1.3, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m2", name: "Tequeñon", category: "Menú", priceUSD: 1.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m3", name: "Tequeñon PROMO", category: "Menú", priceUSD: 2.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m4", name: "Pizza SLICE", category: "Menú", priceUSD: 1.2, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m5", name: "sandwich jamó y queso", category: "Menú", priceUSD: 3.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m6", name: "Arepa asada", category: "Menú", priceUSD: 3.6, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m7", name: "Dasayuno CRIOLLO", category: "Menú", priceUSD: 5.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m8", name: "Desayuno AMERICANO", category: "Menú", priceUSD: 5.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m9", name: "Omelet", category: "Menú", priceUSD: 4.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m10", name: "Milanesa de pollo", category: "Menú", priceUSD: 9.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m11", name: "Chuleta de CERDO", category: "Menú", priceUSD: 12.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m12", name: "Solomo de Res", category: "Menú", priceUSD: 12.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m13", name: "Chuleta AHUMADA", category: "Menú", priceUSD: 7.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m14", name: "Calamares rebozados", category: "Menú", priceUSD: 15.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m15", name: "Camarones al ajillo", category: "Menú", priceUSD: 15.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m16", name: "Pasta Bologna", category: "Menú", priceUSD: 5.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m17", name: "Parrilla mixta", category: "Menú", priceUSD: 18.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m18", name: "Ensalada cesar con Pollo", category: "Menú", priceUSD: 8.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m19", name: "Smash Burguer con queso", category: "Menú", priceUSD: 5.5, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m20", name: "Hamburguesa Clasica + PAPAS", category: "Menú", priceUSD: 8.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m21", name: "Hamburguesa DOBLE + PAPAS", category: "Menú", priceUSD: 10.0, stock: 0, alertaStock: 5, costo: 0 },
  { id: "m22", name: "Club House + PAPAS", category: "Menú", priceUSD: 12.0, stock: 0, alertaStock: 5, costo: 0 },
];

// Menú público (el que se muestra a los clientes e imprime en PDF).
// Cada ítem guarda su propio precio en $ y se muestra también en Bs
// usando la tasa de cambio vigente, así que siempre queda sincronizado
// sin tener que tocar el PDF a mano.
const DEFAULT_MENU = {
  secciones: [
    {
      id: "sec_desayunos", nombre: "Desayunos",
      items: [
        { id: "mi1", nombre: "Empanadas", descripcion: "Carne mechada / Queso / Dominó / Carne Molida / Jamón y Queso / Pollo", precioUSD: 1.3, promo: false },
        { id: "mi2", nombre: "Tequeñones de queso", descripcion: "", precioUSD: 1.5, promo: false },
        { id: "mi3", nombre: "2 Tequeñones", descripcion: "Promo estudiantil", precioUSD: 1.99, promo: true, promoLabel: "Promo estudiantil" },
        { id: "mi4", nombre: "Pastelitos", descripcion: "Carne mechada / Queso / Jamón y Queso / Pollo", precioUSD: 1.5, promo: false },
        { id: "mi5", nombre: "Sandwich", descripcion: "Lechuga, tomate, jamón, queso y salsas", precioUSD: 3.0, promo: false },
      ],
    },
    {
      id: "sec_almuerzos", nombre: "Almuerzos",
      items: [
        { id: "mi6", nombre: "Milanesa de pollo, Chuleta de cerdo o Bistec de carne", descripcion: "Contornos: arroz, papas al vapor, puré de papas, ensalada mixta, tajadas", precioUSD: 10.0, promo: false },
        { id: "mi7", nombre: "Arróz Chino + lumpia", descripcion: "Arroz frito con pollo y vegetales salteados", precioUSD: 7.0, promo: false },
        { id: "mi8", nombre: "Chuleta ahumada con arróz y ensalada", descripcion: "Almuerzo estudiantil", precioUSD: 7.5, promo: true, promoLabel: "Almuerzo estudiantil" },
      ],
    },
    {
      id: "sec_comida_rapida", nombre: "Comida Rápida",
      items: [
        { id: "mi9", nombre: "Hamburguesa Clásica", descripcion: "", precioUSD: 6.0, promo: false },
        { id: "mi10", nombre: "Hamburguesa Especial + papas fritas", descripcion: "", precioUSD: 9.0, promo: false },
        { id: "mi11", nombre: "Club house + papas fritas", descripcion: "", precioUSD: 10.0, promo: false },
        { id: "mi12", nombre: "Pizza margarita", descripcion: "", precioUSD: 7.0, promo: false },
        { id: "mi13", nombre: "Perro caliente", descripcion: "", precioUSD: 3.0, promo: false },
      ],
    },
    {
      id: "sec_bebidas", nombre: "Bebidas",
      items: [
        { id: "mi14", nombre: "Agua - 500ml", descripcion: "", precioUSD: 1.3, promo: false },
        { id: "mi15", nombre: "Café grande 8oz", descripcion: "", precioUSD: 2.5, promo: false },
        { id: "mi16", nombre: "Café pequeño 4oz", descripcion: "", precioUSD: 1.5, promo: false },
        { id: "mi17", nombre: "Refresco RET 350ml", descripcion: "", precioUSD: 1.2, promo: false },
        { id: "mi18", nombre: "Batidos", descripcion: "", precioUSD: 3.0, promo: false },
        { id: "mi19", nombre: "Lipton", descripcion: "", precioUSD: 3.0, promo: false },
      ],
    },
  ],
};

const DEFAULT_CONFIG = {
  tasaCambio: 800,
  nombreComercio: "Delicias A.V.P.",
  tagline: "Restaurante · Cafetería · Coworking",
  colorPrincipal: "#0B4F30",
  logoTipo: "icono",
  logoIcono: "Coffee",
  logoImagen: null,
  claveAdmin: "100Millonesde$",
  claveOperador: "1212",
};

const PAYMENT_METHODS = [
  { id: "pago_movil", label: "Pago Móvil", currency: "Bs", icon: Smartphone, needsRef: true },
  { id: "debito", label: "Débito", currency: "Bs", icon: CreditCard, needsRef: false },
  { id: "efectivo_bs", label: "Efectivo Bs", currency: "Bs", icon: Banknote, needsRef: false },
  { id: "efectivo_usd", label: "Efectivo $", currency: "$", icon: DollarSign, needsRef: false },
  { id: "usdt", label: "USDT", currency: "$", icon: Coins, needsRef: false },
];

const TABS = [
  { id: "pedidos", label: "Pedidos", icon: Receipt },
  { id: "jornada", label: "Jornada", icon: ClipboardList },
  { id: "historial", label: "Historial", icon: BarChart3 },
  { id: "productos", label: "Productos", icon: Coffee },
  { id: "menu", label: "Menú", icon: BookOpen },
  { id: "proveedores", label: "Proveedores", icon: Truck },
  { id: "config", label: "Configuración", icon: Settings },
];

const ICON_OPTIONS = [
  { id: "Coffee", icon: Coffee },
  { id: "Croissant", icon: Croissant },
  { id: "UtensilsCrossed", icon: UtensilsCrossed },
  { id: "ChefHat", icon: ChefHat },
  { id: "Store", icon: Store },
  { id: "Pizza", icon: Pizza },
  { id: "IceCream2", icon: IceCream2 },
  { id: "CupSoda", icon: CupSoda },
  { id: "Cookie", icon: Cookie },
  { id: "Sandwich", icon: Sandwich },
];
function iconById(id) {
  return (ICON_OPTIONS.find((o) => o.id === id) || ICON_OPTIONS[0]).icon;
}

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
function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
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
// Convierte el monto de una línea de pago (en su moneda nativa) a su
// equivalente en $, para poder sumar formas de pago mixtas.
function montoLineaEnUSD(pago, tasaCambio) {
  const meta = paymentMeta(pago.metodo);
  const n = Number(pago.monto) || 0;
  return meta.currency === "Bs" ? n / tasaCambio : n;
}
// Devuelve las líneas de pago de una venta. Las ventas nuevas guardan un
// arreglo "pagos" (una o varias formas de pago). Las ventas antiguas, de
// antes de admitir pago mixto, solo tenían "formaPago" + "referencia" —
// aquí se reconstruye como una única línea equivalente, sin migrar datos.
function pagosDeVenta(venta) {
  if (Array.isArray(venta.pagos) && venta.pagos.length > 0) return venta.pagos;
  if (venta.formaPago) {
    const meta = paymentMeta(venta.formaPago);
    return [{
      metodo: venta.formaPago,
      monto: meta.currency === "Bs" ? venta.totalBs : venta.totalUSD,
      referencia: venta.referencia || "",
    }];
  }
  return [];
}
function formatMontoPago(pago) {
  const meta = paymentMeta(pago.metodo);
  return meta.currency === "Bs" ? formatBs(Number(pago.monto) || 0) : formatUSD(Number(pago.monto) || 0);
}
function resumenPagosTexto(pagos) {
  return pagos.map((p) => `${paymentMeta(p.metodo).label} ${formatMontoPago(p)}`).join(" + ");
}
// Enmascara valores sensibles cuando el modo "ocultar vista" está activo
function mask(text, hidden) {
  return hidden ? "••••••" : text;
}
// Oscurece un color hex un porcentaje dado, para estados hover
function darkenHex(hex, amount = 0.18) {
  try {
    const h = hex.replace("#", "");
    const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    r = Math.max(0, Math.round(r * (1 - amount)));
    g = Math.max(0, Math.round(g * (1 - amount)));
    b = Math.max(0, Math.round(b * (1 - amount)));
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  } catch { return hex; }
}
// Redimensiona y comprime una imagen subida por el usuario a un cuadrado pequeño en base64
function resizeImageToDataURL(file, maxSize = 160, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("No se pudo procesar la imagen"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pedidos");
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [sales, setSales] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [proveedores, setProveedores] = useState([]);
  const [displayCurrency, setDisplayCurrency] = useState("USD"); // 'USD' | 'BS'
  const [toast, setToast] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [vistaOculta, setVistaOculta] = useState(false);

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
      let p = null, c = null, s = null, m = null, mn = null, pr = null;
      try { p = await window.storage.get(STORAGE_KEYS.PRODUCTS); } catch (e) { /* no existe aún */ }
      try { c = await window.storage.get(STORAGE_KEYS.CONFIG); } catch (e) { /* no existe aún */ }
      try { s = await window.storage.get(STORAGE_KEYS.SALES); } catch (e) { /* no existe aún */ }
      try { m = await window.storage.get(STORAGE_KEYS.MESAS); } catch (e) { /* no existe aún */ }
      try { mn = await window.storage.get(STORAGE_KEYS.MENU); } catch (e) { /* no existe aún */ }
      try { pr = await window.storage.get(STORAGE_KEYS.PROVEEDORES); } catch (e) { /* no existe aún */ }

      // Los productos guardados pueden venir de una versión anterior sin
      // "costo" — lo completamos para que el resto del código no falle.
      const initialProducts = p
        ? JSON.parse(p.value).map((prod) => ({ costo: 0, ...prod }))
        : DEFAULT_PRODUCTS;

      // La configuración guardada puede venir de una versión anterior sin
      // los campos nuevos (nombre, color, logo, claves) — se completan con
      // los valores por defecto sin perder lo que ya estaba guardado.
      const initialConfig = c ? { ...DEFAULT_CONFIG, ...JSON.parse(c.value) } : DEFAULT_CONFIG;

      const initialSales = s ? JSON.parse(s.value) : [];
      const initialMesas = m ? JSON.parse(m.value) : [];
      const initialMenu = mn ? JSON.parse(mn.value) : DEFAULT_MENU;
      const initialProveedores = pr ? JSON.parse(pr.value) : [];

      setProducts(initialProducts);
      setConfig(initialConfig);
      setSales(initialSales);
      setMesas(initialMesas);
      setMenu(initialMenu);
      setProveedores(initialProveedores);

      try {
        if (!p) await window.storage.set(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        if (!c) await window.storage.set(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
        if (!m) await window.storage.set(STORAGE_KEYS.MESAS, JSON.stringify([]));
        if (!mn) await window.storage.set(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU));
        if (!pr) await window.storage.set(STORAGE_KEYS.PROVEEDORES, JSON.stringify([]));
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

  const persistMesas = useCallback(async (next) => {
    setMesas(next);
    try { await window.storage.set(STORAGE_KEYS.MESAS, JSON.stringify(next)); }
    catch (e) { showToast("No se pudo guardar la mesa. Intenta de nuevo."); }
  }, [showToast]);

  const persistMenu = useCallback(async (next) => {
    setMenu(next);
    try { await window.storage.set(STORAGE_KEYS.MENU, JSON.stringify(next)); }
    catch (e) { showToast("No se pudo guardar el menú. Intenta de nuevo."); }
  }, [showToast]);

  const persistProveedores = useCallback(async (next) => {
    setProveedores(next);
    try { await window.storage.set(STORAGE_KEYS.PROVEEDORES, JSON.stringify(next)); }
    catch (e) { showToast("No se pudo guardar el proveedor. Intenta de nuevo."); }
  }, [showToast]);

  const resetAll = useCallback(async () => {
    try {
      await window.storage.set(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      await window.storage.set(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      await window.storage.set(STORAGE_KEYS.SALES, JSON.stringify([]));
      await window.storage.set(STORAGE_KEYS.MESAS, JSON.stringify([]));
      await window.storage.set(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU));
      await window.storage.set(STORAGE_KEYS.PROVEEDORES, JSON.stringify([]));
      setProducts(DEFAULT_PRODUCTS);
      setConfig(DEFAULT_CONFIG);
      setSales([]);
      setMesas([]);
      setMenu(DEFAULT_MENU);
      setProveedores([]);
      showToast("Datos restablecidos.", "ok");
    } catch (e) { showToast("No se pudo restablecer los datos."); }
  }, [showToast]);

  const proveedoresVencidos = useMemo(
    () => proveedores.filter((p) => !p.pagado && p.fechaVencimiento < todayISO()).length,
    [proveedores]
  );

  if (loading) {
    return (
      <div className="gy-root gy-loading">
        <StyleBlock />
        <Loader2 className="animate-spin" size={28} />
        <p>Abriendo la caja…</p>
      </div>
    );
  }

  const rootStyle = { "--ink": config.colorPrincipal, "--caramel": config.colorPrincipal, "--caramel-dark": darkenHex(config.colorPrincipal, 0.22) };

  if (!cajaAbierta) {
    return (
      <div className="gy-root" style={rootStyle}>
        <StyleBlock />
        <AperturaCaja config={config} onAbrir={() => setCajaAbierta(true)} />
      </div>
    );
  }

  return (
    <div className="gy-root" style={rootStyle}>
      <StyleBlock />
      <Header
        config={config}
        displayCurrency={displayCurrency}
        setDisplayCurrency={setDisplayCurrency}
        vistaOculta={vistaOculta}
        setVistaOculta={setVistaOculta}
        onCerrarCaja={() => setCajaAbierta(false)}
      />
      <TabNav tab={tab} setTab={setTab} proveedoresVencidos={proveedoresVencidos} />

      <main className="gy-main">
        {tab === "pedidos" && (
          <PedidosTab
            products={products}
            config={config}
            sales={sales}
            mesas={mesas}
            persistSales={persistSales}
            persistProducts={persistProducts}
            persistMesas={persistMesas}
            displayCurrency={displayCurrency}
            showToast={showToast}
            triggerPrint={triggerPrint}
          />
        )}
        {tab === "jornada" && (
          <OperatorLockGate config={config} title="Jornada">
            <JornadaTab sales={sales} persistSales={persistSales} triggerPrint={triggerPrint} vistaOculta={vistaOculta} config={config} />
          </OperatorLockGate>
        )}
        {tab === "historial" && (
          <OperatorLockGate config={config} title="Historial">
            <HistorialTab sales={sales} vistaOculta={vistaOculta} />
          </OperatorLockGate>
        )}
        {tab === "productos" && (
          <ProductosTab
            products={products}
            persistProducts={persistProducts}
            config={config}
            displayCurrency={displayCurrency}
          />
        )}
        {tab === "menu" && (
          <MenuTab
            menu={menu}
            persistMenu={persistMenu}
            products={products}
            config={config}
            showToast={showToast}
            displayCurrency={displayCurrency}
          />
        )}
        {tab === "proveedores" && (
          <OperatorLockGate config={config} title="Proveedores">
            <ProveedoresTab
              proveedores={proveedores}
              persistProveedores={persistProveedores}
              config={config}
              showToast={showToast}
            />
          </OperatorLockGate>
        )}
        {tab === "config" && (
          <ConfiguracionTab
            config={config}
            persistConfig={persistConfig}
            resetAll={resetAll}
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

      <PrintableTicket data={printData} nombreComercio={config.nombreComercio} tagline={config.tagline} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Apertura de caja (clave de administrador)                           */
/* ------------------------------------------------------------------ */

function AperturaCaja({ config, onAbrir }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (clave === config.claveAdmin) {
      onAbrir();
    } else {
      setError(true);
    }
  }

  return (
    <div className="gy-apertura-wrap">
      <div className="gy-apertura-card">
        <div className="gy-lock-icon"><ShieldCheck size={24} /></div>
        <h1>{config.nombreComercio}</h1>
        <h3>Apertura de caja</h3>
        <p>Ingresa la clave de administrador para iniciar la jornada.</p>
        <form onSubmit={handleSubmit} className="gy-lock-form">
          <input
            type="password"
            className="gy-input"
            placeholder="Clave de administrador"
            value={clave}
            onChange={(e) => { setClave(e.target.value); setError(false); }}
            autoFocus
          />
          <button type="submit" className="gy-btn-primary"><Unlock size={15} /> Abrir caja</button>
        </form>
        {error && <p className="gy-error-text">Clave incorrecta.</p>}
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Header + navegación                                                */
/* ------------------------------------------------------------------ */

function Header({ config, displayCurrency, setDisplayCurrency, vistaOculta, setVistaOculta, onCerrarCaja }) {
  const BrandIcon = iconById(config.logoIcono);
  const [pidiendoClave, setPidiendoClave] = useState(false);

  function handleEyeClick() {
    if (vistaOculta) {
      // Volver a mostrar los números requiere autorización del operador
      setPidiendoClave(true);
    } else {
      // Ocultar es inmediato, no requiere clave
      setVistaOculta(true);
    }
  }

  return (
    <header className="gy-header">
      <div className="gy-brand">
        <span className="gy-brand-icon">
          {config.logoTipo === "imagen" && config.logoImagen ? (
            <img src={config.logoImagen} alt="Logo" />
          ) : (
            <BrandIcon size={22} />
          )}
        </span>
        <div>
          <h1>{config.nombreComercio}</h1>
          <p>{config.tagline}</p>
        </div>
      </div>
      <div className="gy-header-right">
        <div className="gy-rate-pill">
          <ArrowLeftRight size={14} />
          <span>{vistaOculta ? "1$ = •••• Bs" : `1$ = ${config.tasaCambio.toLocaleString("es-VE")} Bs`}</span>
        </div>
        <button
          type="button"
          className="gy-icon-toggle"
          onClick={handleEyeClick}
          title={vistaOculta ? "Mostrar tasa y totales (pide clave)" : "Ocultar tasa y totales"}
        >
          {vistaOculta ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          type="button"
          className="gy-currency-toggle"
          onClick={() => setDisplayCurrency((c) => (c === "USD" ? "BS" : "USD"))}
          title="Cambiar moneda de visualización"
        >
          <span className={displayCurrency === "USD" ? "on" : ""}>$</span>
          <span className={displayCurrency === "BS" ? "on" : ""}>Bs</span>
        </button>
        <button type="button" className="gy-icon-toggle" onClick={onCerrarCaja} title="Cerrar caja">
          <Lock size={16} />
        </button>
      </div>

      <OperatorGateModal
        open={pidiendoClave}
        config={config}
        title="Mostrar tasa y totales"
        mensaje="Se requiere la clave de operador para volver a mostrar la información oculta."
        onCancel={() => setPidiendoClave(false)}
        onConfirm={() => { setVistaOculta(false); setPidiendoClave(false); }}
      />
    </header>
  );
}

function TabNav({ tab, setTab, proveedoresVencidos }) {
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
            {t.id === "proveedores" && proveedoresVencidos > 0 && (
              <span className="gy-badge-count">{proveedoresVencidos}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Tique imprimible (solo visible en @media print)                     */
/* ------------------------------------------------------------------ */

function PrintableTicket({ data, nombreComercio, tagline }) {
  if (!data) return null;
  const pagos = data.pagos && data.pagos.length > 0 ? data.pagos : (data.formaPago ? pagosDeVenta(data) : []);
  return (
    <div className="gy-print-ticket">
      <div className="gy-print-head">{(nombreComercio || "").toUpperCase()}</div>
      <div className="gy-print-sub">{tagline}</div>
      <div className="gy-print-line" />
      <div className="gy-print-sub">Tique #{data.numeroTicket || "—"}{data.mesa ? ` · ${data.mesa}` : ""}</div>
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
      {pagos.length > 0 ? (
        pagos.map((p, idx) => (
          <div className="gy-print-sub" key={idx}>
            {paymentMeta(p.metodo).label} {formatMontoPago(p)}{p.referencia ? ` · Ref. ${p.referencia}` : ""}
          </div>
        ))
      ) : (
        <div className="gy-print-sub">Pago pendiente</div>
      )}
      <div className="gy-print-thanks">¡Gracias por tu visita!</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal de clave de operador (acciones de corrección)                 */
/* ------------------------------------------------------------------ */

function OperatorGateModal({ open, config, title, mensaje, onCancel, onConfirm }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) { setPin(""); setError(false); }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === config.claveOperador) {
      onConfirm();
    } else {
      setError(true);
    }
  }

  return (
    <div className="gy-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="gy-modal">
        <div className="gy-lock-icon"><KeyRound size={20} /></div>
        <h3>{title || "Clave de operador"}</h3>
        <p>{mensaje || "Esta acción requiere la clave de operador."}</p>
        <form onSubmit={handleSubmit} className="gy-modal-form">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            className="gy-input gy-input-pin"
            placeholder="••••"
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(false); }}
            autoFocus
          />
          <div className="gy-modal-actions">
            <button type="button" className="gy-btn-ghost" onClick={onCancel}><X size={15} /> Cancelar</button>
            <button type="submit" className="gy-btn-primary"><Check size={15} /> Confirmar</button>
          </div>
        </form>
        {error && <p className="gy-error-text">Clave incorrecta.</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pantalla completa que exige la clave de operador para ver un tab     */
/*  (Jornada, Historial, Proveedores). Se vuelve a pedir cada vez que    */
/*  se entra a la pestaña, igual que la Configuración con la clave de   */
/*  administrador.                                                      */
/* ------------------------------------------------------------------ */

function OperatorLockGate({ config, title, children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === config.claveOperador) {
      setUnlocked(true);
    } else {
      setError(true);
    }
  }

  if (unlocked) return children;

  return (
    <div className="gy-lock-screen">
      <div className="gy-lock-icon"><KeyRound size={22} /></div>
      <h3>{title}</h3>
      <p>Ingresa la clave de operador para ver esta sección.</p>
      <form onSubmit={handleSubmit} className="gy-modal-form">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          className="gy-input gy-input-pin"
          placeholder="••••"
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(false); }}
          autoFocus
        />
        <button type="submit" className="gy-btn-primary"><Unlock size={15} /> Entrar</button>
      </form>
      {error && <p className="gy-error-text">Clave incorrecta.</p>}
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Tab: Pedidos (Venta directa + Mesas)                                */
/* ------------------------------------------------------------------ */

function PedidosTab({ products, config, sales, mesas, persistSales, persistProducts, persistMesas, displayCurrency, showToast, triggerPrint }) {
  const [modo, setModo] = useState("directa"); // 'directa' | 'mesas'

  return (
    <div className="gy-stack">
      <div className="gy-submode-toggle">
        <button type="button" className={modo === "directa" ? "active" : ""} onClick={() => setModo("directa")}>
          <Receipt size={15} /> Venta directa
        </button>
        <button type="button" className={modo === "mesas" ? "active" : ""} onClick={() => setModo("mesas")}>
          <LayoutGrid size={15} /> Mesas
          {mesas.length > 0 && <span className="gy-badge-count">{mesas.length}</span>}
        </button>
      </div>

      {modo === "directa" && (
        <NuevaVentaTab
          products={products}
          config={config}
          sales={sales}
          mesas={mesas}
          persistSales={persistSales}
          persistProducts={persistProducts}
          persistMesas={persistMesas}
          displayCurrency={displayCurrency}
          showToast={showToast}
          triggerPrint={triggerPrint}
          onEnviadoAMesa={() => setModo("mesas")}
        />
      )}

      {modo === "mesas" && (
        <MesasPanel
          products={products}
          config={config}
          sales={sales}
          mesas={mesas}
          persistSales={persistSales}
          persistProducts={persistProducts}
          persistMesas={persistMesas}
          displayCurrency={displayCurrency}
          showToast={showToast}
          triggerPrint={triggerPrint}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Formas de pago combinadas (una venta puede pagarse con varias)      */
/* ------------------------------------------------------------------ */

// Resuelve el monto real de cada línea de pago: si solo hay una forma de
// pago seleccionada, se asume que cubre el 100% del total (no hace falta
// escribir el monto). Si hay dos o más, se usa lo que el usuario escribió
// en la celda de cada botón.
function resolvePagos(pagos, totalUSD, totalBs) {
  if (pagos.length === 1) {
    const meta = paymentMeta(pagos[0].metodo);
    return [{ ...pagos[0], monto: meta.currency === "Bs" ? totalBs : totalUSD }];
  }
  return pagos.map((p) => ({ ...p, monto: Number(p.monto) || 0 }));
}

function PagoMultipleForm({ pagos, setPagos, totalUSD, config, errorPagos }) {
  const totalBs = totalUSD * config.tasaCambio;
  const multiple = pagos.length > 1;

  function toggleMetodo(metodoId) {
    setPagos((prev) => {
      const existe = prev.find((p) => p.metodo === metodoId);
      if (existe) return prev.filter((p) => p.metodo !== metodoId);
      return [...prev, { metodo: metodoId, monto: "", referencia: "" }];
    });
  }
  function updateCampo(metodoId, campo, value) {
    setPagos((prev) => prev.map((p) => (p.metodo === metodoId ? { ...p, [campo]: value } : p)));
  }

  const resueltos = resolvePagos(pagos, totalUSD, totalBs);
  const cubiertoUSD = resueltos.reduce((sum, p) => sum + montoLineaEnUSD(p, config.tasaCambio), 0);
  const restanteUSD = totalUSD - cubiertoUSD;
  const cubierto = Math.abs(restanteUSD) < 0.015;

  return (
    <div className="gy-field">
      <label>Forma(s) de pago <span className="gy-field-hint">(elige una, o varias si se paga combinado)</span></label>

      <div className="gy-payment-grid">
        {PAYMENT_METHODS.map((m) => {
          const Icon = m.icon;
          const pago = pagos.find((p) => p.metodo === m.id);
          const active = !!pago;
          return (
            <div key={m.id} className={`gy-payment-cell ${active ? "active" : ""}`}>
              <button type="button" className={`gy-payment-btn ${active ? "active" : ""}`} onClick={() => toggleMetodo(m.id)}>
                <Icon size={16} />
                <span>{m.label}</span>
              </button>
              {active && multiple && (
                <div className="gy-payment-monto-cell">
                  <input
                    type="number" step="0.01" placeholder="Monto" value={pago.monto}
                    onChange={(e) => updateCampo(m.id, "monto", e.target.value)}
                  />
                  <span className="gy-payment-currency-tag">{m.currency}</span>
                </div>
              )}
              {active && m.id === "pago_movil" && (
                <input
                  type="text" inputMode="numeric" className="gy-payment-ref-cell"
                  placeholder="N° referencia" value={pago.referencia}
                  onChange={(e) => updateCampo(m.id, "referencia", e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      {pagos.length > 0 && (
        <div className={`gy-pago-resumen ${cubierto ? "ok" : restanteUSD > 0 ? "falta" : "vuelto"}`}>
          {cubierto && <span><Check size={13} /> Cubierto: {formatUSD(totalUSD)}</span>}
          {!cubierto && restanteUSD > 0 && (
            <span><AlertTriangle size={13} /> Falta cubrir: {formatUSD(restanteUSD)} ({formatBs(restanteUSD * config.tasaCambio)})</span>
          )}
          {!cubierto && restanteUSD < 0 && (
            <span><ArrowLeftRight size={13} /> Vuelto: {formatUSD(Math.abs(restanteUSD))} ({formatBs(Math.abs(restanteUSD) * config.tasaCambio)})</span>
          )}
        </div>
      )}

      {errorPagos && <p className="gy-error-text">{errorPagos}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Nueva Venta (venta directa, de una sola vez)                   */
/* ------------------------------------------------------------------ */

function NuevaVentaTab({ products, config, sales, mesas, persistSales, persistProducts, persistMesas, displayCurrency, showToast, triggerPrint, onEnviadoAMesa }) {
  const [fecha, setFecha] = useState(todayISO());
  const [cart, setCart] = useState([]); // {productId, name, priceUSD, qty}
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [numeroTicket, setNumeroTicket] = useState("");
  const [pagos, setPagos] = useState([]);
  const [errors, setErrors] = useState({});
  const [showEnviarMesa, setShowEnviarMesa] = useState(false);
  const [nombreMesaDestino, setNombreMesaDestino] = useState("");
  const inputRef = useRef(null);

  async function handleEnviarAMesa() {
    const nombre = nombreMesaDestino.trim();
    if (cart.length === 0 || !nombre) return;
    const nueva = { id: uid("mesa"), nombre, items: cart, fecha: todayISO(), createdAt: new Date().toISOString() };
    await persistMesas([...mesas, nueva]);
    showToast(`Pedido enviado a «${nombre}».`, "ok");
    setCart([]);
    setShowEnviarMesa(false);
    setNombreMesaDestino("");
    onEnviadoAMesa && onEnviadoAMesa();
  }

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
    if (pagos.length === 0) {
      errs.pagos = "Selecciona al menos una forma de pago.";
    } else if (pagos.length > 1 && pagos.some((p) => !p.monto || Number(p.monto) <= 0)) {
      errs.pagos = "Coloca el monto de cada forma de pago seleccionada.";
    } else if (pagos.some((p) => p.metodo === "pago_movil" && !p.referencia.trim())) {
      errs.pagos = "Coloca el número de referencia de Pago Móvil.";
    } else {
      const resueltos = resolvePagos(pagos, totalUSD, totalBs);
      const cubiertoUSD = resueltos.reduce((sum, p) => sum + montoLineaEnUSD(p, config.tasaCambio), 0);
      if (totalUSD - cubiertoUSD > 0.015) errs.pagos = "Las formas de pago no cubren el total de la venta.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleGuardar() {
    if (!validate()) return;
    const pagosLimpios = resolvePagos(pagos, totalUSD, totalBs).map((p) => ({
      metodo: p.metodo,
      monto: p.monto,
      referencia: p.metodo === "pago_movil" ? p.referencia.trim() : "",
    }));
    const nueva = {
      id: uid("venta"),
      fecha,
      numeroTicket: numeroTicket.trim(),
      items: cart,
      totalUSD,
      totalBs,
      tasaUsada: config.tasaCambio,
      pagos: pagosLimpios,
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
    setPagos([]);
    setErrors({});
    setNumeroTicket(suggestTicket(fecha, next));
  }

  function handlePrint() {
    const pagosLimpios = resolvePagos(pagos, totalUSD, totalBs).map((p) => ({
      metodo: p.metodo, monto: p.monto,
      referencia: p.metodo === "pago_movil" ? p.referencia : "",
    }));
    triggerPrint({
      numeroTicket: numeroTicket.trim(),
      fecha,
      items: cart,
      totalUSD,
      totalBs,
      pagos: pagosLimpios,
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

        <PagoMultipleForm pagos={pagos} setPagos={setPagos} totalUSD={totalUSD} config={config} errorPagos={errors.pagos} />
      </section>

      <section className="gy-ticket-wrap">
        <div className="gy-ticket ticket-edge-bottom">
          <div className="gy-ticket-head">
            <Coffee size={18} />
            <span>{config.nombreComercio}</span>
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

          {pagos.filter((p) => p.metodo).length > 0 && (
            <div className="gy-ticket-pago-list">
              {resolvePagos(pagos, totalUSD, totalBs).filter((p) => p.metodo).map((p) => {
                const meta = paymentMeta(p.metodo);
                return (
                  <div className="gy-ticket-pago" key={p.metodo}>
                    <meta.icon size={14} />
                    <span>{meta.label} {formatMontoPago(p)}</span>
                    {p.metodo === "pago_movil" && p.referencia && <span className="gy-ticket-ref">Ref. {p.referencia}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showEnviarMesa && (
          <div className="gy-enviar-mesa-form">
            <input
              className="gy-input gy-input-sm"
              placeholder="Nombre o número de mesa"
              value={nombreMesaDestino}
              onChange={(e) => setNombreMesaDestino(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleEnviarAMesa(); }}
              autoFocus
            />
            <button type="button" className="gy-btn-primary" onClick={handleEnviarAMesa} disabled={!nombreMesaDestino.trim()}>
              <Check size={14} /> Enviar
            </button>
            <button type="button" className="gy-btn-ghost" onClick={() => { setShowEnviarMesa(false); setNombreMesaDestino(""); }}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="gy-ticket-actions">
          <button type="button" className="gy-btn-ghost gy-print-btn" onClick={handlePrint} disabled={cart.length === 0}>
            <Printer size={16} /> Imprimir
          </button>
          <button
            type="button"
            className="gy-btn-ghost gy-print-btn"
            onClick={() => setShowEnviarMesa((v) => !v)}
            disabled={cart.length === 0}
            title="Enviar este pedido a una mesa para seguir agregando después"
          >
            <Send size={16} /> A mesa
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
/*  Mesas (cuentas abiertas)                                            */
/* ------------------------------------------------------------------ */

function MesasPanel({ products, config, sales, mesas, persistSales, persistProducts, persistMesas, displayCurrency, showToast, triggerPrint }) {
  const [selectedId, setSelectedId] = useState(null);
  const [nuevaMesaNombre, setNuevaMesaNombre] = useState("");
  const [showNueva, setShowNueva] = useState(false);
  const [gateAction, setGateAction] = useState(null); // función pendiente tras validar clave de operador

  const selected = mesas.find((m) => m.id === selectedId) || null;

  async function abrirMesa() {
    const nombre = nuevaMesaNombre.trim();
    if (!nombre) return;
    const nueva = { id: uid("mesa"), nombre, items: [], fecha: todayISO(), createdAt: new Date().toISOString() };
    await persistMesas([...mesas, nueva]);
    setNuevaMesaNombre("");
    setShowNueva(false);
    setSelectedId(nueva.id);
  }

  function pedirClaveOperador(accion) {
    setGateAction(() => accion);
  }

  async function borrarMesa(id) {
    await persistMesas(mesas.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  if (selected) {
    return (
      <>
        <MesaDetalle
          mesa={selected}
          products={products}
          config={config}
          sales={sales}
          persistSales={persistSales}
          persistProducts={persistProducts}
          persistMesas={persistMesas}
          mesas={mesas}
          displayCurrency={displayCurrency}
          showToast={showToast}
          triggerPrint={triggerPrint}
          onVolver={() => setSelectedId(null)}
          onCerrada={() => setSelectedId(null)}
        />
      </>
    );
  }

  return (
    <div className="gy-stack">
      <div className="gy-mesas-toolbar">
        <p className="gy-panel-help" style={{ margin: 0 }}>
          Abre una mesa para ir agregando productos durante el consumo, y cóbrala cuando el cliente pida la cuenta.
        </p>
        <button type="button" className="gy-btn-primary" onClick={() => setShowNueva((v) => !v)}>
          <Plus size={16} /> Nueva mesa
        </button>
      </div>

      {showNueva && (
        <div className="gy-add-panel gy-add-panel-mesa">
          <div className="gy-field" style={{ marginBottom: 0 }}>
            <label>Nombre o número de mesa</label>
            <input
              className="gy-input"
              placeholder="Ej: Mesa 4, Terraza 2, Para llevar - Ana"
              value={nuevaMesaNombre}
              onChange={(e) => setNuevaMesaNombre(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") abrirMesa(); }}
              autoFocus
            />
          </div>
          <button type="button" className="gy-btn-primary" onClick={abrirMesa}><Check size={15} /> Abrir</button>
        </div>
      )}

      {mesas.length === 0 ? (
        <p className="gy-empty-state">No hay mesas abiertas en este momento.</p>
      ) : (
        <div className="gy-mesas-grid">
          {mesas.map((m) => {
            const totalUSD = m.items.reduce((s, i) => s + i.priceUSD * i.qty, 0);
            const totalBs = totalUSD * config.tasaCambio;
            const totalItems = m.items.reduce((s, i) => s + i.qty, 0);
            return (
              <div className="gy-mesa-card" key={m.id}>
                <button type="button" className="gy-mesa-card-main" onClick={() => setSelectedId(m.id)}>
                  <span className="gy-mesa-name">{m.nombre}</span>
                  <span className="gy-mesa-items">{totalItems === 0 ? "Sin productos aún" : `${totalItems} producto${totalItems === 1 ? "" : "s"}`}</span>
                  <span className="gy-mesa-total">{formatUSD(totalUSD)} · {formatBs(totalBs)}</span>
                </button>
                {gateAction && gateAction.__mesaId === m.id ? null : (
                  <button
                    type="button"
                    className="gy-icon-btn-danger"
                    title="Descartar mesa"
                    onClick={() => pedirClaveOperador(Object.assign(() => borrarMesa(m.id), { __mesaId: m.id }))}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <OperatorGateModal
        open={!!gateAction}
        config={config}
        title="Descartar mesa"
        mensaje="Se requiere la clave de operador para descartar una mesa abierta."
        onCancel={() => setGateAction(null)}
        onConfirm={() => { const fn = gateAction; setGateAction(null); fn && fn(); }}
      />
    </div>
  );
}

function MesaDetalle({ mesa, products, config, sales, persistSales, persistProducts, persistMesas, mesas, displayCurrency, showToast, triggerPrint, onVolver, onCerrada }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCobro, setShowCobro] = useState(false);
  const [numeroTicket, setNumeroTicket] = useState("");
  const [pagos, setPagos] = useState([]);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, products]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  async function updateItems(nextItems) {
    const nextMesas = mesas.map((m) => (m.id === mesa.id ? { ...m, items: nextItems } : m));
    await persistMesas(nextMesas);
  }

  function addToCart(product) {
    if (typeof product.stock === "number" && product.stock <= 0) {
      showToast(`«${product.name}» figura sin stock en el inventario.`, "error");
    }
    const found = mesa.items.find((i) => i.productId === product.id);
    const next = found
      ? mesa.items.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i))
      : [...mesa.items, { productId: product.id, name: product.name, priceUSD: product.priceUSD, qty: 1 }];
    updateItems(next);
    setQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function changeQty(productId, delta) {
    const next = mesa.items
      .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
      .filter((i) => i.qty > 0);
    updateItems(next);
  }

  function removeItem(productId) {
    updateItems(mesa.items.filter((i) => i.productId !== productId));
  }

  const totalUSD = useMemo(() => mesa.items.reduce((sum, i) => sum + i.priceUSD * i.qty, 0), [mesa.items]);
  const totalBs = totalUSD * config.tasaCambio;

  function handleKeyDown(e) {
    if (!showDropdown || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); addToCart(results[activeIndex]); }
    else if (e.key === "Escape") { setShowDropdown(false); }
  }

  function abrirCobro() {
    const count = sales.filter((s) => s.fecha === todayISO()).length;
    setNumeroTicket(String(count + 1));
    setShowCobro(true);
  }

  function validate() {
    const errs = {};
    if (mesa.items.length === 0) errs.cart = "Agrega al menos un producto antes de cobrar.";
    if (!numeroTicket.trim()) errs.numeroTicket = "Coloca el número de tique.";
    if (pagos.length === 0) {
      errs.pagos = "Selecciona al menos una forma de pago.";
    } else if (pagos.length > 1 && pagos.some((p) => !p.monto || Number(p.monto) <= 0)) {
      errs.pagos = "Coloca el monto de cada forma de pago seleccionada.";
    } else if (pagos.some((p) => p.metodo === "pago_movil" && !p.referencia.trim())) {
      errs.pagos = "Coloca el número de referencia de Pago Móvil.";
    } else {
      const resueltos = resolvePagos(pagos, totalUSD, totalBs);
      const cubiertoUSD = resueltos.reduce((sum, p) => sum + montoLineaEnUSD(p, config.tasaCambio), 0);
      if (totalUSD - cubiertoUSD > 0.015) errs.pagos = "Las formas de pago no cubren el total de la cuenta.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCobrar() {
    if (!validate()) return;
    const pagosLimpios = resolvePagos(pagos, totalUSD, totalBs).map((p) => ({
      metodo: p.metodo,
      monto: p.monto,
      referencia: p.metodo === "pago_movil" ? p.referencia.trim() : "",
    }));
    const fecha = todayISO();
    const nueva = {
      id: uid("venta"),
      fecha,
      numeroTicket: numeroTicket.trim(),
      mesa: mesa.nombre,
      items: mesa.items,
      totalUSD,
      totalBs,
      tasaUsada: config.tasaCambio,
      pagos: pagosLimpios,
      timestamp: new Date().toISOString(),
    };
    await persistSales([...sales, nueva]);

    const nextProducts = products.map((p) => {
      const item = mesa.items.find((i) => i.productId === p.id);
      if (!item || typeof p.stock !== "number") return p;
      return { ...p, stock: Math.max(0, p.stock - item.qty) };
    });
    await persistProducts(nextProducts);

    await persistMesas(mesas.filter((m) => m.id !== mesa.id));
    showToast(`Mesa «${mesa.nombre}» cobrada — tique #${nueva.numeroTicket}.`, "ok");
    onCerrada();
  }

  function handlePrintPreview() {
    const pagosLimpios = resolvePagos(pagos, totalUSD, totalBs).filter((p) => p.metodo).map((p) => ({
      metodo: p.metodo, monto: p.monto,
      referencia: p.metodo === "pago_movil" ? p.referencia : "",
    }));
    triggerPrint({
      numeroTicket: numeroTicket || "—",
      fecha: todayISO(),
      mesa: mesa.nombre,
      items: mesa.items,
      totalUSD,
      totalBs,
      pagos: pagosLimpios,
    });
  }

  return (
    <div className="gy-venta-grid">
      <section className="gy-panel">
        <button type="button" className="gy-btn-ghost gy-back-btn" onClick={onVolver}>
          <ArrowLeft size={15} /> Volver a mesas
        </button>

        <div className="gy-field gy-search-field">
          <label>Agregar producto a {mesa.nombre}</label>
          <div className="gy-search-box">
            <Search size={16} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe el nombre…"
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
              {results.map((p, idx) => (
                <button
                  type="button"
                  key={p.id}
                  className={`gy-dropdown-item ${idx === activeIndex ? "active" : ""}`}
                  onMouseDown={() => addToCart(p)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div>
                    <span className="gy-dd-name">{p.name}</span>
                    <span className="gy-dd-cat">{p.category}</span>
                  </div>
                  <span className="gy-dd-price">
                    {displayCurrency === "USD" ? formatUSD(p.priceUSD) : formatBs(p.priceUSD * config.tasaCambio)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.cart && <p className="gy-error-text">{errors.cart}</p>}

        {showCobro && (
          <>
            <div className="gy-field">
              <label>Número de tique</label>
              <input className="gy-input" value={numeroTicket} onChange={(e) => setNumeroTicket(e.target.value)} />
              {errors.numeroTicket && <p className="gy-error-text">{errors.numeroTicket}</p>}
            </div>
            <PagoMultipleForm pagos={pagos} setPagos={setPagos} totalUSD={totalUSD} config={config} errorPagos={errors.pagos} />
          </>
        )}
      </section>

      <section className="gy-ticket-wrap">
        <div className="gy-ticket ticket-edge-bottom">
          <div className="gy-ticket-head">
            <Coffee size={18} />
            <span>{config.nombreComercio}</span>
          </div>
          <div className="gy-ticket-sub muted">{mesa.nombre}</div>

          <div className="gy-ticket-items">
            {mesa.items.length === 0 && <p className="gy-ticket-empty">Aún no hay productos agregados.</p>}
            {mesa.items.map((i) => (
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

          {pagos.filter((p) => p.metodo).length > 0 && (
            <div className="gy-ticket-pago-list">
              {resolvePagos(pagos, totalUSD, totalBs).filter((p) => p.metodo).map((p) => {
                const meta = paymentMeta(p.metodo);
                return (
                  <div className="gy-ticket-pago" key={p.metodo}>
                    <meta.icon size={14} />
                    <span>{meta.label} {formatMontoPago(p)}</span>
                    {p.metodo === "pago_movil" && p.referencia && <span className="gy-ticket-ref">Ref. {p.referencia}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="gy-ticket-actions">
          <button type="button" className="gy-btn-ghost gy-print-btn" onClick={handlePrintPreview} disabled={mesa.items.length === 0}>
            <Printer size={16} /> Imprimir
          </button>
          {!showCobro ? (
            <button type="button" className="gy-btn-primary gy-save-btn" onClick={abrirCobro} disabled={mesa.items.length === 0}>
              <Receipt size={17} /> Cobrar / cerrar cuenta
            </button>
          ) : (
            <button type="button" className="gy-btn-primary gy-save-btn" onClick={handleCobrar}>
              <Check size={17} /> Confirmar cobro
            </button>
          )}
        </div>
      </section>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Tab: Jornada (control diario)                                       */
/* ------------------------------------------------------------------ */

function JornadaTab({ sales, persistSales, triggerPrint, vistaOculta, config }) {
  const [fecha, setFecha] = useState(todayISO());
  const [gateSaleId, setGateSaleId] = useState(null);
  const [metodosSeleccionados, setMetodosSeleccionados] = useState(() => new Set());

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
      pagosDeVenta(v).forEach((p) => {
        if (!map[p.metodo]) map[p.metodo] = { count: 0, usd: 0, bs: 0 };
        map[p.metodo].count += 1;
        const meta = paymentMeta(p.metodo);
        if (meta.currency === "Bs") map[p.metodo].bs += Number(p.monto) || 0;
        else map[p.metodo].usd += Number(p.monto) || 0;
      });
    });
    return map;
  }, [ventasDia]);

  function toggleMetodo(id) {
    setMetodosSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Ventas que incluyen al menos uno de los métodos seleccionados (un pago
  // mixto cuenta para cada método que lo compone).
  const ventasFiltradas = useMemo(() => {
    if (metodosSeleccionados.size === 0) return ventasDia;
    return ventasDia.filter((v) => pagosDeVenta(v).some((p) => metodosSeleccionados.has(p.metodo)));
  }, [ventasDia, metodosSeleccionados]);

  async function handleDelete(id) {
    await persistSales(sales.filter((s) => s.id !== id));
    setGateSaleId(null);
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
          <span className="gy-card-value">{mask(formatUSD(totalUSD), vistaOculta)}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total Bs</span>
          <span className="gy-card-value">{mask(formatBs(totalBs), vistaOculta)}</span>
        </div>
      </div>

      <div className="gy-method-grid">
        {PAYMENT_METHODS.map((m) => {
          const d = porMetodo[m.id] || { count: 0, usd: 0, bs: 0 };
          const Icon = m.icon;
          const activo = metodosSeleccionados.has(m.id);
          return (
            <button
              type="button"
              className={`gy-method-card gy-method-card-btn ${activo ? "active" : ""}`}
              key={m.id}
              onClick={() => toggleMetodo(m.id)}
              title="Ver los tiques pagados con este método"
            >
              <div className="gy-method-head"><Icon size={15} /><span>{m.label}</span></div>
              <span className="gy-method-count">{d.count} pago{d.count === 1 ? "" : "s"}</span>
              <span className="gy-method-amount">{mask(m.currency === "Bs" ? formatBs(d.bs) : formatUSD(d.usd), vistaOculta)}</span>
            </button>
          );
        })}
      </div>

      {metodosSeleccionados.size > 0 && (
        <div className="gy-filtro-chip">
          <span>
            Mostrando tiques pagados con: {[...metodosSeleccionados].map((id) => paymentMeta(id).label).join(" + ")}
          </span>
          <button type="button" onClick={() => setMetodosSeleccionados(new Set())}><X size={13} /> Quitar filtro</button>
        </div>
      )}

      <div className="gy-list">
        {ventasFiltradas.length === 0 && (
          <p className="gy-empty-state">
            {metodosSeleccionados.size > 0
              ? "Ningún tique del día usó los métodos seleccionados."
              : `No hay ventas registradas para el ${formatFechaLarga(fecha)}.`}
          </p>
        )}
        {ventasFiltradas.map((v) => {
          const pagos = pagosDeVenta(v);
          const combinado = pagos.length > 1;
          const PagoIcon = combinado ? Split : paymentMeta(pagos[0]?.metodo).icon;
          return (
            <div className="gy-sale-row" key={v.id}>
              <div className="gy-sale-main">
                <span className="gy-sale-ticket">#{v.numeroTicket}{v.mesa ? ` · ${v.mesa}` : ""}</span>
                <span className="gy-sale-hora">{formatHora(v.timestamp)}</span>
                <span className="gy-sale-items">{v.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>
              </div>
              <div className="gy-sale-side">
                <span className="gy-sale-total">{mask(`${formatUSD(v.totalUSD)} · ${formatBs(v.totalBs)}`, vistaOculta)}</span>
                <span className="gy-sale-pago"><PagoIcon size={13} /> {resumenPagosTexto(pagos)}</span>
              </div>
              <button
                type="button"
                className="gy-icon-btn"
                title="Imprimir tique"
                onClick={() => triggerPrint({
                  numeroTicket: v.numeroTicket, fecha: v.fecha, mesa: v.mesa, items: v.items,
                  totalUSD: v.totalUSD, totalBs: v.totalBs, pagos,
                })}
              >
                <Printer size={15} />
              </button>
              <button type="button" className="gy-icon-btn-danger" onClick={() => setGateSaleId(v.id)} title="Anular venta">
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <OperatorGateModal
        open={!!gateSaleId}
        config={config}
        title="Anular tique"
        mensaje="Se requiere la clave de operador para anular una venta ya registrada."
        onCancel={() => setGateSaleId(null)}
        onConfirm={() => handleDelete(gateSaleId)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Historial mensual                                              */
/* ------------------------------------------------------------------ */

function ChartBsLabel(props) {
  const { x, y, width, value } = props;
  if (value === undefined || value === null || !width) return null;
  const text = `${Number(value).toLocaleString("es-VE", { maximumFractionDigits: 0 })} Bs`;
  return (
    <text x={x + width / 2} y={y + 14} textAnchor="middle" fontSize={8.5} fill="#FFFFFF" fontWeight={600}>
      {text}
    </text>
  );
}

function HistorialTab({ sales, vistaOculta }) {
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
      pagosDeVenta(v).forEach((p) => {
        if (!map[p.metodo]) map[p.metodo] = { count: 0, usd: 0, bs: 0 };
        map[p.metodo].count += 1;
        const meta = paymentMeta(p.metodo);
        if (meta.currency === "Bs") map[p.metodo].bs += Number(p.monto) || 0;
        else map[p.metodo].usd += Number(p.monto) || 0;
      });
    });
    return map;
  }, [ventasMes]);

  // El monto en $ y en Bs de cada día queda fijo con lo que ya se guardó en
  // cada venta (no se recalcula con la tasa actual), así que cambiar la tasa
  // de cambio hoy no altera los días ya cerrados.
  const chartData = useMemo(() => {
    let acumulado = 0;
    return porDia.map((d, idx) => {
      acumulado += d.totalUSD;
      return {
        dia: d.fecha.slice(8, 10),
        USD: Math.round(d.totalUSD * 100) / 100,
        Bs: Math.round(d.totalBs),
        promedio: Math.round((acumulado / (idx + 1)) * 100) / 100,
      };
    });
  }, [porDia]);

  const rankingProductos = useMemo(() => {
    const map = {};
    ventasMes.forEach((v) => {
      v.items.forEach((i) => {
        if (!map[i.name]) map[i.name] = { name: i.name, qty: 0 };
        map[i.name].qty += i.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 8);
  }, [ventasMes]);

  return (
    <div className="gy-stack">
      <div className="gy-historial-top">
        <div className="gy-field gy-date-picker" style={{ marginBottom: 0 }}>
          <label><CalendarDays size={15} /> Mes</label>
          <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="gy-input" />
        </div>

        {rankingProductos.length > 0 && (
          <div className="gy-ranking-box">
            <span className="gy-ranking-title"><Award size={14} /> Más vendidos del mes</span>
            <div className="gy-ranking-strip">
              {rankingProductos.map((p, idx) => (
                <div className="gy-ranking-chip" key={p.name}>
                  <span className="gy-ranking-pos">{idx + 1}</span>
                  <span className="gy-ranking-name">{p.name}</span>
                  <span className="gy-ranking-qty">{p.qty}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      <div className="gy-summary-cards">
        <div className="gy-card">
          <span className="gy-card-label">Días con venta</span>
          <span className="gy-card-value">{porDia.length}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total $</span>
          <span className="gy-card-value">{mask(formatUSD(totalUSD), vistaOculta)}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total Bs</span>
          <span className="gy-card-value">{mask(formatBs(totalBs), vistaOculta)}</span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="gy-chart-box">
          <span className="gy-chart-title"><TrendingUp size={14} /> Ventas por día ($, con el equivalente en Bs de cada venta, y el promedio acumulado)</span>
          {vistaOculta ? (
            <p className="gy-empty-state">Vista oculta — desactiva el ícono del ojo para ver el gráfico.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1DAC9" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#6F6659" }} axisLine={{ stroke: "#E1DAC9" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6F6659" }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(v, name) => {
                    if (name === "USD") return [`$${Number(v).toFixed(2)}`, "Total $"];
                    if (name === "promedio") return [`$${Number(v).toFixed(2)}`, "Promedio acumulado"];
                    return [`${Number(v).toLocaleString("es-VE")} Bs`, "Total Bs"];
                  }}
                  labelFormatter={(l) => `Día ${l}`}
                  contentStyle={{ borderRadius: 10, border: "1px solid #E1DAC9", fontSize: 12 }}
                />
                <Legend
                  formatter={(value) => (value === "USD" ? "Ventas del día" : "Promedio acumulado")}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="USD" fill="#2E6B47" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="Bs" content={<ChartBsLabel />} />
                </Bar>
                <Line type="monotone" dataKey="promedio" stroke="#A23E2E" strokeWidth={2} dot={{ r: 2.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      <div className="gy-method-grid">
        {PAYMENT_METHODS.map((m) => {
          const d = porMetodo[m.id] || { count: 0, usd: 0, bs: 0 };
          const Icon = m.icon;
          return (
            <div className="gy-method-card" key={m.id}>
              <div className="gy-method-head"><Icon size={15} /><span>{m.label}</span></div>
              <span className="gy-method-count">{d.count} pago{d.count === 1 ? "" : "s"}</span>
              <span className="gy-method-amount">{mask(m.currency === "Bs" ? formatBs(d.bs) : formatUSD(d.usd), vistaOculta)}</span>
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
              <tr><th>Fecha</th><th>Tiques</th><th>Total $</th><th>Total Bs</th><th>Tique promedio</th></tr>
            </thead>
            <tbody>
              {porDia.map((d) => (
                <tr key={d.fecha}>
                  <td>{formatFechaLarga(d.fecha)}</td>
                  <td>{d.tickets}</td>
                  <td>{mask(formatUSD(d.totalUSD), vistaOculta)}</td>
                  <td>{mask(formatBs(d.totalBs), vistaOculta)}</td>
                  <td>{mask(formatUSD(d.tickets > 0 ? d.totalUSD / d.tickets : 0), vistaOculta)}</td>
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
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: CATEGORIAS_BASE[0], price: "", stock: "0", alertaStock: "5", costo: "" });
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [gateAction, setGateAction] = useState(null);

  function toggleCollapsed(cat) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

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

  const totalLowStock = useMemo(
    () => products.filter((p) => Number(p.stock ?? 0) <= Number(p.alertaStock ?? 0)).length,
    [products]
  );

  function toUSD(value) {
    const n = Number(value) || 0;
    return displayCurrency === "USD" ? n : n / config.tasaCambio;
  }
  function fromUSD(priceUSD) {
    return displayCurrency === "USD" ? priceUSD : priceUSD * config.tasaCambio;
  }

  function startEdit(p) {
    setEditingId(p.id);
    setDraft({
      name: p.name, category: p.category, price: fromUSD(p.priceUSD).toFixed(2),
      stock: String(p.stock ?? 0), alertaStock: String(p.alertaStock ?? 0), costo: String(p.costo ?? 0),
    });
  }
  function cancelEdit() { setEditingId(null); setDraft({}); }

  function pedirClave(accion) {
    setGateAction(() => accion);
  }

  async function saveEdit(id) {
    const priceUSD = toUSD(draft.price);
    pedirClave(async () => {
      const next = products.map((p) => (p.id === id ? {
        ...p,
        name: draft.name.trim() || p.name,
        category: draft.category,
        priceUSD,
        stock: Number(draft.stock) || 0,
        alertaStock: Number(draft.alertaStock) || 0,
        costo: Number(draft.costo) || 0,
      } : p));
      await persistProducts(next);
      cancelEdit();
    });
  }

  function handleDelete(id) {
    pedirClave(async () => {
      await persistProducts(products.filter((p) => p.id !== id));
    });
  }

  function handleAdd() {
    if (!newProduct.name.trim()) return;
    const priceUSD = toUSD(newProduct.price);
    pedirClave(async () => {
      const next = [...products, {
        id: uid("prod"), name: newProduct.name.trim(), category: newProduct.category, priceUSD,
        stock: Number(newProduct.stock) || 0, alertaStock: Number(newProduct.alertaStock) || 0, costo: Number(newProduct.costo) || 0,
      }];
      await persistProducts(next);
      setNewProduct({ name: "", category: newProduct.category, price: "", stock: "0", alertaStock: "5", costo: "" });
      setShowAdd(false);
    });
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
        {totalLowStock > 0 && (
          <span className="gy-lowstock-pill"><AlertTriangle size={13} /> {totalLowStock} con stock bajo</span>
        )}
        <button type="button" className="gy-btn-primary" onClick={() => setShowAdd((v) => !v)}>
          <PackagePlus size={16} /> Agregar producto
        </button>
      </div>

      {showAdd && (
        <div className="gy-add-panel gy-add-panel-full">
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
          <div className="gy-field">
            <label>Stock inicial</label>
            <input className="gy-input" type="number" value={newProduct.stock} onChange={(e) => setNewProduct((n) => ({ ...n, stock: e.target.value }))} />
          </div>
          <div className="gy-field">
            <label>Alerta de stock bajo</label>
            <input className="gy-input" type="number" value={newProduct.alertaStock} onChange={(e) => setNewProduct((n) => ({ ...n, alertaStock: e.target.value }))} />
          </div>
          <div className="gy-field">
            <label>Costo $ (opcional)</label>
            <input className="gy-input" type="number" step="0.01" value={newProduct.costo} onChange={(e) => setNewProduct((n) => ({ ...n, costo: e.target.value }))} placeholder="0.00" />
          </div>
          <div className="gy-add-actions">
            <button type="button" className="gy-btn-primary" onClick={handleAdd}><Check size={15} /> Guardar</button>
            <button type="button" className="gy-btn-ghost" onClick={() => setShowAdd(false)}><X size={15} /> Cancelar</button>
          </div>
        </div>
      )}

      {Object.keys(agrupados).length === 0 && <p className="gy-empty-state">No se encontraron productos.</p>}

      {Object.entries(agrupados).map(([cat, items]) => {
        const isCollapsed = collapsed.has(cat);
        return (
          <div key={cat} className="gy-category-block">
            <button type="button" className="gy-category-toggle" onClick={() => toggleCollapsed(cat)}>
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              <h3 className="gy-category-title">{cat} <span className="gy-category-count">({items.length})</span></h3>
            </button>
            {!isCollapsed && (
              <div className="gy-product-list">
                {items.map((p) => {
                  const low = Number(p.stock ?? 0) <= Number(p.alertaStock ?? 0);
                  return (
                    <div className={`gy-product-row ${editingId === p.id ? "gy-product-row-editing" : ""}`} key={p.id}>
                      {editingId === p.id ? (
                        <div className="gy-product-edit-grid">
                          <input className="gy-input gy-input-sm" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Nombre" />
                          <select className="gy-input gy-input-sm" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input className="gy-input gy-input-sm" type="number" step="0.01" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} placeholder={displayCurrency === "USD" ? "Precio $" : "Precio Bs"} />
                          <input className="gy-input gy-input-sm" type="number" value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} placeholder="Stock" />
                          <input className="gy-input gy-input-sm" type="number" value={draft.alertaStock} onChange={(e) => setDraft((d) => ({ ...d, alertaStock: e.target.value }))} placeholder="Alerta" />
                          <input className="gy-input gy-input-sm" type="number" step="0.01" value={draft.costo} onChange={(e) => setDraft((d) => ({ ...d, costo: e.target.value }))} placeholder="Costo $" />
                          <div className="gy-product-edit-actions">
                            <button type="button" className="gy-icon-btn-ok" onClick={() => saveEdit(p.id)}><Check size={15} /></button>
                            <button type="button" className="gy-icon-btn" onClick={cancelEdit}><X size={15} /></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="gy-product-name">{p.name}</span>
                          <span className={`gy-product-stock ${low ? "low" : ""}`}>
                            Stock: {p.stock ?? 0}{low && " ⚠"}
                          </span>
                          <span className="gy-product-price">
                            {displayCurrency === "USD" ? formatUSD(p.priceUSD) : formatBs(p.priceUSD * config.tasaCambio)}
                          </span>
                          <button type="button" className="gy-icon-btn" onClick={() => startEdit(p)} title="Editar"><Pencil size={14} /></button>
                          <button type="button" className="gy-icon-btn-danger" onClick={() => handleDelete(p.id)} title="Eliminar"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <OperatorGateModal
        open={!!gateAction}
        config={config}
        title="Clave de operador"
        mensaje="Los cambios de precio, stock, costo y productos requieren la clave de operador."
        onCancel={() => setGateAction(null)}
        onConfirm={() => { const fn = gateAction; setGateAction(null); fn && fn(); }}
      />
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Tab: Proveedores (cuentas por pagar)                                */
/* ------------------------------------------------------------------ */

function ProveedoresTab({ proveedores, persistProveedores, config, showToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ numeroFactura: "", nombre: "", fechaIngreso: todayISO(), fechaVencimiento: todayISO(), monto: "", moneda: "USD" });
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState("todos"); // 'todos' | 'pendientes' | 'vencidos' | 'pagados'
  const [pagandoId, setPagandoId] = useState(null);
  const [metodoPago, setMetodoPago] = useState(null);
  const [referenciaPago, setReferenciaPago] = useState("");
  const [errorPago, setErrorPago] = useState("");

  const hoy = todayISO();

  const conEstado = useMemo(() => {
    return proveedores.map((p) => {
      const vencido = !p.pagado && p.fechaVencimiento < hoy;
      const porVencer = !p.pagado && !vencido && p.fechaVencimiento <= addDays(hoy, 5);
      return { ...p, vencido, porVencer };
    }).sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));
  }, [proveedores, hoy]);

  const filtrados = useMemo(() => {
    if (filtro === "pendientes") return conEstado.filter((p) => !p.pagado);
    if (filtro === "vencidos") return conEstado.filter((p) => p.vencido);
    if (filtro === "pagados") return conEstado.filter((p) => p.pagado);
    return conEstado;
  }, [conEstado, filtro]);

  const totalPendienteUSD = conEstado.filter((p) => !p.pagado).reduce((s, p) => s + (p.moneda === "BS" ? p.monto / config.tasaCambio : p.monto), 0);
  const cantidadVencidos = conEstado.filter((p) => p.vencido).length;

  function resetDraft() {
    setDraft({ numeroFactura: "", nombre: "", fechaIngreso: todayISO(), fechaVencimiento: todayISO(), monto: "", moneda: "USD" });
    setEditingId(null);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setDraft({ numeroFactura: p.numeroFactura, nombre: p.nombre, fechaIngreso: p.fechaIngreso, fechaVencimiento: p.fechaVencimiento, monto: String(p.monto), moneda: p.moneda });
    setShowAdd(true);
  }

  async function handleGuardar() {
    if (!draft.nombre.trim() || !draft.monto) { showToast("Coloca al menos el nombre y el monto."); return; }
    const monto = Number(draft.monto) || 0;
    if (editingId) {
      const next = proveedores.map((p) => (p.id === editingId ? { ...p, ...draft, monto } : p));
      await persistProveedores(next);
    } else {
      const nuevo = { id: uid("prov"), ...draft, monto, pagado: false, fechaPago: null };
      await persistProveedores([...proveedores, nuevo]);
    }
    showToast("Cuenta por pagar guardada.", "ok");
    resetDraft();
    setShowAdd(false);
  }

  function abrirPagoModal(id) {
    setPagandoId(id);
    setMetodoPago(null);
    setReferenciaPago("");
    setErrorPago("");
  }
  function cerrarPagoModal() {
    setPagandoId(null);
    setMetodoPago(null);
    setReferenciaPago("");
    setErrorPago("");
  }
  async function confirmarPago() {
    if (!metodoPago) { setErrorPago("Selecciona la forma de pago."); return; }
    if (metodoPago === "pago_movil" && !referenciaPago.trim()) { setErrorPago("Coloca el número de referencia."); return; }
    const next = proveedores.map((p) => (p.id === pagandoId ? {
      ...p, pagado: true, fechaPago: todayISO(), formaPago: metodoPago,
      referencia: referenciaPago.trim(),
    } : p));
    await persistProveedores(next);
    showToast("Cuenta marcada como pagada.", "ok");
    cerrarPagoModal();
  }
  async function handleMarcarPendiente(id) {
    const next = proveedores.map((p) => (p.id === id ? { ...p, pagado: false, fechaPago: null, formaPago: null, referencia: "" } : p));
    await persistProveedores(next);
  }
  async function handleEliminar(id) {
    await persistProveedores(proveedores.filter((p) => p.id !== id));
  }

  return (
    <div className="gy-stack">
      <div className="gy-summary-cards">
        <div className="gy-card">
          <span className="gy-card-label">Cuentas pendientes</span>
          <span className="gy-card-value">{conEstado.filter((p) => !p.pagado).length}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Total pendiente ($)</span>
          <span className="gy-card-value">{formatUSD(totalPendienteUSD)}</span>
        </div>
        <div className="gy-card">
          <span className="gy-card-label">Vencidas</span>
          <span className="gy-card-value" style={{ color: cantidadVencidos > 0 ? "var(--rust)" : undefined }}>{cantidadVencidos}</span>
        </div>
      </div>

      <div className="gy-productos-toolbar">
        <div className="gy-submode-toggle">
          {[["todos", "Todos"], ["pendientes", "Pendientes"], ["vencidos", "Vencidos"], ["pagados", "Pagados"]].map(([id, label]) => (
            <button type="button" key={id} className={filtro === id ? "active" : ""} onClick={() => setFiltro(id)}>{label}</button>
          ))}
        </div>
        <button type="button" className="gy-btn-primary" onClick={() => { resetDraft(); setShowAdd((v) => !v); }}>
          <PackagePlus size={16} /> Nueva cuenta por pagar
        </button>
      </div>

      {showAdd && (
        <div className="gy-add-panel gy-add-panel-proveedor">
          <div className="gy-field"><label>No. de factura o nota</label><input className="gy-input" value={draft.numeroFactura} onChange={(e) => setDraft((d) => ({ ...d, numeroFactura: e.target.value }))} /></div>
          <div className="gy-field"><label>Nombre del proveedor</label><input className="gy-input" value={draft.nombre} onChange={(e) => setDraft((d) => ({ ...d, nombre: e.target.value }))} /></div>
          <div className="gy-field"><label>Fecha de ingreso</label><input type="date" className="gy-input" value={draft.fechaIngreso} onChange={(e) => setDraft((d) => ({ ...d, fechaIngreso: e.target.value }))} /></div>
          <div className="gy-field"><label>Fecha de vencimiento</label><input type="date" className="gy-input" value={draft.fechaVencimiento} onChange={(e) => setDraft((d) => ({ ...d, fechaVencimiento: e.target.value }))} /></div>
          <div className="gy-field">
            <label>Monto</label>
            <div className="gy-monto-moneda-row">
              <input type="number" step="0.01" className="gy-input" value={draft.monto} onChange={(e) => setDraft((d) => ({ ...d, monto: e.target.value }))} />
              <select className="gy-input" value={draft.moneda} onChange={(e) => setDraft((d) => ({ ...d, moneda: e.target.value }))}>
                <option value="USD">$</option>
                <option value="BS">Bs</option>
              </select>
            </div>
          </div>
          <div className="gy-add-actions">
            <button type="button" className="gy-btn-primary" onClick={handleGuardar}><Check size={15} /> Guardar</button>
            <button type="button" className="gy-btn-ghost" onClick={() => { resetDraft(); setShowAdd(false); }}><X size={15} /> Cancelar</button>
          </div>
        </div>
      )}

      <div className="gy-list">
        {filtrados.length === 0 && <p className="gy-empty-state">No hay cuentas por pagar en esta vista.</p>}
        {filtrados.map((p) => (
          <div className={`gy-proveedor-row ${p.vencido ? "vencido" : ""} ${p.pagado ? "pagado" : ""}`} key={p.id}>
            <div className="gy-proveedor-main">
              <span className="gy-proveedor-nombre">{p.nombre}</span>
              <span className="gy-proveedor-detalle">
                {p.numeroFactura ? `Nº ${p.numeroFactura} · ` : ""}Ingresó {formatFechaLarga(p.fechaIngreso)}
              </span>
              <span className="gy-proveedor-detalle">
                Vence {formatFechaLarga(p.fechaVencimiento)}
                {p.vencido && <span className="gy-lowstock-badge" style={{ marginLeft: 6 }}>Vencida</span>}
                {p.porVencer && <span className="gy-porvencer-badge" style={{ marginLeft: 6 }}>Por vencer</span>}
                {p.pagado && <span className="gy-pagado-badge" style={{ marginLeft: 6 }}>Pagada {formatFechaLarga(p.fechaPago)}</span>}
              </span>
              {p.pagado && p.formaPago && (
                <span className="gy-proveedor-detalle gy-proveedor-pago-detalle">
                  {React.createElement(paymentMeta(p.formaPago).icon, { size: 12 })}
                  {paymentMeta(p.formaPago).label}{p.referencia ? ` · Ref. ${p.referencia}` : ""}
                </span>
              )}
            </div>
            <div className="gy-proveedor-side">
              <span className="gy-proveedor-monto">{p.moneda === "BS" ? formatBs(p.monto) : formatUSD(p.monto)}</span>
              <div className="gy-proveedor-actions">
                {!p.pagado ? (
                  <button type="button" className="gy-btn-ghost-sm" onClick={() => abrirPagoModal(p.id)}>Marcar pagada</button>
                ) : (
                  <button type="button" className="gy-btn-ghost-sm" onClick={() => handleMarcarPendiente(p.id)}>Reabrir</button>
                )}
                <button type="button" className="gy-icon-btn" onClick={() => startEdit(p)} title="Editar"><Pencil size={14} /></button>
                <button type="button" className="gy-icon-btn-danger" onClick={() => handleEliminar(p.id)} title="Eliminar"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagandoId && (
        <div className="gy-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) cerrarPagoModal(); }}>
          <div className="gy-modal gy-modal-pago-proveedor">
            <div className="gy-lock-icon"><Check size={20} /></div>
            <h3>Registrar pago al proveedor</h3>
            <p>Indica cómo se pagó, para llevar un respaldo digital de esta cuenta.</p>

            <div className="gy-payment-grid">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    type="button"
                    key={m.id}
                    className={`gy-payment-btn ${metodoPago === m.id ? "active" : ""}`}
                    onClick={() => { setMetodoPago(m.id); setErrorPago(""); }}
                  >
                    <Icon size={16} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {metodoPago && (
              <div className="gy-field" style={{ marginTop: 10, marginBottom: 0 }}>
                <label>
                  Número de referencia{metodoPago === "pago_movil" ? "" : " (opcional)"}
                </label>
                <input
                  type="text" inputMode="numeric" className="gy-input"
                  placeholder="Ej: 004521 o número de confirmación" value={referenciaPago}
                  onChange={(e) => { setReferenciaPago(e.target.value); setErrorPago(""); }}
                  autoFocus
                />
              </div>
            )}
            {errorPago && <p className="gy-error-text">{errorPago}</p>}

            <div className="gy-modal-actions" style={{ marginTop: 14 }}>
              <button type="button" className="gy-btn-ghost" onClick={cerrarPagoModal}><X size={15} /> Cancelar</button>
              <button type="button" className="gy-btn-primary" onClick={confirmarPago}><Check size={15} /> Confirmar pago</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Tab: Menú (editor del menú público + exportación a PDF)             */
/* ------------------------------------------------------------------ */

function MenuTab({ menu, persistMenu, config, showToast, displayCurrency }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});
  const [addingToSectionId, setAddingToSectionId] = useState(null);
  const [draftNewItem, setDraftNewItem] = useState({ nombre: "", descripcion: "", precioUSD: "", promo: false, promoLabel: "" });
  const [addingSection, setAddingSection] = useState(false);
  const [nuevaSeccionNombre, setNuevaSeccionNombre] = useState("");
  const [descargando, setDescargando] = useState(false);

  async function handleAddSection() {
    const nombre = nuevaSeccionNombre.trim();
    if (!nombre) return;
    await persistMenu({ secciones: [...menu.secciones, { id: uid("sec"), nombre, items: [] }] });
    setNuevaSeccionNombre("");
    setAddingSection(false);
  }
  async function handleDeleteSection(sectionId) {
    await persistMenu({ secciones: menu.secciones.filter((s) => s.id !== sectionId) });
  }

  function startEditItem(item) {
    setEditingItemId(item.id);
    setDraftItem({ nombre: item.nombre, descripcion: item.descripcion || "", precioUSD: String(item.precioUSD), promo: !!item.promo, promoLabel: item.promoLabel || "" });
  }
  async function saveEditItem(sectionId, itemId) {
    const next = {
      secciones: menu.secciones.map((s) => s.id !== sectionId ? s : {
        ...s,
        items: s.items.map((i) => i.id !== itemId ? i : {
          ...i, nombre: draftItem.nombre.trim() || i.nombre, descripcion: draftItem.descripcion.trim(),
          precioUSD: Number(draftItem.precioUSD) || 0, promo: draftItem.promo, promoLabel: draftItem.promoLabel.trim(),
        }),
      }),
    };
    await persistMenu(next);
    setEditingItemId(null);
  }
  async function deleteItem(sectionId, itemId) {
    const next = { secciones: menu.secciones.map((s) => s.id !== sectionId ? s : { ...s, items: s.items.filter((i) => i.id !== itemId) }) };
    await persistMenu(next);
  }
  async function addItem(sectionId) {
    if (!draftNewItem.nombre.trim() || draftNewItem.precioUSD === "") return;
    const nuevo = {
      id: uid("mi"), nombre: draftNewItem.nombre.trim(), descripcion: draftNewItem.descripcion.trim(),
      precioUSD: Number(draftNewItem.precioUSD) || 0, promo: draftNewItem.promo, promoLabel: draftNewItem.promoLabel.trim(),
    };
    const next = { secciones: menu.secciones.map((s) => s.id !== sectionId ? s : { ...s, items: [...s.items, nuevo] }) };
    await persistMenu(next);
    setDraftNewItem({ nombre: "", descripcion: "", precioUSD: "", promo: false, promoLabel: "" });
    setAddingToSectionId(null);
  }

  async function handleDescargarPDF() {
    setDescargando(true);
    try {
      const blob = await pdf(<MenuPDFDocument menu={menu} config={config} displayCurrency={displayCurrency} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `menu-${(config.nombreComercio || "menu").replace(/\s+/g, "-").toLowerCase()}-${todayISO()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("PDF del menú descargado.", "ok");
    } catch (e) {
      showToast("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div className="gy-stack">
      <div className="gy-productos-toolbar">
        <p className="gy-panel-help" style={{ margin: 0, flex: 1, minWidth: 220 }}>
          El PDF se descarga en una sola moneda: la que tengas elegida arriba con el botón
          <span className="gy-menu-currency-badge">{displayCurrency === "USD" ? " $ " : " Bs "}</span>
          del encabezado. Cambia esa moneda si quieres el otro PDF.
        </p>
        <button type="button" className="gy-btn-primary" onClick={handleDescargarPDF} disabled={descargando}>
          <FileDown size={16} /> {descargando ? "Generando…" : "Descargar PDF"}
        </button>
      </div>

      {menu.secciones.map((sec) => (
        <div className="gy-panel gy-menu-section" key={sec.id}>
          <div className="gy-menu-section-head">
            <h3 className="gy-category-title" style={{ margin: 0 }}>{sec.nombre}</h3>
            <button type="button" className="gy-icon-btn-danger" onClick={() => handleDeleteSection(sec.id)} title="Eliminar sección"><Trash2 size={14} /></button>
          </div>

          <div className="gy-menu-items">
            {sec.items.length === 0 && <p className="gy-empty-state">Esta sección todavía no tiene productos.</p>}
            {sec.items.map((item) => (
              <div className="gy-menu-item-row" key={item.id}>
                {editingItemId === item.id ? (
                  <div className="gy-menu-item-edit">
                    <input className="gy-input gy-input-sm" value={draftItem.nombre} onChange={(e) => setDraftItem((d) => ({ ...d, nombre: e.target.value }))} placeholder="Nombre" />
                    <input className="gy-input gy-input-sm" value={draftItem.descripcion} onChange={(e) => setDraftItem((d) => ({ ...d, descripcion: e.target.value }))} placeholder="Descripción (opcional)" />
                    <input className="gy-input gy-input-sm gy-input-price" type="number" step="0.01" value={draftItem.precioUSD} onChange={(e) => setDraftItem((d) => ({ ...d, precioUSD: e.target.value }))} placeholder="$" />
                    <label className="gy-promo-check"><input type="checkbox" checked={draftItem.promo} onChange={(e) => setDraftItem((d) => ({ ...d, promo: e.target.checked }))} /> Promo</label>
                    {draftItem.promo && <input className="gy-input gy-input-sm" value={draftItem.promoLabel} onChange={(e) => setDraftItem((d) => ({ ...d, promoLabel: e.target.value }))} placeholder="Etiqueta de promo" />}
                    <button type="button" className="gy-icon-btn-ok" onClick={() => saveEditItem(sec.id, item.id)}><Check size={14} /></button>
                    <button type="button" className="gy-icon-btn" onClick={() => setEditingItemId(null)}><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div className="gy-menu-item-info">
                      <span className="gy-menu-item-name">
                        {item.nombre} {item.promo && <span className="gy-promo-tag">{item.promoLabel || "Promo"}</span>}
                      </span>
                      {item.descripcion && <span className="gy-menu-item-desc">{item.descripcion}</span>}
                    </div>
                    <span className="gy-menu-item-price">
                      {displayCurrency === "USD" ? formatUSD(item.precioUSD) : formatBs(item.precioUSD * config.tasaCambio)}
                    </span>
                    <button type="button" className="gy-icon-btn" onClick={() => startEditItem(item)} title="Editar"><Pencil size={14} /></button>
                    <button type="button" className="gy-icon-btn-danger" onClick={() => deleteItem(sec.id, item.id)} title="Eliminar"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            ))}
          </div>

          {addingToSectionId === sec.id ? (
            <div className="gy-add-panel">
              <div className="gy-field"><label>Nombre</label><input className="gy-input" value={draftNewItem.nombre} onChange={(e) => setDraftNewItem((d) => ({ ...d, nombre: e.target.value }))} /></div>
              <div className="gy-field"><label>Descripción (opcional)</label><input className="gy-input" value={draftNewItem.descripcion} onChange={(e) => setDraftNewItem((d) => ({ ...d, descripcion: e.target.value }))} /></div>
              <div className="gy-field"><label>Precio $</label><input className="gy-input" type="number" step="0.01" value={draftNewItem.precioUSD} onChange={(e) => setDraftNewItem((d) => ({ ...d, precioUSD: e.target.value }))} /></div>
              <label className="gy-promo-check" style={{ gridColumn: "1 / -1" }}>
                <input type="checkbox" checked={draftNewItem.promo} onChange={(e) => setDraftNewItem((d) => ({ ...d, promo: e.target.checked }))} /> Es una promoción
              </label>
              {draftNewItem.promo && (
                <div className="gy-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Etiqueta de la promo</label>
                  <input className="gy-input" value={draftNewItem.promoLabel} onChange={(e) => setDraftNewItem((d) => ({ ...d, promoLabel: e.target.value }))} placeholder="Ej: Promo estudiantil" />
                </div>
              )}
              <div className="gy-add-actions">
                <button type="button" className="gy-btn-primary" onClick={() => addItem(sec.id)}><Check size={15} /> Agregar</button>
                <button type="button" className="gy-btn-ghost" onClick={() => setAddingToSectionId(null)}><X size={15} /> Cancelar</button>
              </div>
            </div>
          ) : (
            <button type="button" className="gy-btn-ghost" onClick={() => setAddingToSectionId(sec.id)}>
              <PackagePlus size={15} /> Agregar producto a {sec.nombre}
            </button>
          )}
        </div>
      ))}

      {addingSection ? (
        <div className="gy-add-panel gy-add-panel-mesa">
          <div className="gy-field" style={{ marginBottom: 0 }}>
            <label>Nombre de la nueva sección</label>
            <input className="gy-input" value={nuevaSeccionNombre} onChange={(e) => setNuevaSeccionNombre(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAddSection(); }} autoFocus />
          </div>
          <button type="button" className="gy-btn-primary" onClick={handleAddSection}><Check size={15} /> Crear</button>
        </div>
      ) : (
        <button type="button" className="gy-btn-ghost" onClick={() => setAddingSection(true)}><PackagePlus size={16} /> Nueva sección</button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Documento PDF del menú (usa el color y el logo de la marca)         */
/* ------------------------------------------------------------------ */

function buildPdfStyles(colorPrincipal) {
  return StyleSheet.create({
    page: { backgroundColor: "#F8F4F1", padding: 34, fontFamily: "Helvetica", color: "#2A2420" },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    title: { fontSize: 36, fontFamily: "Helvetica-Bold", color: colorPrincipal },
    logo: { width: 56, height: 56, borderRadius: 28 },
    hr: { borderBottomWidth: 2, borderBottomColor: colorPrincipal, marginTop: 8, marginBottom: 18 },
    columns: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
    column: { flex: 1, gap: 14 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E1DAC9", padding: 14 },
    sectionTitle: { fontSize: 12.5, fontFamily: "Helvetica-Bold", color: colorPrincipal, marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 },
    sectionLine: { borderBottomWidth: 1, borderBottomColor: "#E1DAC9", marginBottom: 9 },
    itemRow: { marginBottom: 8 },
    itemTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    itemName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#2A2420", flex: 1, paddingRight: 8 },
    itemPrice: { fontSize: 10, fontFamily: "Helvetica-Bold", color: colorPrincipal },
    itemDesc: { fontSize: 8, color: "#6F6659", marginTop: 1, lineHeight: 1.3 },
    promoBox: { backgroundColor: colorPrincipal, borderRadius: 10, padding: 10, marginBottom: 8 },
    promoLabel: { fontSize: 7.5, color: "#CFE0D3", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
    promoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    promoName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#FFFFFF", flex: 1, paddingRight: 8 },
    promoPrice: { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
    footer: { marginTop: 22, textAlign: "center" },
    footerTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", color: colorPrincipal, marginBottom: 2 },
    footerTag: { fontSize: 8.5, color: "#6F6659" },
    pageFoot: { position: "absolute", bottom: 18, left: 34, right: 34, textAlign: "center", fontSize: 7, color: "#A79C8A" },
  });
}

function formatPdfPrice(precioUSD, config, displayCurrency) {
  return displayCurrency === "BS"
    ? `${Math.round(precioUSD * config.tasaCambio).toLocaleString("es-VE")} Bs`
    : `$${precioUSD.toFixed(2)}`;
}

function PdfMenuItem({ item, styles, config, displayCurrency }) {
  if (item.promo) {
    return (
      <View style={styles.promoBox}>
        <Text style={styles.promoLabel}>{item.promoLabel || "Promoción"}</Text>
        <View style={styles.promoRow}>
          <Text style={styles.promoName}>{item.nombre}</Text>
          <Text style={styles.promoPrice}>{formatPdfPrice(item.precioUSD, config, displayCurrency)}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemTopRow}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemPrice}>{formatPdfPrice(item.precioUSD, config, displayCurrency)}</Text>
      </View>
      {item.descripcion ? <Text style={styles.itemDesc}>{item.descripcion}</Text> : null}
    </View>
  );
}

function MenuPDFDocument({ menu, config, displayCurrency }) {
  const styles = buildPdfStyles(config.colorPrincipal || "#0B4F30");
  const secciones = menu.secciones || [];
  const pares = [];
  for (let i = 0; i < secciones.length; i += 2) pares.push([secciones[i], secciones[i + 1]]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>MENÚ</Text>
          {config.logoTipo === "imagen" && config.logoImagen ? (
            <PDFImage src={config.logoImagen} style={styles.logo} />
          ) : null}
        </View>
        <View style={styles.hr} />

        {pares.map(([izq, der], idx) => (
          <View style={styles.columns} key={idx}>
            <View style={styles.column}>
              {izq && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{izq.nombre}</Text>
                  <View style={styles.sectionLine} />
                  {izq.items.map((item) => <PdfMenuItem key={item.id} item={item} styles={styles} config={config} displayCurrency={displayCurrency} />)}
                </View>
              )}
            </View>
            <View style={styles.column}>
              {der && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>{der.nombre}</Text>
                  <View style={styles.sectionLine} />
                  {der.items.map((item) => <PdfMenuItem key={item.id} item={item} styles={styles} config={config} displayCurrency={displayCurrency} />)}
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>¡Buen provecho!</Text>
          <Text style={styles.footerTag}>{config.nombreComercio} · {config.tagline}</Text>
        </View>

        <Text style={styles.pageFoot} fixed>
          Precios en {displayCurrency === "BS" ? "bolívares" : "dólares"} · Sujetos a cambio según la tasa vigente · {config.nombreComercio}
        </Text>
      </Page>
    </Document>
  );
}


/* ------------------------------------------------------------------ */
/*  Tab: Configuración (protegida con clave de administrador)           */
/* ------------------------------------------------------------------ */

function ConfiguracionTab({ config, persistConfig, resetAll, showToast }) {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  function handleUnlock(e) {
    e.preventDefault();
    if (passwordInput === config.claveAdmin) {
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
        <p>Ingresa la clave de administrador para editar la tasa de cambio, la marca o restablecer datos.</p>
        <form onSubmit={handleUnlock} className="gy-lock-form">
          <input
            type="password"
            className="gy-input"
            placeholder="Clave de administrador"
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
      showToast={showToast}
    />
  );
}

function ConfiguracionContenido({ config, persistConfig, resetAll, showToast }) {
  const [tasaInput, setTasaInput] = useState(String(config.tasaCambio));
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSaveTasa() {
    const n = Number(tasaInput);
    if (!n || n <= 0) return;
    await persistConfig({ ...config, tasaCambio: n });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="gy-stack gy-config-stack">
      <IdentidadNegocio config={config} persistConfig={persistConfig} showToast={showToast} />

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
          <button type="button" className="gy-btn-primary" onClick={handleSaveTasa}>
            <Check size={15} /> {saved ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>

      <CambioClaves config={config} persistConfig={persistConfig} showToast={showToast} />

      <div className="gy-panel gy-danger-zone">
        <h3 className="gy-panel-title"><AlertTriangle size={16} /> Restablecer datos</h3>
        <p className="gy-panel-help">
          Esto borra todas las ventas, mesas abiertas, y regresa productos (con su inventario), tasa y marca a los valores iniciales. No se puede deshacer.
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
/*  Identidad del negocio: nombre, color de marca, logo                 */
/* ------------------------------------------------------------------ */

function IdentidadNegocio({ config, persistConfig, showToast }) {
  const [nombre, setNombre] = useState(config.nombreComercio);
  const [color, setColor] = useState(config.colorPrincipal);
  const [logoTipo, setLogoTipo] = useState(config.logoTipo);
  const [logoIcono, setLogoIcono] = useState(config.logoIcono);
  const [logoImagen, setLogoImagen] = useState(config.logoImagen);
  const [subiendo, setSubiendo] = useState(false);
  const fileRef = useRef(null);

  async function handleSubirImagen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const dataUrl = await resizeImageToDataURL(file);
      setLogoImagen(dataUrl);
      setLogoTipo("imagen");
    } catch (err) {
      showToast("No se pudo procesar la imagen. Intenta con otra.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  async function handleGuardar() {
    await persistConfig({
      ...config,
      nombreComercio: nombre.trim() || config.nombreComercio,
      colorPrincipal: color,
      logoTipo,
      logoIcono,
      logoImagen,
    });
    showToast("Identidad del negocio actualizada.", "ok");
  }

  return (
    <div className="gy-panel">
      <h3 className="gy-panel-title"><ImagePlus size={16} /> Identidad del negocio</h3>
      <p className="gy-panel-help">Personaliza el nombre, el color del banner y el logo que se ven en toda la app.</p>

      <div className="gy-field">
        <label>Nombre del comercio</label>
        <input className="gy-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div className="gy-field">
        <label>Color principal (banner y botones)</label>
        <div className="gy-color-row">
          <input type="color" className="gy-color-input" value={color} onChange={(e) => setColor(e.target.value)} />
          <span className="gy-color-value">{color}</span>
        </div>
      </div>

      <div className="gy-field">
        <label>Logo</label>
        <div className="gy-logo-tipo-toggle">
          <button type="button" className={logoTipo === "icono" ? "active" : ""} onClick={() => setLogoTipo("icono")}>Ícono</button>
          <button type="button" className={logoTipo === "imagen" ? "active" : ""} onClick={() => setLogoTipo("imagen")}>Imagen propia</button>
        </div>

        {logoTipo === "icono" ? (
          <div className="gy-icon-grid">
            {ICON_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  type="button"
                  key={opt.id}
                  className={`gy-icon-option ${logoIcono === opt.id ? "active" : ""}`}
                  onClick={() => setLogoIcono(opt.id)}
                  title={opt.id}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="gy-logo-upload">
            {logoImagen && <img src={logoImagen} alt="Logo" className="gy-logo-preview" />}
            <button type="button" className="gy-btn-ghost" onClick={() => fileRef.current?.click()} disabled={subiendo}>
              <ImagePlus size={15} /> {subiendo ? "Procesando…" : "Subir imagen"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSubirImagen} />
          </div>
        )}
      </div>

      <button type="button" className="gy-btn-primary" onClick={handleGuardar}><Check size={15} /> Guardar identidad</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cambio de claves (administrador y operador)                         */
/* ------------------------------------------------------------------ */

function CambioClaves({ config, persistConfig, showToast }) {
  const [adminNueva, setAdminNueva] = useState("");
  const [adminRepetir, setAdminRepetir] = useState("");
  const [operadorNueva, setOperadorNueva] = useState("");
  const [operadorRepetir, setOperadorRepetir] = useState("");

  async function handleGuardarAdmin() {
    if (!adminNueva || adminNueva !== adminRepetir) {
      showToast("Las claves de administrador no coinciden.");
      return;
    }
    await persistConfig({ ...config, claveAdmin: adminNueva });
    setAdminNueva(""); setAdminRepetir("");
    showToast("Clave de administrador actualizada.", "ok");
  }

  async function handleGuardarOperador() {
    if (!operadorNueva || operadorNueva !== operadorRepetir) {
      showToast("Las claves de operador no coinciden.");
      return;
    }
    await persistConfig({ ...config, claveOperador: operadorNueva });
    setOperadorNueva(""); setOperadorRepetir("");
    showToast("Clave de operador actualizada.", "ok");
  }

  return (
    <div className="gy-panel">
      <h3 className="gy-panel-title"><KeyRound size={16} /> Cambiar claves</h3>
      <p className="gy-panel-help">
        La clave de <b>administrador</b> abre la caja al iniciar y protege esta pantalla de Configuración.
        La clave de <b>operador</b> (4 dígitos) se pide para cambios de precio, anular tiques y editar mesas o días anteriores.
      </p>

      <h4 className="gy-subheading">Clave de administrador</h4>
      <div className="gy-password-row">
        <input type="password" className="gy-input" placeholder="Nueva clave" value={adminNueva} onChange={(e) => setAdminNueva(e.target.value)} />
        <input type="password" className="gy-input" placeholder="Repetir clave" value={adminRepetir} onChange={(e) => setAdminRepetir(e.target.value)} />
        <button type="button" className="gy-btn-primary" onClick={handleGuardarAdmin}><Check size={15} /> Guardar</button>
      </div>

      <h4 className="gy-subheading">Clave de operador (4 dígitos)</h4>
      <div className="gy-password-row">
        <input type="password" inputMode="numeric" maxLength={4} className="gy-input" placeholder="Nueva clave" value={operadorNueva} onChange={(e) => setOperadorNueva(e.target.value.replace(/\D/g, ""))} />
        <input type="password" inputMode="numeric" maxLength={4} className="gy-input" placeholder="Repetir clave" value={operadorRepetir} onChange={(e) => setOperadorRepetir(e.target.value.replace(/\D/g, ""))} />
        <button type="button" className="gy-btn-primary" onClick={handleGuardarOperador}><Check size={15} /> Guardar</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Control de Inventario (dentro de Configuración)                     */
/* ------------------------------------------------------------------ */


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

      /* ---------- Apertura de caja ---------- */
      .gy-apertura-wrap {
        min-height: 480px; display: flex; align-items: center; justify-content: center; padding: 30px;
        background: var(--ink);
      }
      .gy-apertura-card {
        max-width: 380px; width: 100%; text-align: center; background: var(--paper);
        border-radius: 18px; padding: 32px 26px; display: flex; flex-direction: column; align-items: center; gap: 6px;
      }
      .gy-apertura-card h1 { font-family: 'Fraunces', serif; font-size: 20px; margin: 6px 0 0; color: var(--ink); }
      .gy-apertura-card h3 { font-family: 'Fraunces', serif; font-size: 15px; margin: 2px 0 0; color: var(--muted); font-weight: 500; }
      .gy-apertura-card p { font-size: 12.5px; color: var(--muted); margin: 6px 0 10px; }

      /* ---------- Header ---------- */
      .gy-header {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px; padding: 18px 22px; background: var(--ink); color: var(--cream); flex-wrap: wrap;
      }
      .gy-brand { display: flex; align-items: center; gap: 10px; }
      .gy-brand-icon {
        width: 38px; height: 38px; border-radius: 10px; background: var(--caramel);
        display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
        overflow: hidden;
      }
      .gy-brand-icon img { width: 100%; height: 100%; object-fit: cover; }
      .gy-brand h1 { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; margin: 0; line-height: 1.1; }
      .gy-brand p { font-size: 12px; margin: 2px 0 0; color: #CFE0D3; }
      .gy-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .gy-rate-pill {
        display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1);
        padding: 6px 10px; border-radius: 999px; font-size: 12px; font-family: 'IBM Plex Mono', monospace;
      }
      .gy-icon-toggle {
        display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;
        background: rgba(255,255,255,0.12); border: none; border-radius: 999px; color: var(--cream); cursor: pointer;
      }
      .gy-icon-toggle:hover { background: rgba(255,255,255,0.2); }
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
        position: relative;
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
      .gy-input-pin { text-align: center; letter-spacing: 8px; font-size: 20px; font-family: 'IBM Plex Mono', monospace; max-width: 140px; margin: 0 auto; }

      .gy-venta-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 22px; align-items: start; }
      @media (max-width: 720px) { .gy-venta-grid { grid-template-columns: 1fr; } }

      .gy-panel { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 18px; }
      .gy-panel-title { display: flex; align-items: center; gap: 7px; font-family: 'Fraunces', serif; font-size: 16px; margin: 0 0 6px; }
      .gy-panel-help { font-size: 12.5px; color: var(--muted); margin: 0 0 12px; line-height: 1.5; }
      .gy-subheading { font-size: 12.5px; font-weight: 700; color: var(--ink); margin: 14px 0 8px; }

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

      .gy-payment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(115px,1fr)); gap: 8px; align-items: start; }
      .gy-payment-cell { display: flex; flex-direction: column; gap: 6px; }
      .gy-payment-btn {
        width: 100%;
        display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 6px;
        border: 1px solid var(--line); background: var(--paper); border-radius: 10px; cursor: pointer;
        font-size: 12px; font-weight: 600; color: var(--muted); font-family: 'Inter', sans-serif;
      }
      .gy-payment-btn.active { background: var(--forest); border-color: var(--forest); color: white; }
      .gy-field-hint { text-transform: none; font-weight: 500; letter-spacing: normal; color: var(--muted); font-size: 11px; }
      .gy-payment-monto-cell {
        display: flex; align-items: center; gap: 4px; background: var(--paper); border: 1px solid var(--caramel);
        border-radius: 8px; padding: 5px 8px;
      }
      .gy-payment-monto-cell input {
        border: none; outline: none; background: transparent; width: 100%; min-width: 0; font-size: 12.5px;
        font-family: 'IBM Plex Mono', monospace; color: var(--ink);
      }
      .gy-payment-currency-tag { font-size: 10.5px; color: var(--muted); font-weight: 700; white-space: nowrap; }
      .gy-payment-ref-cell {
        border: 1px solid var(--line); border-radius: 8px; padding: 6px 8px; font-size: 11.5px;
        background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; outline: none; width: 100%;
      }
      .gy-payment-ref-cell:focus { border-color: var(--caramel); }

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
      .gy-back-btn { margin-bottom: 14px; }

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
      .gy-method-card-btn { border: 2px solid transparent; cursor: pointer; text-align: left; font-family: 'Inter', sans-serif; width: 100%; }
      .gy-method-card-btn:hover { border-color: var(--line); }
      .gy-method-card-btn.active { border-color: var(--caramel); background: #E8F0EA; }
      .gy-method-head { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--ink); }
      .gy-method-count { font-size: 11px; color: var(--muted); }
      .gy-method-amount { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--caramel-dark); font-weight: 600; }
      .gy-filtro-chip {
        display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
        background: #E8F0EA; color: var(--forest-dark); border: 1px solid #B9D4C1; border-radius: 9px;
        padding: 8px 12px; font-size: 12px; font-weight: 600;
      }
      .gy-filtro-chip button { display: flex; align-items: center; gap: 4px; border: none; background: transparent; color: var(--forest-dark); font-weight: 700; cursor: pointer; font-size: 12px; }

      .gy-enviar-mesa-form { display: flex; gap: 6px; margin-bottom: 10px; }
      .gy-enviar-mesa-form .gy-input { flex: 1; }

      .gy-historial-top { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; margin-bottom: 4px; }
      .gy-ranking-box { flex: 1; min-width: 260px; }
      .gy-ranking-title { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 6px; }
      .gy-ranking-strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
      .gy-ranking-chip {
        display: flex; align-items: center; gap: 6px; background: var(--paper); border: 1px solid var(--line);
        border-radius: 999px; padding: 6px 12px; white-space: nowrap; flex-shrink: 0;
      }
      .gy-ranking-pos {
        width: 18px; height: 18px; border-radius: 50%; background: var(--caramel); color: white;
        font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .gy-ranking-name { font-size: 12px; color: var(--ink); font-weight: 600; }
      .gy-ranking-qty { font-size: 11px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }

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
      .gy-add-panel-mesa { grid-template-columns: 2fr auto; align-items: end; }
      .gy-add-panel-proveedor { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 620px) { .gy-add-panel-proveedor { grid-template-columns: 1fr; } }
      .gy-monto-moneda-row { display: flex; gap: 6px; }
      .gy-monto-moneda-row input { flex: 1; }
      .gy-monto-moneda-row select { width: 70px; }

      .gy-proveedor-row {
        display: flex; align-items: center; gap: 12px; background: var(--paper); border: 1px solid var(--line);
        border-radius: 10px; padding: 11px 13px; flex-wrap: wrap;
      }
      .gy-proveedor-row.vencido { border-color: #E4B9AF; background: #FDF6F4; }
      .gy-proveedor-row.pagado { opacity: 0.6; }
      .gy-proveedor-main { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 220px; }
      .gy-proveedor-nombre { font-weight: 700; font-size: 13.5px; color: var(--ink); }
      .gy-proveedor-detalle { font-size: 11.5px; color: var(--muted); }
      .gy-proveedor-side { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
      .gy-proveedor-monto { font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 14px; color: var(--caramel-dark); }
      .gy-proveedor-actions { display: flex; align-items: center; gap: 4px; }
      .gy-porvencer-badge { background: #FDF3E0; color: #8A5A1E; font-size: 10.5px; font-weight: 700; padding: 3px 7px; border-radius: 999px; }
      .gy-pagado-badge { background: #E8F0EA; color: var(--forest-dark); font-size: 10.5px; font-weight: 700; padding: 3px 7px; border-radius: 999px; }
      .gy-proveedor-pago-detalle { display: flex; align-items: center; gap: 5px; color: var(--caramel-dark); font-weight: 600; }
      .gy-modal-pago-proveedor { max-width: 400px; }

      .gy-menu-section { margin-bottom: 4px; }
      .gy-menu-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
      .gy-menu-items { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
      .gy-menu-item-row { display: flex; align-items: center; gap: 10px; background: var(--parchment); border-radius: 9px; padding: 9px 11px; }
      .gy-menu-item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
      .gy-menu-item-name { font-size: 13px; font-weight: 600; color: var(--ink); }
      .gy-menu-item-desc { font-size: 11px; color: var(--muted); }
      .gy-menu-item-price { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--caramel-dark); font-weight: 600; white-space: nowrap; }
      .gy-menu-currency-badge { display: inline-block; background: var(--caramel); color: white; font-weight: 700; padding: 1px 7px; border-radius: 999px; font-size: 11px; }
      .gy-menu-item-edit { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; width: 100%; }
      .gy-promo-check { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }
      .gy-promo-tag { background: var(--caramel); color: white; font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 999px; margin-left: 6px; text-transform: uppercase; letter-spacing: 0.03em; }

      .gy-category-block { margin-top: 4px; }
      .gy-category-toggle {
        display: flex; align-items: center; gap: 4px; background: transparent; border: none; cursor: pointer;
        padding: 4px 0; width: 100%; text-align: left; color: var(--caramel-dark);
      }
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

      /* ---------- Modal genérico (clave de operador) ---------- */
      .gy-modal-overlay {
        position: fixed; inset: 0; background: rgba(11,79,48,0.35); display: flex; align-items: center;
        justify-content: center; z-index: 60; padding: 20px;
      }
      .gy-modal {
        background: var(--paper); border-radius: 16px; padding: 26px 24px; max-width: 340px; width: 100%;
        text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.25);
      }
      .gy-modal h3 { font-family: 'Fraunces', serif; font-size: 16px; margin: 4px 0 0; }
      .gy-modal p { font-size: 12.5px; color: var(--muted); margin: 0 0 10px; }
      .gy-modal-form { display: flex; flex-direction: column; gap: 14px; width: 100%; }
      .gy-modal-actions { display: flex; gap: 8px; width: 100%; }
      .gy-modal-actions button { flex: 1; }

      /* ---------- Submodo Pedidos: Venta directa / Mesas ---------- */
      .gy-submode-toggle { display: flex; gap: 6px; background: var(--parchment); padding: 4px; border-radius: 11px; width: fit-content; }
      .gy-submode-toggle button {
        position: relative;
        display: flex; align-items: center; gap: 6px; border: none; background: transparent; padding: 8px 14px;
        border-radius: 8px; font-size: 12.5px; font-weight: 700; color: var(--muted); cursor: pointer;
      }
      .gy-submode-toggle button.active { background: var(--paper); color: var(--ink); box-shadow: 0 1px 0 var(--line); }
      .gy-badge-count {
        position: absolute; top: -6px; right: -6px; background: var(--rust); color: white;
        font-size: 10px; font-weight: 700; min-width: 17px; height: 17px; border-radius: 999px;
        display: flex; align-items: center; justify-content: center; padding: 0 4px; line-height: 1;
      }

      /* ---------- Formas de pago combinadas ---------- */
      .gy-pago-empty { font-size: 12px; color: var(--muted); margin: 0 0 8px; }
      .gy-pago-lineas { display: flex; flex-direction: column; gap: 8px; }
      .gy-pago-linea { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; background: var(--parchment); border-radius: 9px; padding: 8px; }
      .gy-pago-metodo { flex: 1.2; min-width: 110px; }
      .gy-pago-monto-wrap { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 100px; }
      .gy-pago-monto { flex: 1; min-width: 70px; }
      .gy-pago-currency { font-size: 11.5px; color: var(--muted); font-weight: 700; white-space: nowrap; }
      .gy-pago-ref { flex: 1; min-width: 100px; }
      .gy-add-pago-btn { margin-top: 8px; width: fit-content; }
      .gy-pago-resumen {
        margin-top: 10px; padding: 9px 12px; border-radius: 9px; font-size: 12.5px; font-weight: 600;
        display: flex; align-items: center; gap: 6px;
      }
      .gy-pago-resumen.ok { background: #E8F0EA; color: var(--forest-dark); }
      .gy-pago-resumen.falta { background: #FBEAE6; color: var(--rust); }
      .gy-pago-resumen.vuelto { background: #FDF3E0; color: #8A5A1E; }
      .gy-ticket-pago-list { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }

      /* ---------- Mesas ---------- */
      .gy-mesas-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
      .gy-mesas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 10px; }
      .gy-mesa-card {
        display: flex; align-items: stretch; background: var(--paper); border: 1px solid var(--line);
        border-radius: 12px; overflow: hidden;
      }
      .gy-mesa-card-main {
        flex: 1; text-align: left; border: none; background: transparent; cursor: pointer; padding: 14px;
        display: flex; flex-direction: column; gap: 4px;
      }
      .gy-mesa-name { font-family: 'Fraunces', serif; font-size: 15px; color: var(--ink); }
      .gy-mesa-items { font-size: 11.5px; color: var(--muted); }
      .gy-mesa-total { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--caramel-dark); font-weight: 600; }

      /* ---------- Identidad del negocio ---------- */
      .gy-color-row { display: flex; align-items: center; gap: 10px; }
      .gy-color-input { width: 46px; height: 36px; border: 1px solid var(--line); border-radius: 8px; padding: 2px; cursor: pointer; background: var(--paper); }
      .gy-color-value { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--muted); }
      .gy-logo-tipo-toggle { display: flex; gap: 6px; margin-bottom: 10px; }
      .gy-logo-tipo-toggle button {
        border: 1px solid var(--line); background: var(--paper); padding: 7px 14px; border-radius: 999px;
        font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer;
      }
      .gy-logo-tipo-toggle button.active { background: var(--ink); border-color: var(--ink); color: white; }
      .gy-icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(44px,1fr)); gap: 8px; max-width: 380px; }
      .gy-icon-option {
        width: 44px; height: 44px; border-radius: 10px; border: 1px solid var(--line); background: var(--paper);
        display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted);
      }
      .gy-icon-option.active { background: var(--ink); border-color: var(--ink); color: white; }
      .gy-logo-upload { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
      .gy-logo-preview { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; border: 1px solid var(--line); }

      /* ---------- Cambio de claves ---------- */
      .gy-password-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin-bottom: 6px; }
      @media (max-width: 560px) { .gy-password-row { grid-template-columns: 1fr; } }

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
