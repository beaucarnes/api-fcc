'use strict';

var express = require('express');
var router = express.Router();
var path = require('path')
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://localhost/database';

router.get('/', function(req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
    
      var collection = db.collection('imgsearch');
      var history = [];
      
      collection.find().sort( { when: -1 } ).limit(10).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
       console.log(JSON.stringify(result));
          for (var key in result) {
            var element = {
                "term" : result[key].term,
                "when" : result[key].when
            }
            history.push(element);
          }
          res.json(history)
        } else {
          res.send('Error: No search history in database!');
        }
        
        
        //Close connection
        db.close();
      });
    };
  });
});

module.exports = router;