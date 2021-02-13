FROM node:15-buster

WORKDIR /usr/src/dsc

RUN apt update
RUN apt install -y g++ build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY package*.json ./

COPY . .

RUN npm install

WORKDIR ./gui
RUN npm install
RUN ./node_modules/.bin/ng build --prod

EXPOSE 3001
CMD [ "node", "index.js" ]
