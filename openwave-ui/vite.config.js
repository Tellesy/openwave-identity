import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5174,
    strictPort: false,
    proxy: {
      '/v1': {
        target: 'http://localhost:8095',
        changeOrigin: true
      }
    }
  }
});
