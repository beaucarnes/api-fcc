'use strict';

var express = require('express');
var router = express.Router();
var path = require('path')
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost/database';

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/static/short.html'));
});

router.get('/:param*', function(req, res) {
  var urlparam = req.url.slice(1);
  
  var urlexpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  var urlregex = new RegExp(urlexpression);
  
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);

      var collection = db.collection('sites');
      
      if (urlparam.match(urlregex)) {
        
        
        getNextSequence(db, "siteid", function(err, result){
            var entry = {full: urlparam, short: result};
            if(!err){
                console.log(JSON.stringify(entry))
                collection.insert(entry, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Inserted site into database');
                  res.json({'original_url': urlparam, 'short_url': 'https://apibc.herokuapp.com/' + entry.short});
                }
                
                db.close();
        
              });
            }
        });
        
      } else {
        if (/^\d+$/.test(urlparam)) {  // test if param is only digits
        
        console.log(urlparam)
          collection.find({short: Number(urlparam)}).toArray(function (err, result) {
            if (err) {
              console.log(err);
            } else if (result.length) {
              console.log('Found:', result[0].full);
              res.redirect(result[0].full);
            } else {
              res.send('Error: URL not in database!');
            }
            
            
            //Close connection
            db.close();
          });
        
      
        } else {
          res.send('Not a valid parameter: ' + urlparam)
        }
      }

    }
  
  function getNextSequence(db, name, callback) {
    db.collection("counters").findAndModify( { _id: name }, null, { $inc: { seq: 1 } }, function(err, result){
        if(err) callback(err, result);
        callback(err, result.value.seq);
    } );
  } 
  });
});


module.exports = router;