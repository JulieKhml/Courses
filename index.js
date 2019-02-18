const express = require('express');
const app = express();

const routes = require('./back-end/routes/route.js');;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({
  extended: false}));
app.use(bodyParser.json());

app.route("/Home").get((req, res) => {
  res.sendFile(__dirname + '/front-end/index.html');
});
app.route("/About").get((req, res) => {
  res.sendFile(__dirname + '/front-end/about.html');
});

app.use("/css", express.static("front-end/css"));
app.use("/js", express.static("front-end/js"));

routes(app);

app.get('/', (req, res) => {
  res.redirect('/Home');
});

app.listen(8000);
