'use strict';

var stringConnection = "postgres://zuhykdgdsvzbpy:01244214c64d6248ebb1d71b1f7338fc4520050f951032bbed0cb61be17a33a9@ec2-54-247-72-30.eu-west-1.compute.amazonaws.com:5432/d4m6n0kln18m2f";

const mysql = require('mysql');
var async = require('async');
var fs = require('fs');
const { Client } = require('pg');

exports.userCheck = function(req, res){
  if(req.session.user == undefined){
    req.session.user = null;
    res.status(200).json(null);
  }else {
    res.status(200).json(req.session.user);
  }
}

exports.setUserNull = function(req, res){
  req.session.user = null;
  res.status(200).json(req.session.user);
}



exports.getProfile = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  client.connect();

  client.query("SELECT * FROM public.\"Users\" where id_user='" + req.session.user.userId + "';", (err, results) => {
    if (err) res.send(err);
    var obj = results.rows[0];
    fs.readFile("back-end/storage/avatars/" + results.rows[0].avatar, (err, data) => {
      if (err) throw err;
      obj.src = "data:image/jpeg;base64," + Buffer.from(data).toString('base64');
      obj.title = results.rows[0].avatar;
      client.end();
      res.json(obj);

    });
  });
}

/// HERER ERE RE RE RE RE RER E RE
exports.updateUser = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  var currentdate = new Date();
  var datetime = currentdate.getFullYear() + "-" +
                  (currentdate.getMonth() + 1) + "-" +
                  currentdate.getDate() + " " +
                  + currentdate.getHours() + ":"
                  + currentdate.getMinutes() + ":"
                  + currentdate.getSeconds();

  client.connect();

  var obj = {};
  console.log(req.body.title);
  if(req.body.src == '' || req.body.title == 'noname/nonename.jpg'){
    req.body.title = 'noname/nonename.jpg';
  }else {
    req.body.title = req.session.user.username + "/" + req.session.user.firstName + ".jpg" ;
  }

  client.query("UPDATE public.\"Users\" set email='" + req.body.email + "', first_name='" + req.body.firstName + "', last_name='" + req.body.lastName + "', address='" + req.body.address + "', updated_at='" + datetime + "', avatar='" + req.body.title + "' WHERE id_user='" + req.session.user.userId + "';",
   (err, results) => {
    if (err) res.send(err);

    client.end();
    if(req.body.title != 'noname/nonename.jpg'){
      var folderName = req.session.user.username;
      var data = req.body.src.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');


      fs.mkdir("./back-end/storage/avatars/" + folderName,  (error) => { /* handle error */ });
      fs.writeFile("./back-end/storage/avatars/" + req.body.title, buf, 'binary', function(err1){
          if(err1)throw err1;
          fs.readFile("./back-end/storage/avatars/" + req.body.title, (err2, data1) => {
            if (err2) throw err2;
            obj.email = req.body.email;
            obj.last_name = req.body.lastName;
            obj.first_name = req.body.firstName;
            obj.address = req.body.address;
            obj.src = "data:image/jpeg;base64," + Buffer.from(data1).toString('base64');
            obj.title = req.body.title;
            res.status(200).json(obj);
          });
        });
    }else {
      fs.readFile("./back-end/storage/avatars/" + req.body.title, (err3, data2) => {
        if (err3) throw err3;
        obj.email = req.body.email;
        obj.last_name = req.body.lastName;
        obj.first_name = req.body.firstName;
        obj.address = req.body.address;
        obj.src = "data:image/jpeg;base64," + Buffer.from(data2).toString('base64');
        obj.title = req.body.title;
        res.status(200).json(obj);
      });
    }
  });
}


