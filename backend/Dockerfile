FROM node:22-slim

WORKDIR /app
RUN apt-get update && apt-get install -y openssl
ENV PRISMA_CLIENT_ENGINE_TYPE=library
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 4000

EXPOSE 4000

COPY start.sh ./start.sh
RUN chmod +x start.sh

CMD ["./start.sh"]
