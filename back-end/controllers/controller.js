'use strict';

const mysql = require('mysql');
var async = require('async');
var fs = require('fs');

var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pets'
});

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

exports.getUser = function (req, res) {
  /*connection.getConnection(function(error, tempcount){
    if(error){
      tempCont.release();
      console.log("Error");
    }else {
      console.log("Connected");
      tempCont.query("SELECT * FROM Users", function functionName(error, rows, fields){
        tempCont.release();
        if(error) {
          console.log("Error");
          res.json(error);
        } else {
          res.json(rows);
        }
      });
    }
  });
*/
  var pg = require('pg');
  pg.connect();
  pg.connect(,
   function(err, client, done){
    client.query("SELECT * FROM public.'Users' ;", (err, res1) => {
      done();
      if (err) res.send("error: " + err);
      var obj = res1.rows;
      console.log(obj);
      res.json(obj);
    });
  });
}