exports.getlistOfTypeOfAnimalOfColor = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  var data = {};
  data.Color = [];
  client.connect();
  client.query("SELECT * FROM public.\"Type_of_animals\" ;", (err, results) => {
    if (err) res.send(err);
    data.Type_of_animals = results.rows;
    client.query("SELECT * FROM public.\"Colours\" ;", (err1, results1) => {
      if (err1) res.send(err1);
      data.Color = results1.rows;


      client.query("SELECT * FROM public.\"Type_of_animals_of_colour\" ;", (err2, results2) => {
        if (err2) res.send(err2);

        data.Type_of_animals_of_colour = results2.rows;

        client.end();
        data.Color.forEach(function(item, index){
          fs.readFile("back-end/storage/Colours/" + item.image, (err3, data3) => {
            if (err3) throw err3;
            item.src = "data:image/jpeg;base64," + Buffer.from(data3).toString('base64');
            item.title = item.image;
            if(index == data.Color.length - 1){
              setTimeout(function () {
                res.status(200).json(data);
              }, 200);
            }
          });
        });
      });
    });
  });
}

exports.getPetsOfUser = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  client.connect();

  var data = [];

  client.query("SELECT * FROM public.\"Animal_of_user\" where id_user='" + req.session.user.userId + "';", (err, results) => {
    if (err) res.send(err);

    var obj = results.rows;
    obj.forEach(function(item, index) {
      if(index == (obj.length - 1)){
        client.query("SELECT * FROM public.\"Animals\" where id_animal='" + item.id_animal + "';", (err2, results2) => {
          if (err2) res.send(err2);
          client.query("SELECT * FROM public.\"Animal_of_type_of_animal\" where id_animal='" + item.id_animal + "';", (err3, results3) => {
            if (err3) res.send(err3);
            results2.rows[0].id_type_of_animal = results3.rows[0].id_type_of_animal;
            if(results2.rows[0].photo == ""){
              results2.rows[0].src = "";
              data.push(results2.rows[0]);
              client.end();
              res.status(200).json(data);
            }else {
              fs.readFile("back-end/storage/pets/" + results2.rows[0].photo, (err, data1) => {
                if (err) throw err;
                results2.rows[0].src = "data:image/jpeg;base64," + Buffer.from(data1).toString('base64');
                data.push(results2.rows[0]);
                client.end();
                res.status(200).json(data);
              });
            }
          });
        });

      }else {
        client.query("SELECT * FROM public.\"Animals\" where id_animal='" + item.id_animal + "';", (err2, results2) => {
          if (err2) res.send(err2);
          client.query("SELECT * FROM public.\"Animal_of_type_of_animal\" where id_animal='" + item.id_animal + "';", (err3, results3) => {
            if (err3) res.send(err3);
            results2.rows[0].id_type_of_animal = results3.rows[0].id_type_of_animal;
            if(results2.rows[0].photo == ""){
              results2.rows[0].src = "";
              data.push(results2.rows[0]);
            }else {
              fs.readFile("back-end/storage/pets/" + results2.rows[0].photo, (err, data1) => {
                if (err) throw err;
                results2.rows[0].src = "data:image/jpeg;base64," + Buffer.from(data1).toString('base64');
                data.push(results2.rows[0]);
              });
            }
          });
        });
      }
    });
  });
}

exports.getColor = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  client.connect();
  client.query("SELECT * FROM public.\"Colours\" ;", (err1, results1) => {
    if (err1) res.send(err1);

    results1.rows.forEach(function(item, index){
      fs.readFile("back-end/storage/Colours/" + item.image, (err3, data3) => {
        if (err3) throw err3;
        item.src = "data:image/jpeg;base64," + Buffer.from(data3).toString('base64');
        if(index == results1.rows.length - 1){
          client.end();
          setTimeout(function () {
            res.status(200).json(results1.rows);
          }, 400);
        }
      });
    });

  });

}

exports.getTypesOfAnimal = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  client.connect();
  client.query("SELECT * FROM public.\"Type_of_animals\" ;", (err1, results1) => {
    if (err1) res.send(err1);

      client.end();
      res.status(200).json(results1.rows);
  });
}

exports.getlistOftypeOfPosts = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  client.connect();
  client.query("SELECT * FROM public.\"Type_of_post\" ;", (err1, results1) => {
    if (err1) res.send(err1);
      client.end();
      res.status(200).json(results1.rows);
  });
}

