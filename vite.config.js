import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Two builds:
//   npm run build       -> the normal SPA (GitHub Pages root), talks to the API
//   npm run build:demo  -> the static demo (GitHub Pages /demo/), backend in-tab
export default defineConfig(({ mode }) => {
  const demo = mode === 'demo';
  const fallbackBase = demo
    ? '/P9-T4-SugubeteMaximilianMitrache/demo/'
    : '/P9-T4-SugubeteMaximilianMitrache/';

  return {
    base: process.env.VITE_BASE || fallbackBase,
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: demo
      ? {
          outDir: 'dist/demo',
          emptyOutDir: true,
          // PGlite ships a .wasm sidecar; keep it as a real file.
          assetsInlineLimit: 0,
        }
      : undefined,
  };
});
