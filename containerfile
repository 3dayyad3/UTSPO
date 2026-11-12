FROM node:20-alpine

# 1. Buat user non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Set Environment Variable
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/db/toko.db

WORKDIR /app
RUN mkdir -p /app/db

# 3. Copy package.json dan install (Ubah ci jadi install)
COPY package*.json ./
RUN npm i --omit dev

# 4. Copy sisa file proyek
COPY . .

# 5. Ubah ownership dan gunakan user non-root
RUN chown -R appuser:appgroup /app
USER appuser

# EXPOSE port 3000 to host
EXPOSE 3000

CMD ["node" , "main.js"]
