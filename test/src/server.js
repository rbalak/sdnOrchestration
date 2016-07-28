var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.type('text/plain'); // set content-type
  res.send('Response'); // send text response
});

app.listen(8080);
