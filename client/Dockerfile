FROM node:18-alpine

WORKDIR /app

COPY . . 

RUN npm install
EXPOSE 3123

CMD ["npm", "run", "dev"]