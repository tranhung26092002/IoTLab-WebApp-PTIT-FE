# Sử dụng image Node.js chính thức
FROM node:20

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 5173 (dùng cho Vite dev server)
EXPOSE 5173

# Chạy ứng dụng React/Vite ở chế độ development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
