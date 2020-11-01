FROM node:12-alpine as builder
WORKDIR /app
COPY package.json /app/package.json
RUN npm install --only=prod
COPY . /app

EXPOSE 3000 
USER node
CMD ["node", "./bin/www"]