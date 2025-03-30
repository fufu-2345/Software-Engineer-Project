FROM node:18-alpine

WORKDIR /app

COPY . . 

COPY .env /app/.env

RUN npm install
EXPOSE 5000

CMD ["npm", "run", "dev"]