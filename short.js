var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost/database';

router.get('/:param', function(req, res) {

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('users');

    var user = {name: req.params.param, age: 22, roles: ['user']};


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
    collection.find({name: req.params.param}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        res.send('Found:' + JSON.stringify(result) + result[0].name);
      } else {
        res.send('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
    });

    
  }
});

});


module.exports = router;