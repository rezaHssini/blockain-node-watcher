FROM node:14.17.0-alpine

COPY . /app
WORKDIR /app
RUN npm install && git submodule update --init --recursive && npm run build

CMD [ "node", "dist/main.js" ]
