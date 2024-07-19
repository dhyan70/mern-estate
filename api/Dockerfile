
FROM node:16 AS PRODUCTION

ENV NODE_ENV=production

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run" , "start"]
