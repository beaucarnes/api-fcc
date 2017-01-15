var express = require("express")
var app = express()

var short = require('./short');
var imgsearch = require('./imgsearch');
var latest = require('./latest');
var index = require('./index');
var whoami = require('./whoami');

app.set('port', (process.env.PORT || 5000));

app.use('/', index);
app.use('/whoami', whoami);
app.use('/s', short);
app.use('/imgsearch', imgsearch);
app.use('/latest/imgsearch', latest);

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'))
})