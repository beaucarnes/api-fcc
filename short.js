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
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);
        // Get the documents collection
    var collection = db.collection('sites');
    console.log(collection.count());
    if (urlparam.match(urlregex)) {
      var entry = {full: urlparam, short: collection.count() + 1};
      // insert into database
      collection.insert(entry, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted site into database');
          res.json({'original_url': urlparam, 'short_url': 'https://apibc.herokuapp.com/' + entry.short});
        }
        
        //Close connection
        db.close();

      });
      
      
    } else {
      if (/^\d+$/.test(urlparam)) {  // test if param is only digits
          res.send('numbers!');
      } else {
        res.send('does not match anyting' + urlparam)
      }
    }




    // Insert some users
    // collection.insert(user, function (err, result) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
    //   }
    //   //Close connection
    //   db.close();
    // });
    // collection.find({name: req.params.param}).toArray(function (err, result) {
    //   if (err) {
    //     console.log(err);
    //   } else if (result.length) {
    //     res.send('Found:' + JSON.stringify(result) + result[0].name);
    //   } else {
    //     res.send('No document(s) found with defined "find" criteria!');
    //   }
    //   //Close connection
    //   db.close();
    // });

    
  }
});

});


module.exports = router;