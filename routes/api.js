const express = require('express');
const router = express.Router();
const user = require('../models/user.js');

//get a list of users
router.get('/users', function(req, res,next){
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  user.find({}).then(function(users){
    res.send(users);
  });
});

//get user by id
router.get('/user/:username', function(req, res,next){
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  user.findOne({username: req.params.username}).then(function(user){
     res.send(user);
   }).catch(next);
});

//add new user to db
router.post('/user', function(req, res,next){
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  // Request Credentials
  res.setHeader('Access-Control-Allow-Credentials', true);

  //speichert alles in der db
  user.create(req.body).then(function(user){
    res.send(user);
  }).catch(next);
});



module.exports = router;
