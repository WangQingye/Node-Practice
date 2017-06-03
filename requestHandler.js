var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
function start(response) {
	console.log("requeset for start was called");
	// function sleep(mileSeconds)
	// {
	// 	let startTime = new Date().getTime();
	// 	while (new Date().getTime() < startTime + mileSeconds);
	// }
	// sleep(10000);
	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post" enctype="multipart/form-data">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("request for upload was called");
// 	response.writeHead(200, {"Content-Type": "text/plain; charset=utf8"});
	// response.write(querystring.parse(postData).text);
	// response.end();
  var form = new formidable.IncomingForm();
  console.log("upload about to parse");
  //console.dir(request);
  // fs.rename(files.file.path, "/temp/test.png", function(error)
  //   {
  //     response.writeHead(200, {"Content-Type": "text/html"});
  //     response.write("<img src='/show' /");
  //     response.end();
  //   });
  form.parse(request, function(error, fields, files)
  {
    // console.log("parseing done");
    // fs.renameSync(files.upload.path, "/temp/test.png");
    // response.writeHead(200, {"Content-Type": "text/html"});
    // response.write("<img src='/show' /");
    // response.end();

    fs.rename(files.file.path, "/temp/test.png", function(error)
    {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("<img src='/show' /");
      response.end();
    });
  })
}

function show(response, request) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/temp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

　


var handler = {
	"/" : start,
	"/start" : start,
	"/upload" : upload,
  "/show" : show
};

exports.handler = handler;