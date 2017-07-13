FROM node:8.1

RUN mkdir -p /app/logs
ADD .foreverignore /app
COPY node_modules /app
COPY dist /app
WORKDIR /app
CMD npm start

