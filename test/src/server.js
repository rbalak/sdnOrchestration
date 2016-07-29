var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.type('text/plain'); // set content-type
  res.send('Hello Afsal, A demo for you!'); // send text response
});

app.listen(6000);
