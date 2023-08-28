FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm install -f

COPY . .

EXPOSE 3003

CMD ["npm", "run", "dev"]