FROM node:22-alpine

WORKDIR /app

COPY package*.json  ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]