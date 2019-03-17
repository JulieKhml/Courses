const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');


const app = express(),
 port = process.env.PORT || 8080;

const routes = require('./back-end/routes/route.js');;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const sessionChecker = (req, res, next) => {
  if(req.session.user && req.cookies.user_sid){
    console.log( req.session.user );
      next();
  } else {
    res.redirect('/Login');
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
      req.session.user = {
        userId: 1,//change here
        username: username,
        password: password,
        admin: true//change here
      };


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
