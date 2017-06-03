var server = require("./server.js");
var route = require("./route.js");
var requstHandler = require("./requestHandler.js")

server.start(route.route, requstHandler.handler);