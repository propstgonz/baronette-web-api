FROM node:lts-bullseye

# Instalar doveadm (dovecot-core)
RUN apt-get update && \
    apt-get install -y dovecot-core && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY ./src ./src

EXPOSE 3000

CMD ["node", "src/app.js"]
