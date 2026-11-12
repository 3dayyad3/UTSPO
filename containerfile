FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/db/toko.db

WORKDIR /app
RUN mkdir -p /app/db

COPY package*.json ./
RUN npm i --omit dev

COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["node" , "main.js"]
