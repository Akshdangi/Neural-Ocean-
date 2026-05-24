import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [react(), cesium()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  server: {
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
