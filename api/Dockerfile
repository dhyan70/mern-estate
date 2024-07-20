FROM node:16 AS base
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm install

FROM base AS development
COPY . .
CMD ["npm" ,"run" ,"dev"]

FROM base AS production
COPY . .
RUN npm prune --production
CMD ["npm" ,"run" ,"start"]