function route(pathName, handler, response, request) {
	console.log('About to route a request for ' + pathName)
	if(typeof handler[pathName] == "function")
	{
		return handler[pathName](response, request);
	}else
	{
		console.log("No request handler for " + pathName);
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("404 Not found");
	    response.end();
	}
};

exports.route = route;