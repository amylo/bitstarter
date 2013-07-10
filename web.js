var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

var fileToString = function(filename) {
  var getFile = fs.readFileSync(filename);
  var buffer = new Buffer(getFile);
  return buffer.toString();
};

app.get('/', function(request, response) {
  response.send(fileToString('index.html'));
});

app.get('/basic.css', function(request, response) {
  response.setHeader('Content-Type', 'text/css');	
  response.send(fileToString('basic.css'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
