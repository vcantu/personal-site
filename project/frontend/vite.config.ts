import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Dashboard preview runs `vite build --watch` + `vite preview` rather than
// `vite dev`. A failed rebuild (agent writes App.tsx importing a page that
// doesn't exist yet) leaves dist/ untouched — last successful build keeps
// serving. Rollup's watcher only tracks files in the module graph, so the
// watch-src-tree plugin adds src/ as a directory watch: creating the missing
// file then triggers the recovery rebuild.
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'watch-src-tree',
      apply: 'build',
      buildStart() {
        this.addWatchFile(path.resolve(__dirname, 'src'));
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  preview: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
