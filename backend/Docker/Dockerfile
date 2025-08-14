FROM node:22.7-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

EXPOSE 3000

CMD npm install && npm run start:dev