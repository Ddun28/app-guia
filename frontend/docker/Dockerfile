FROM node:22.7

WORKDIR /app

# No USER node para evitar problemas de permisos con volúmenes en desarrollo

EXPOSE 3000

CMD sh -c '[ -d "node_modules" ] && npm run dev || (npm install --loglevel verbose --prefer-online && npm run dev)'