const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');

const axios = require('axios');
const baseURL = 'http://localhost:8080';
if (typeof baseURL !== 'undefined') {
  axios.defaults.baseURL = baseURL;
}
axios.defaults.port = process.env.PORT || 8080;

const app = express(),
 port = process.env.PORT || 8080;

const routes = require('./back-end/routes/route.js');;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const sessionChecker = (req, res, next) => {
  axios({
     method: 'GET',
     url: '/back-end/chekUser',
     timeout: 180000
   })
    .then(function (response) {
      if(JSON.stringify(response.data)=== JSON.stringify({})){
        res.redirect('/Login');
      }else{
          console.log("SessionId: " +  response.data );
          next();
      }

    });

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
        expires: 600000
    }
}));

app.route("/Home").get((req, res) => {
  res.sendFile(__dirname + '/front-end/index.html');
});
app.route("/About").get((req, res) => {
  res.sendFile(__dirname + '/front-end/about.html');
});

app.route("/Profile").get(sessionChecker, (req, res) => {
  res.sendFile(__dirname + '/front-end/profile.html');
});

app.route("/Login")
  .get((req, res) => {
    res.sendFile(__dirname + '/front-end/login.html');
  })
  .post((req, res) => {
    const username = req.body.username,
            password = req.body.password;
    if(username == "mageron")
    {
      req.session.userId = 1;
      req.session.admin = true;

      //var host = location.protocol + "://" + location.hostname;
      axios({
        method: 'POST',
        url: '/back-end/userSession',
        timeout: 180000,
        data: {
          id: req.session.userId,
          name: username,
          password: password,
          admin: req.session.admin
        }
      })
        .then(function (response) {
          console.log("succes user " + response.data);
        })
        .catch(function (error) {
          //console.log(error);
        });
      //console.log(req.session);
      res.redirect( "/Home" );
    }
    else
    {
      res.redirect( "/login?err=wrongusername" );
    }
  });

app.route("/SignIn").get((req, res) => {
  res.sendFile(__dirname + '/front-end/sign-in.html');
});

app.use("/css", express.static("./front-end/css"));
app.use("/js", express.static("./front-end/js"));
app.use("/files", express.static("./front-end/files"));

routes(app);

app.get('/', (req, res) => {
  res.redirect('/Home');
});

app.listen(port);
console.log( "Express started on: " + port );
