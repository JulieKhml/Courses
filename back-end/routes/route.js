'use strict';

const controller = require('../controllers/controller.js');

module.exports = function(app) {
  //app.route().get();

    app.route( "/back-end/chekUser")
      .get( controller.userCheck);

    app.route( "/back-end/setUserNull")
      .post( controller.setUserNull);

    app.route( "/back-end/uploadAvatar")
      .post( controller.uploadImage);

    app.route( "/back-end/getUserInfo")
      .get( controller.getUser);
}