exports.addColour = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });

  client.connect();


  var obj = {};
  client.query("SELECT MAX(id_colour) FROM public.\"Colours\" ;", (err1, results1) => {
    if (err1) res.send(err1);
    var data = req.body.src.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');

    var title = req.body.name + (results1.rows[0].max + 1) + ".jpg";
    fs.writeFile("./back-end/storage/Colours/" + title, buf, 'binary', function(err3){
        if(err3)throw err3;
        client.query("INSERT INTO public.\"Colours\" (name, image) " +
         "VALUES('" + req.body.name + "', '" + title + "');",
          (err, results) => {
          if (err) {
            res.send(err);
          }else {
            client.query("SELECT * FROM public.\"Colours\"  ORDER BY id_colour DESC LIMIT 1;", (err5, results5) => {
              if (err5) res.send(err5);

              client.end();
              results5.rows[0].src = req.body.src;
              res.status(200).json(results5.rows[0]);
            });
          }
        });
      });

  });
}

exports.deleteColor = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();
  client.query("SELECT * FROM public.\"Type_of_animals_of_colour\"  WHERE id_colour='" + req.body.id + "';", (err5, results5) => {
    if (err5) res.send(err5);
    if(results5.rows.length != 0){
      results5.rows.forEach(function(item, index) {
        client.query("DELETE FROM public.\"Type_of_animals_of_colour\" WHERE id='" + item.id + "';", (err, results) => {
          if (err) res.send(err);
          if(index == results5.rows.length - 1){
            client.query("DELETE FROM public.\"Colours\" WHERE id_colour='" + req.body.id + "';", (err1, results1) => {
              if (err1) res.send(err1);

              client.end();
              res.status(200).json({});
            });
          }
        });
      });
    }else {
      client.query("DELETE FROM public.\"Colours\" WHERE id_colour='" + req.body.id + "';", (err1, results1) => {
        if (err1) res.send(err1);

        client.end();
        res.status(200).json({});
      });
    }
  });
}

exports.addTypeOfAnimal = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();

  client.query("INSERT INTO public.\"Type_of_animals\" (name_type) " +
   "VALUES('" + req.body.name + "');",
    (err, results) => {
    if (err) {
      res.send(err);
    }else {
      client.query("SELECT * FROM public.\"Type_of_animals\"  ORDER BY id_type_of_animal DESC LIMIT 1;", (err5, results5) => {
        if (err5) res.send(err5);
        client.end();
        res.status(200).json(results5.rows[0]);
      });
    }
  });
}

exports.deleteAnimalType = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();

  client.query("SELECT * FROM public.\"Type_of_animals_of_colour\"  WHERE id_type_of_animal='" + req.body.id + "';", (err5, results5) => {
    if (err5) res.send(err5);
    if(results5.rows.length != 0){
      results5.rows.forEach(function(item, index) {
        client.query("DELETE FROM public.\"Type_of_animals_of_colour\" WHERE id='" + item.id + "';", (err, results) => {
          if (err) res.send(err);
          if(index == results5.rows.length - 1){
            client.query("DELETE FROM public.\"Type_of_animals\" WHERE id_type_of_animal='" + req.body.id + "';", (err1, results1) => {
              if (err1) res.send(err1);
              client.end();
              res.status(200).json({});
            });
          }
        });
      });
    }else {
      client.query("DELETE FROM public.\"Type_of_animals\" WHERE id_type_of_animal='" + req.body.id + "';", (err1, results1) => {
        if (err1) res.send(err1);
        client.end();
        res.status(200).json({});
      });
    }
  });

}

