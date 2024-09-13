import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Specifica l'IP, '0.0.0.0' per accettare connessioni da qualsiasi IP
    port: 5173, // Specifica la porta desiderata
  },
})
