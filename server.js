var http = require('http')
var url = require('url');

function start(route, handler)
{
	http.createServer
	(
		function(request, response)
		{
			var pathName = url.parse(request.url).pathname;
			console.log("request for " + pathName + " received");
			// var answer = route(pathName, handler);
			// response.writeHead(200, {"Content-Type":"text/plain"});
			// response.write(answer);
			// response.end();
			// var postData = "";
			// request.setEncoding("utf8");
			// request.addListener("data", function(chunk)
			// {
			// 	postData += chunk;
			// 	console.log("received" + chunk);
			// });
			// request.addListener("end", function(chunk)
			// {
			// 	route(pathName, handler, response, postData);
			// });	
			route(pathName, handler, response, request);	
		}
	).listen(8888);

	console.log('listen 8888');
}
exports.start = start;