exports.addlistOfTypeOfAnimalOfColor = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();

  var obj = [];

  req.body['list_of_id_colors[]'].forEach(function (item, index) {
    client.query("SELECT * FROM public.\"Type_of_animals_of_colour\"  WHERE id_colour='" + parseInt(item) + "' AND id_type_of_animal='" + parseInt(req.body.id_type_of_animal) + "';", (err5, results5) => {
      if (err5) res.send(err5);
      if(results5.rows.length != 0){
        if(req.body['list_of_id_colors[]'].length - 1 == index){
          client.end();
          res.json(obj);
        }
      }else {
        client.query("INSERT INTO public.\"Type_of_animals_of_colour\" (id_colour, id_type_of_animal) " +
         "VALUES('" + parseInt(item) + "', '" + parseInt(req.body.id_type_of_animal) + "');",
          (err, results) => {
          if (err) res.send(err);
          client.query("SELECT * FROM public.\"Type_of_animals_of_colour\"  WHERE id_colour='" + parseInt(item) + "' AND id_type_of_animal='" + parseInt(req.body.id_type_of_animal) + "' ORDER BY id DESC LIMIT 1;", (err2, results2) => {
            if (err2) res.send(err2);

            if(req.body['list_of_id_colors[]'].length - 1 == index){
              obj.push(results2.rows[0]);
              client.end();
              setTimeout(function () {
                res.json(obj);
              }, 200);
            }else {
              obj.push(results2.rows[0]);
            }
          });
        });
      }

    });


  });

}
exports.deleteColorOfAnymalType = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();
  client.query("DELETE FROM public.\"Type_of_animals_of_colour\" WHERE id_colour='" + req.body.id_color + "' AND id_type_of_animal='" + req.body.id_animal + "';", (err1, results1) => {
    if (err1) res.send(err1);
    client.end();
    res.status(200).json({});
  });
}

exports.addlistOftypeOfPosts = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();
  client.query("INSERT INTO public.\"Type_of_post\" (name) " +
   "VALUES('" + req.body.name + "');",
    (err, results) => {
    if (err) {
      res.send(err);
    }else {
      client.query("SELECT * FROM public.\"Type_of_post\"  ORDER BY id_type_of_post DESC LIMIT 1;", (err5, results5) => {
        if (err5) res.send(err5);
        client.end();
        res.status(200).json(results5.rows[0]);
      });
    }
  });
}
exports.addPetsToUser = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();

  client.query("SELECT MAX(id_animal) FROM public.\"Animals\" ;", (err4, results4) => {
    if (err4) res.send(err4);
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" +
                    (currentdate.getMonth() + 1) + "-" +
                    currentdate.getDate() + " " +
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();

    if(req.body.imageOfPets != ''){

      var folderName = req.session.user.username;
      var data = req.body.imageOfPets.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.mkdir("./back-end/storage/pets/" + folderName,  (error) => { });
      fs.writeFile("./back-end/storage/pets/" + folderName + "/" + req.session.user.username + (results4.rows[0].max + 1) + ".jpeg", buf, 'binary', function(err1){
          if(err1)throw err1;
        });
      req.body.titleOfPets = folderName + "/" + req.session.user.username + (results4.rows[0].max + 1) + ".jpeg";
    }
    client.query("INSERT INTO public.\"Animals\" (name, gender, chipped, collar, created_at, updated_at, photo) " + // add here
     "VALUES('" + req.body.nameOfPets + "', '" + req.body.gender + "', '" + req.body.chipped + "', '" + req.body.collar + "', '" + datetime + "', '" + datetime + "', '" + req.body.titleOfPets + "');",// add here
      (err, results) => {
      if (err) {
        res.send(err);
      }else {
        client.query("SELECT * FROM public.\"Animals\"  ORDER BY id_animal DESC LIMIT 1;", (err5, results5) => {
          if (err5) res.send(err5);
          client.query("INSERT INTO public.\"Animal_of_user\" (id_animal, id_user) " +
           "VALUES('" + parseInt(results5.rows[0].id_animal) + "', '" + req.session.user.userId + "');",
            (err3, results3) => {
            if (err3) {
              res.send(err3);
            }
            client.query("INSERT INTO public.\"Animal_of_type_of_animal\" (id_animal, id_type_of_animal) " +
             "VALUES('" + parseInt(results5.rows[0].id_animal) + "', '" + parseInt(req.body.typeOfAnimal) + "');",
              (err2, results2) => {
              if (err2) {
                res.send(err2);
              }
              client.end();
              res.status(200).json({});
            });
          });
        });
      }
    });
  });
}

