FROM geekykaran/headless-chrome-node-docker:latest
WORKDIR /app
COPY . /app
EXPOSE 8080
RUN npm i
CMD node /app/index.js
