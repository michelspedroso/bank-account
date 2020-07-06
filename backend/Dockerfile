FROM node:12.16-slim

RUN apt update

WORKDIR /srv/www/api.bankaccount.com

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npm run start:prod