exports.addPosts = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();

  var map = {};
  if(req.body.gal != '' && req.body.gaj != '' && req.body.mal != '' && req.body.maj != '' && req.body.nameStreet != ''){
    map.gal = req.body.gal;
    map.gaj = req.body.gaj;
    map.mal = req.body.mal;
    map.maj = req.body.maj;
    map.nameStreet = req.body.nameStreet;
  }
  var time = req.body.time.split('T')[0] + " " + req.body.time.split('T')[1];
  var currentdate = new Date();
  var datetime = currentdate.getFullYear() + "-" +
                  (currentdate.getMonth() + 1) + "-" +
                  currentdate.getDate() + " " +
                  + currentdate.getHours() + ":"
                  + currentdate.getMinutes() + ":"
                  + currentdate.getSeconds();

  client.query("INSERT INTO public.\"Posts\" (text, map, title, time_at, created_at, updated_at) " +
   "VALUES('" + req.body.text + "', '" + JSON.stringify(map) + "', '" + req.body.title + "', '" + time + "', '" + datetime + "', '" + datetime + "');",// add here
    (err, results) => {
    if (err) {
      res.send(err);
    }else {
      client.query("SELECT * FROM public.\"Posts\"  ORDER BY id_post DESC LIMIT 1;", (err5, results5) => {
        if (err5) res.send(err5);
        client.query("INSERT INTO public.\"Post_of_user\" (id_post, id_user) " +
         "VALUES('" + parseInt(results5.rows[0].id_post) + "', '" + req.session.user.userId + "');",
          (err3, results3) => {
          if (err3) {
            res.send(err3);
          }
          client.query("INSERT INTO public.\"Post_of_type_of_post\" (id_post, id_type_of_post) " +
           "VALUES('" + parseInt(results5.rows[0].id_post) + "', '" + parseInt(req.body.type_of_post) + "');",
            (err2, results2) => {
            if (err2) {
              res.send(err2);
            }
            if(parseInt(req.body.id_animal) != -1){
              client.query("INSERT INTO public.\"Animal_of_post\" (id_animal, id_post) " +
               "VALUES('" + parseInt(req.body.id_animal) + "', '" + parseInt(results5.rows[0].id_post) + "');",
                (err6, results6) => {
                if (err6) {
                  res.send(err6);
                }else {
                  client.end();
                  res.status(200).json({});
                }
              });
            }else {
              client.end();
              res.status(200).json({});
            }
          });
        });
      });
    }
  });
}


