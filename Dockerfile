FROM node:18

WORKDIR /app

# copiar solo package.json primero
COPY package.json ./

# instalar limpio
RUN npm install --production

# copiar resto
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]