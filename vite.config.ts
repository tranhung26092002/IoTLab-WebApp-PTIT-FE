import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { API_BASE_URL } from './src/config/env';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      '/mqtt/ws': {
        target: `http://192.168.1.4:8088`,
        changeOrigin: true,
        ws: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://192.168.1.4:5173'); // Địa chỉ frontend cụ thể
          });
        },
      },
      '/notification/ws': {
        target: `http://192.168.1.4:8088`,
        changeOrigin: true,
        ws: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://192.168.1.4:5173'); // Địa chỉ frontend cụ thể
          });
        },
      }
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['react-router-dom'], // Thêm dòng này để loại trừ react-router-dom khỏi tối ưu hóa
  },
});