exports.getPosts = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();

  var data = {};


  client.query("SELECT * FROM public.\"Posts\" ;", (err, results) => {
    if (err) res.send(err);
    data.post = results.rows;
    client.query("SELECT public.\"Post_of_user\".id_post, public.\"Post_of_user\".id_user, public.\"Users\".email, public.\"Users\".first_name, public.\"Users\".last_name, public.\"Users\".avatar FROM public.\"Post_of_user\" INNER JOIN public.\"Users\" on public.\"Users\".id_user =  public.\"Post_of_user\".id_user;", (err1, results1) => {
      if (err1) res.send(err1);
      data.post_of_user_and_user = results1.rows;
      data.post_of_user_and_user.forEach(function (item, index) {
        fs.readFile("back-end/storage/avatars/" + item.avatar, (err, data) => {
          if (err) throw err;
          item.src = "data:image/jpeg;base64," + Buffer.from(data).toString('base64');
          item.title = item.avatar;
        });
        if(index == data.post_of_user_and_user.length - 1){
          setTimeout(function() {
            client.query("SELECT public.\"Post_of_type_of_post\".id_post, public.\"Type_of_post\".id_type_of_post, public.\"Type_of_post\".name FROM public.\"Post_of_type_of_post\" INNER JOIN public.\"Type_of_post\" on public.\"Post_of_type_of_post\".id_type_of_post =  public.\"Type_of_post\".id_type_of_post;", (err2, results2) => {
              if (err2) res.send(err2);
              data.type_of_post_and_post = results2.rows;
              client.query("SELECT public.\"Type_of_animals\".name_type, public.\"Animal_of_type_of_animal\".id_type_of_animal, public.\"Posts\".id_post, public.\"Animals\".id_animal, public.\"Animals\".name, public.\"Animals\".gender, public.\"Animals\".chipped, public.\"Animals\".collar, public.\"Animals\".photo FROM (((public.\"Animal_of_post\" INNER JOIN public.\"Posts\" on public.\"Animal_of_post\".id_post =  public.\"Posts\".id_post) INNER JOIN public.\"Animals\" on public.\"Animal_of_post\".id_animal =  public.\"Animals\".id_animal) INNER JOIN public.\"Animal_of_type_of_animal\" on public.\"Animal_of_type_of_animal\".id_animal =  public.\"Animals\".id_animal) INNER JOIN public.\"Type_of_animals\" on public.\"Type_of_animals\".id_type_of_animal = public.\"Animal_of_type_of_animal\".id_type_of_animal;", (err3, results3) => {
                if (err3) res.send(err3);
                data.animal_of_post = results3.rows;
                data.animal_of_post.forEach(function (item, index) {
                  if(item.photo != ""){
                    fs.readFile("back-end/storage/pets/" + item.photo, (err, data) => {
                      if (err) throw err;
                      item.src = "data:image/jpeg;base64," + Buffer.from(data).toString('base64');
                      item.title = item.photo;
                    });
                  }else {
                    item.src = "";
                    item.title = "";
                  }
                  if(index == data.animal_of_post.length - 1){
                    setTimeout(function() {
                      client.query("SELECT public.\"Type_of_animals_of_colour\".id_colour, public.\"Type_of_animals_of_colour\".id_type_of_animal, public.\"Colours\".name, public.\"Colours\".image FROM (public.\"Type_of_animals_of_colour\" INNER JOIN public.\"Type_of_animals\" on public.\"Type_of_animals\".id_type_of_animal = public.\"Type_of_animals_of_colour\".id_type_of_animal) INNER JOIN public.\"Colours\" on public.\"Type_of_animals_of_colour\".id_colour = public.\"Colours\".id_colour;", (err4, results4) => {
                        if (err4) res.send(err4);
                        data.color_ofType = results4.rows;
                        data.color_ofType.forEach(function (item, index) {
                          if(item.image != ""){
                            fs.readFile("back-end/storage/Colours/" + item.image, (err, data) => {
                              if (err) throw err;
                              item.src = "data:image/jpeg;base64," + Buffer.from(data).toString('base64');
                              item.title = item.image;
                            });
                          }else {
                            item.src = "";
                            item.title = "";
                          }
                          if(index == data.color_ofType.length - 1){
                            setTimeout(function() {
                              client.query("SELECT * FROM public.\"Type_of_post\" ;", (err7, results7) => {
                                if (err7) res.send(err7);
                                data.type_of_post = results7.rows;
                                data.type_of_post.forEach(function (item, index) {
                                  item.len = 0;
                                  if(index == data.type_of_post.length - 1){
                                    client.end();
                                    res.status(200).json(data);
                                  }
                                });
                              });
                            }, 200);
                          }
                        });
                      });
                    }, 200);
                  }
                });
              });
            });
          }, 200);
        }
      });
    });
  });
}

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

