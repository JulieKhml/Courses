'use strict';

const mysql = require('mysql');
var async = require('async');
var fs = require('fs');

var user = {};
exports.setSessionUserId = function( req, res ){
  console.log("setSessionUserId" + user);
  res.json(user);
}

exports.setSessionUser = function(req, res){
  user = req.body;
  console.log("User: " + user);
  res.status(200).send(req.body);
}

exports.userCheck = function(req, res){
  console.log("userCheck: " + user);
  res.status(200).send(user);
}

exports.setUserNull = function(req, res){
  console.log("Log out User");
  user = req.body;
  res.status(200).json(user);
}

exports.uploadImage = function(req, res){
  console.log("Download image");
  //console.log("11 " + JSON.stringify(req.body));

  var folderName = "user-1";
  var fileName = req.body.name;
  var data = req.body.src.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');

  fs.mkdir("./back-end/storage/avatars/" + folderName,  (error) => { /* handle error */ });
  fs.writeFile("./back-end/storage/avatars/" + folderName + "/" + fileName, buf, 'binary', function(err){
      if(err)throw err;
      console.log('File saved.')
    });
  res.json(req.body);
}
