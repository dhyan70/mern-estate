
FROM  node:18 AS development


WORKDIR /usr/src/api

COPY package*.json ./

RUN  npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm" , "run" , "dev"]
