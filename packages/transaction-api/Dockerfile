FROM node:14

ARG PORT

WORKDIR /opt/app

COPY package.json ./

COPY ./ ./

RUN yarn install

EXPOSE ${PORT}
