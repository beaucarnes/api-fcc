'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  console.log("getting whoami");
  var ip =       req.headers['x-forwarded-for']
  var language = req.headers["accept-language"].split(',')[0];
  var software = req.headers['user-agent'].match(/\(([^)]+)\)/)[1];
  var data = {
    "ipaddress" : ip,
    "language" : language,
    "software" : software
  }
  res.json(data);
})

module.exports = router;