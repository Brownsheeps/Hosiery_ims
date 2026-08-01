FROM node:22-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
