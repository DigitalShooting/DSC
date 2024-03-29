FROM node:15-buster

WORKDIR /usr/src/dsc

RUN apt update
RUN apt install -y g++ build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev texlive texlive-lang-german texlive-science

COPY . .

RUN npm install

WORKDIR /usr/src/dsc
EXPOSE 3000
CMD [ "node", "index.js" ]
