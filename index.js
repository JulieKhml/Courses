const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');


var stringConnection = "postgres://zuhykdgdsvzbpy:01244214c64d6248ebb1d71b1f7338fc4520050f951032bbed0cb61be17a33a9@ec2-54-247-72-30.eu-west-1.compute.amazonaws.com:5432/d4m6n0kln18m2f";

const app = express(),
 port = process.env.PORT || 8080;

const routes = require('./back-end/routes/route.js');;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const { Client } = require('pg');
var passwordHash = require('password-hash');


const sessionChecker = (req, res, next) => {
  if(req.session.user && req.cookies.user_sid){
      next();
  } else {
    res.redirect('/Login');
  }
};

const sessionAdminChecker = (req, res, next) => {
  if(req.session.user && req.session.user.admin == true){
      next();
  } else {
    res.redirect('/Home');
  }
};

app.use(bodyParser.urlencoded({
  extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'Shh, its a secret!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000000
    }
}));

app.route("/Home").get((req, res) => {
  res.sendFile(__dirname + '/front-end/index.html');
});

app.route("/Error").get((req, res) => {
  res.sendFile(__dirname + '/front-end/error.html');
});

app.route("/Donate").get((req, res) => {
  res.sendFile(__dirname + '/front-end/donate.html');
});

app.route("/Posts").get((req, res) => {
  res.sendFile(__dirname + '/front-end/posts.html');
});

app.route("/Post").get((req, res) => {
  res.sendFile(__dirname + '/front-end/singlepost.html');
});

var nodemailer = require('nodemailer');

app.route("/Contact").get((req, res) => {
  res.sendFile(__dirname + '/front-end/contackUs.html');
}).post(async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Moshurovska.lara@gmail.com',
      pass: 'GaVkae1557golosno'
    }
  });

  var mailOptions = {
    from: 'Moshurovska.lara@gmail.com',
    to: req.body.exampleInputEmail1,
    subject: 'ви надіслали',
    text: 'Шановний(а), ' + req.body.exampleInputName1 + '.\nВи залишили заявку з коментарем:\n' +  req.body.exampleFormControlTextarea1 + '\nЗ Вами буде зв\'язано по телефону, який ви залишили:' + req.body.exampleInputPhone1
  };

  console.log(mailOptions);

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.redirect( "/Contact?err=NOT SEND" );
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect( "/Contact" );
    }
  });

});

app.route("/Policy").get((req, res) => {
  res.sendFile(__dirname + '/front-end/politica.html');
});

app.route("/Advice").get((req, res) => {
  res.sendFile(__dirname + '/front-end/advice.html');
});

app.route("/About").get((req, res) => {
  res.sendFile(__dirname + '/front-end/about.html');
});

app.route("/Profile").get(sessionChecker, (req, res) => {
  res.sendFile(__dirname + '/front-end/profile.html');
});

app.route("/Animal").get(sessionChecker, (req, res) => {
  res.sendFile(__dirname + '/front-end/createAnimal.html');
});

app.route("/AdminMenu").get(sessionAdminChecker, (req, res) => {
  res.sendFile(__dirname + '/front-end/admin.html');
});

app.route("/CreatePosts").get(sessionChecker, (req, res) => {
  res.sendFile(__dirname + '/front-end/createpost.html');
});

app.route("/Login")
  .get((req, res) => {
    res.sendFile(__dirname + '/front-end/login.html');
  })
  .post(async (req, res) => {
    const client = new Client({
      connectionString: stringConnection,
      ssl: true
    });
    client.connect();
    client.query("SELECT * FROM public.\"Users\" where username='" + req.body.username + "';", (err, results) => {
      if (err) res.send(err);
      var obj = results.rows;
      client.end();
      if(obj[0] == null){
        res.redirect( "/Login?err=wrongusername" );
      }else {
        if(passwordHash.verify(req.body.password, obj[0].password)){
          req.session.user = {
            userId: obj[0].id_user,
            username: obj[0].username,
            admin: obj[0].admin,
            first_name: obj[0].first_name,
            last_name: obj[0].last_name,
            email: obj[0].email,
            address: obj[0].address,
            avatar: obj[0].avatar
          };
          res.redirect( "/Home" );
        }else {
          res.redirect( "/Login?err=wrongpassword" );
        }
      }
    });
  });

app.route("/SignIn").get((req, res) => {
    res.sendFile(__dirname + '/front-end/sign-in.html');
  }).post(async (req, res) => {
    const client = new Client({
      connectionString: stringConnection,
      ssl: true
    });
    client.connect();
    var image;
    client.query("SELECT * FROM public.\"Users\" where username='" + req.body.username + "';", (err, results) => {
      if (err) res.send(err);
      else{
        if(results.rows[0] == null){
          client.query("SELECT * FROM public.\"Users\" where email='" + req.body.email+ "';", (err1, results1) => {
            if (err1) res.send(err1);
            else{
              if(results1.rows[0] == null){
                var hashedPassword = passwordHash.generate(req.body.pass);
                if(req.body.src == ""){
                  req.body.name = "noname/nonename.jpg";
                }else {
                  image = req.body.username + "/" + req.body.name;
                  req.body.name = image;
                  createAvatarFolderFile(req.body.username, req.body.name, req.body.srс);
                }
                if(req.body.leave == ""){
                   req.body.leave = null;
                }
                var currentdate = new Date();
                var datetime = currentdate.getFullYear() + "-" +
                                (currentdate.getMonth() + 1) + "-" +
                                currentdate.getDate() + " " +
                                + currentdate.getHours() + ":"
                                + currentdate.getMinutes() + ":"
                                + currentdate.getSeconds();

                client.query("INSERT INTO public.\"Users\" (username, email, password, first_name, last_name, address, created_at, updated_at, avatar, admin) " +
                 "VALUES('" + req.body.username + "', '" + req.body.email + "', '" + hashedPassword + "', '" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.leave + "', '" + datetime + "', '" + datetime + "', '" + image + "'," + false + ");",
                  (err, results) => {
                  if (err) {
                    res.send(err);
                  }else {
                    client.end();
                    res.redirect('/Login');
                  }
                });
              }else {
                client.end();
                res.redirect( "/SignIn?err=emailAlreadyExists=" + req.body.email );
              }
            }
          });
        }else {
          client.end();
          res.redirect( "/SignIn?err=usernameAlreadyExists=" + req.body.username );
        }
      }
    });
  });

function createAvatarFolderFile(folderName, fileName, src) {
  var data = src.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');

  fs.mkdir("./back-end/storage/avatars/" + folderName,  (error) => { /* handle error */ });
  fs.readFile("back-end/storage/avatars/noname/nonename.jpg", (err2, data2) => {
    if (err2) throw err2;
    var data1 = "data:image/jpeg;base64," + Buffer.from(data2).toString('base64').replace(/^data:image\/\w+;base64,/, "");
    var buf1 = new Buffer(data2, 'base64');

    fs.writeFile("./back-end/storage/avatars/" + folderName + "/nonename.jpg", buf1, 'binary', function(err){
        if(err)throw err;
      });
  });


  fs.writeFile("./back-end/storage/avatars/" + folderName + "/" + fileName, buf, 'binary', function(err){
      if(err)throw err;
    });
}


app.use("/css", express.static("./front-end/css"));
app.use("/js", express.static("./front-end/js"));
app.use("/files", express.static("./front-end/files"));

routes(app);

app.get('/', (req, res) => {
  res.redirect('/Home');
});

app.listen(port);
console.log( "Express started on: " + port );
