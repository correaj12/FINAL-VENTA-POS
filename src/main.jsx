// Importante: esto debe ejecutarse antes de montar <App/>, porque define
// window.storage usando Supabase antes de que la app intente leer datos.
import "./supabaseStorage.js";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
