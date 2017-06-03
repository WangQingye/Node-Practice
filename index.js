var server = require("./server.js");
var route = require("./route.js");
var requestHandler = require("./requestHandler.js")

server.start(route.route, requestHandler.handler);