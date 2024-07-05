FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci --force

RUN npm run build

CMD [ "node", "dist/main.js" ]