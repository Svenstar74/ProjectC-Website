import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "sven-firmbach",
    project: "nlp-graph"
  })],
  base: './',
  build: {
    outDir: 'build',
    sourcemap: true
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
});