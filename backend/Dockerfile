FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# ---

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=library

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/tsconfig*.json ./

RUN npm install
RUN npx prisma generate

COPY start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 4000

CMD ["./start.sh"]
