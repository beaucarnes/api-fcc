var express = require("express")
var app = express()
app.set('port', (process.env.PORT || 5000));



app.get('/whoami', function (req, res) {
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