exports.singlepost = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  if(isNormalInteger(req.params.postId)){
    client.connect();
    client.query("SELECT * FROM public.\"Posts\" where id_post = '" + req.params.postId + "';", (err, results) => {
      if (err) res.send(err);
      if(req.params.postId == -1 || (results && results.rows.length == 0)){
        console.log("Error");
        client.end();
        res.status(500).send('Post Not Found');
      }else {
        var data = {};
        if(req.session.user){
          data.user = req.session.user.userId;
        }else {
          data.user = -1;
        }
        if(req.session.user){
          data.admin = req.session.user.admin;
        }else {
          data.admin = false;
        }

        client.query("SELECT public.\"Users\".id_user, public.\"Users\".email, public.\"Users\".avatar, public.\"Users\".first_name, public.\"Users\".last_name FROM public.\"Users\" INNER JOIN public.\"Post_of_user\" on public.\"Users\".id_user = public.\"Post_of_user\".id_user  where public.\"Post_of_user\".id_post = '" + req.params.postId + "';", (err5, results5) => {
          if (err5) res.send(err5);
          fs.readFile("back-end/storage/avatars/" + results5.rows[0].avatar, (err, data3) => {
            if (err) throw err;
            results5.rows[0].src = "data:image/jpeg;base64," + Buffer.from(data3).toString('base64');
            results5.rows[0].title = results5.rows[0].photo;

            data.creator = results5.rows[0];

            data.animal = {};
            data.post = results.rows[0];
            client.query("SELECT public.\"Type_of_post\".id_type_of_post, public.\"Type_of_post\".name FROM public.\"Type_of_post\" INNER JOIN public.\"Post_of_type_of_post\" on public.\"Type_of_post\".id_type_of_post = public.\"Post_of_type_of_post\".id_type_of_post where public.\"Post_of_type_of_post\".id_post = '" + req.params.postId + "';", (err1, results1) => {
              if (err1) res.send(err1);
              data.type_of_post = results1.rows[0];
              client.query("SELECT public.\"Animals\".id_animal, public.\"Animals\".name, public.\"Animals\".gender, public.\"Animals\".chipped, public.\"Animals\".collar, public.\"Animals\".photo FROM public.\"Animals\" INNER JOIN public.\"Animal_of_post\" on public.\"Animals\".id_animal = public.\"Animal_of_post\".id_animal where public.\"Animal_of_post\".id_post = '" + req.params.postId + "';", (err2, results2) => {
                if (err2) res.send(err2);
                if(results2.rows.length != 0){
                  if(results2.rows[0].photo != ""){
                    fs.readFile("back-end/storage/pets/" + results2.rows[0].photo, (err, data1) => {
                      if (err) throw err;
                      results2.rows[0].src = "data:image/jpeg;base64," + Buffer.from(data1).toString('base64');
                      results2.rows[0].title = results2.rows[0].photo;

                      data.animal = results2.rows[0];
                    });
                  }else {
                    data.animal.src = "";
                    data.animal.title = "";
                    data.animal = results2.rows[0];
                  }
                  setTimeout(function () {
                    client.query("SELECT public.\"Type_of_animals\".id_type_of_animal, public.\"Type_of_animals\".name_type FROM public.\"Type_of_animals\" INNER JOIN public.\"Animal_of_type_of_animal\" on public.\"Type_of_animals\".id_type_of_animal = public.\"Animal_of_type_of_animal\".id_type_of_animal where public.\"Animal_of_type_of_animal\".id_animal = '" + results2.rows[0].id_animal + "';", (err3, results3) => {
                      if (err3) res.send(err3);
                      data.type_of_animal = results3.rows[0];
                      client.query("SELECT public.\"Colours\".id_colour, public.\"Colours\".name, public.\"Colours\".image FROM public.\"Colours\" INNER JOIN public.\"Type_of_animals_of_colour\" on public.\"Colours\".id_colour = public.\"Type_of_animals_of_colour\".id_colour where public.\"Type_of_animals_of_colour\".id_type_of_animal = '" + results3.rows[0].id_type_of_animal + "';", (err4, results4) => {
                        if (err4) res.send(err4);
                        results4.rows.forEach(function (item, index) {
                          fs.readFile("back-end/storage/Colours/" + item.image, (err6, data2) => {
                            if (err6) throw err6;
                            item.src = "data:image/jpeg;base64," + Buffer.from(data2).toString('base64');
                            item.title = item.image;
                            if(results4.rows.length - 1 == index){
                              data.color = results4.rows;
                              client.end();

                              setTimeout(function () {
                                res.status(200).json(data);
                              },200);
                            }
                          });
                        });
                      });
                    });
                  },250 );
                }else {
                  data.type_of_animal = {};
                  data.color = {};
                  client.end();
                  res.status(200).json(data);
                }
              });
            });
          });
        });
      }
    });
  }else {

      console.log("Error");
      res.status(500).send('Post Not Found');
  }

}

