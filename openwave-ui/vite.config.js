import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/v1': {
        target: 'http://localhost:8090',
        changeOrigin: true
      }
    }
  }
})
