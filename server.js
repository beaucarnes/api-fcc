var express = require("express")
var app = express()


var short = require('./short');
var imgsearch = require('./imgsearch');
var latest = require('./latest')

app.set('port', (process.env.PORT || 5000));


app.use('/s', short);
app.use('/imgsearch', imgsearch);
app.use('/latest/imgsearch', latest);

app.get('/whoami', function (req, res) {
  console.log("getting whoami")
  var ip =       req.headers['x-forwarded-for']
  var language = req.headers["accept-language"].split(',')[0];
  var software = req.headers['user-agent'].match(/\(([^)]+)\)/)[1]
  var data = {
    "ipaddress" : ip,
    "language" : language,
    "software" : software
  }
  res.json(data)
})



app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'))
})