exports.deleteAnimal = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();
  client.query("SELECT * FROM public.\"Animals\" WHERE id_animal='" + req.body.id_animal + "';", (err1, results1) => {
    if (err1) res.send(err1);
    if(results1.rows.length != 0){
      client.query("DELETE FROM public.\"Animal_of_user\" WHERE id_animal='" + req.body.id_animal + "';", (err2, results2) => {
        if (err2) res.send(err2);
        client.query("DELETE FROM public.\"Animal_of_type_of_animal\" WHERE id_animal='" + req.body.id_animal + "';", (err3, results3) => {
          if (err3) res.send(err3);
          client.query("SELECT * FROM public.\"Animal_of_post\" WHERE id_animal='" + req.body.id_animal + "';", (err5, results5) => {
            if (err5) res.send(err5);
            if(results5.rows.length != 0){
              results5.rows.forEach(function(item, index){
                var id_post = item.id_post;
                client.query("DELETE FROM public.\"Animal_of_post\" WHERE id_post='" + id_post + "';", (err6, results6) => {
                  if (err6) res.send(err6);
                  client.query("DELETE FROM public.\"Post_of_user\" WHERE id_post='" + id_post + "';", (err7, results7) => {
                    if (err7) res.send(err7);
                    client.query("DELETE FROM public.\"Post_of_type_of_post\" WHERE id_post='" + id_post + "';", (err8, results8) => {
                      if (err8) res.send(err8);
                      client.query("DELETE FROM public.\"Posts\" WHERE id_post='" + id_post + "';", (err9, results9) => {
                        if (err9) res.send(err9);
                        client.query("DELETE FROM public.\"Animals\" WHERE id_animal='" + req.body.id_animal + "';", (err10, results10) => {
                          if (err10) res.send(err10);
                          if(index == results5.rows.length - 1){
                            setTimeout(function() {
                              client.end();
                              res.status(200).json({});
                            }, 250);
                          }
                        });
                      });
                    });
                  });
                });
              });
            }else {
              client.query("DELETE FROM public.\"Animals\" WHERE id_animal='" + req.body.id_animal + "';", (err11, results11) => {
                if (err11) res.send(err11);
                client.end();
                res.status(200).json({});
              });

            }
          });
        });
      });
    }else {
      client.end();
      res.status(200).json({});
    }
  });
}


exports.deletePost = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();
  client.query("SELECT * FROM public.\"Posts\" WHERE id_post='" + req.body.id_post + "';", (err1, results1) => {
    if (err1) res.send(err1);
    if(results1.rows.length != 0){
      client.query("DELETE FROM public.\"Post_of_user\" WHERE id_post='" + req.body.id_post + "';", (err2, results2) => {
        if (err2) res.send(err2);
        client.query("DELETE FROM public.\"Post_of_type_of_post\" WHERE id_post='" + req.body.id_post + "';", (err3, results3) => {
          if (err3) res.send(err3);
          client.query("SELECT * FROM public.\"Animal_of_post\" WHERE id_post='" + req.body.id_post + "';", (err4, results4) => {
            if (err4) res.send(err4);
            if(results4.rows.length != 0){
              client.query("DELETE FROM public.\"Animal_of_post\" WHERE id_post='" + req.body.id_post + "';", (err5, results5) => {
                if (err5) res.send(err5);
                client.query("DELETE FROM public.\"Posts\" WHERE id_post='" + req.body.id_post + "';", (err6, results6) => {
                  if (err6) res.send(err6);
                  client.end();
                  res.status(200).json({});
                });
              });
            }else {
              client.query("DELETE FROM public.\"Posts\" WHERE id_post='" + req.body.id_post + "';", (err7, results7) => {
                if (err7) res.send(err7);
                client.end();
                res.status(200).json({});
              });
            }
          });
        });
      });
    }else {
      client.end();
      res.status(200).json({});
    }
  });
}


exports.getAllPostOfuser = function (req, res) {
  const client = new Client({
    connectionString: stringConnection,
    ssl: true
  });
  client.connect();
  client.query("SELECT public.\"Posts\".id_post, public.\"Posts\".title FROM public.\"Posts\" INNER JOIN public.\"Post_of_user\" on public.\"Posts\".id_post = public.\"Post_of_user\".id_post WHERE public.\"Post_of_user\".id_user='" + req.session.user.userId + "';", (err1, results1) => {
    if (err1) res.send(results1);
    client.end();
    res.status(200).json(results1.rows);
  });
}
