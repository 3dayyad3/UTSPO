FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/db/toko.db

WORKDIR /app
RUN mkdir -p ./db

COPY package*.json ./
RUN npm i --omit dev

COPY lib ./lib/
COPY view ./view/
COPY main.js ./

RUN chown -R appuser:appgroup /app
USER appuser

CMD ["node" , "main.js"]
