FROM node:8.1
RUN npm install -g yarn

RUN mkdir -p /app/logs
ADD .foreverignore /app
COPY node_modules /app
COPY dist /app
WORKDIR /app
CMD npm start

