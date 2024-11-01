FROM node:22-alpine

WORKDIR /app

COPY package*.json  ./

RUN yarn install

COPY . .

RUN yarn build

RUN yarn global add serve

ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]