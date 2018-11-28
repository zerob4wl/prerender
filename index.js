const server = require("./lib/server");
const Config = require("./config");

server.start(Config.PORT);
