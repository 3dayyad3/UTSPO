FROM node:20-alpine

# 1. Buat user non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Set Environment Variable
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/db/toko.db

WORKDIR /app

# 3. Copy package.json dan install (Ubah ci jadi install)
COPY package*.json ./
RUN npm install --only=production

# 4. Copy sisa file proyek
COPY . .

# 5. Ubah ownership dan gunakan user non-root
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
CMD ["node", "main.js"]