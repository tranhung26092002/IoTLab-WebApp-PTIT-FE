import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4000,
    // proxy: {
    //   '/mqtt/ws': {
    //     target: `http://localhost:8080`,
    //     changeOrigin: true,
    //     ws: true,
    //     secure: false,
    //     // configure: (proxy) => {
    //     //   proxy.on('proxyReq', (proxyReq) => {
    //     //     proxyReq.setHeader('Origin', 'http://localhost:3000'); // Địa chỉ frontend cụ thể
    //     //   });
    //     // },
    //   },
    //   '/notification/ws': {
    //     target: `http://localhost:8080`,
    //     changeOrigin: true,
    //     ws: true,
    //     secure: false,
    //     // configure: (proxy) => {
    //     //   proxy.on('proxyReq', (proxyReq) => {
    //     //     proxyReq.setHeader('Origin', 'http://localhost:3000'); // Địa chỉ frontend cụ thể
    //     //   });
    //     // },
    //   }
    // },
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
