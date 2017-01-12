'use strict';

var express = require('express');
var router = express.Router();
var path = require('path')
var request = require("request")
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://localhost/database';

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/static/imgsearch.html'));
});

router.get('/:term', function(req, res) {
    
    var offset = req.query.offset ? "&start=" + req.query.offset : "";
    
    var searchurl = "https://www.googleapis.com/customsearch/v1?q=" + req.params.term + "&cx=005555065366311186583%3Axdwtxc2ztei&searchType=image" + offset + "&key=AIzaSyDvZm-Us7cxsmApaGwYfq0bGUxzNlxuLyQ"

    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', url);
  
        var collection = db.collection('imgsearch');
        var date_time = (new Date()).toISOString()
        var entry = {term: req.params.term, when: date_time}
        
        collection.insert(entry, function (err, result) {
          if (err) {
            console.log(err);
          } 
          db.close();
        });
      }
    });

    
    request({
        url: searchurl,
        json: true
    }, function (error, response, body) {
        
        var search = body.items;
        var formatted_search = [];
        for (var key in search) {
          if (search.hasOwnProperty(key)) {
            var element = {
                "url" : search[key].link,
                "snippet" : search[key].snippet,
                "thumbnail" : search[key].image.thumbnailLink,
                "context" : search[key].image.contextLink,
            }
            formatted_search.push(element);
          }
        }
        
        if (!error && response.statusCode === 200) {
            res.json(formatted_search) // Print the json response
        }
    })
    

});

module.exports = router;