import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/P9-T4-SugubeteMaximilianMitrache/',
  plugins: [
    react(),
    tailwindcss(),
  ],
});
