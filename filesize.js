'use strict';

var express = require('express');
var router = express.Router();
var path = require('path')
var request = require("request")
var multer = require('multer');
var file = multer();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/static/filesize.html'));
})
 .post('/', file.single('file'), function( req, res ) {
             res.json({"size": req.file.size});
 });

module.exports = router;