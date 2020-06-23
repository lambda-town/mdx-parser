FROM node:current-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json yarn.lock ./
RUN yarn

COPY src ./src

RUN yarn build

EXPOSE 4545
CMD [ "node", "dist/src/index.js" ]