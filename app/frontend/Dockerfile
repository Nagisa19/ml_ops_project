FROM node:22-alpine

WORKDIR /frontend

COPY package*.json ./   
RUN npm install

COPY . .

RUN npm run build

CMD ["npx", "serve", "-s", "build"]
