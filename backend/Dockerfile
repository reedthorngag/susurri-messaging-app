FROM node:21-alpine as base

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

WORKDIR /app/react-app

COPY react-app/package.json /app/react-app
RUN npm install

WORKDIR /app

COPY . .

FROM base as production

ENV NODE_PATH ./build
