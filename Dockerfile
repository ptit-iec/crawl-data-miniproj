# Sử dụng Node.js base image
FROM node:18-alpine

# Tạo thư mục app
WORKDIR /app

# Copy file package và cài dependencies
COPY package*.json ./
RUN yarn

# Copy toàn bộ source code vào container
COPY . .

# Build ứng dụng Next.js
RUN yarn run build

# Expose cổng Next.js chạy
EXPOSE 3000

# Chạy server Next.js
CMD ["yarn", "start"]
