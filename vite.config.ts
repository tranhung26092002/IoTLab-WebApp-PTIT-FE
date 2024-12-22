import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    cors: {
      origin: 'http://14.225.255.177:5173', // Chỉ cho phép từ frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    proxy: {
      '/mqtt/ws': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        ws: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://14.225.255.177:5173'); // Địa chỉ frontend cụ thể
          });
        },
      },
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
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
