'use strict';

const controller = require('../controllers/controller.js');

module.exports = function(app) {
  //app.route().get();

    app.route( "/back-end/userSessionId")
      .get( controller.setSessionUserId);

    app.route( "/back-end/userSession")
      .post( controller.setSessionUser);

    app.route( "/back-end/chekUser")
      .get( controller.userCheck);

    app.route( "/back-end/setUserNull")
      .post( controller.setUserNull);

    app.route( "/back-end/uploadAvatar")
      .post( controller.uploadImage);
}
