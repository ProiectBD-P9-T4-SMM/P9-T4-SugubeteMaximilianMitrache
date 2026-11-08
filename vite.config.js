import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages serves the SPA from /P9-T4-SugubeteMaximilianMitrache/.
  // The containerised demo builds with VITE_BASE=/ instead.
  base: process.env.VITE_BASE || '/P9-T4-SugubeteMaximilianMitrache/',
  plugins: [
    react(),
    tailwindcss(),
  ],
});
