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

exports.userCheck = function(req, res){
  console.log("userCheck: " + req.session.user);
  res.status(200).send(req.session.user);
}

exports.setUserNull = function(req, res){
  //console.log("before" + req.session.userId );
  req.session.user = null;
  //console.log("now" + req.session.userId );
  console.log("Log out User");
  res.status(200).json(req.session.user);
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

}
