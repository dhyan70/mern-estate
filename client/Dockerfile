
FROM node:16 AS PRODUCTION


WORKDIR /usr/src/api

COPY package*.json ./

RUN  npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm" , "run" , "dev"]
