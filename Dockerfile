FROM node:12.16-slim

RUN apt update && apt install git -y

WORKDIR /srv/www/api.bankaccount.com

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npm run start:prod
