FROM node:22-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN npm run build

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
