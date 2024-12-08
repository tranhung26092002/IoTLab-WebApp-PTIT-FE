import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  plugins: [react()],
  server: {
    host: true, // Lắng nghe tất cả các địa chỉ
    port: 5173, // Cổng chạy ứng dụng
  },
})
