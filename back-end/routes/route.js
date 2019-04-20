'use strict';

const controller = require('../controllers/controller.js');

module.exports = function(app) {
  app.route( "/back-end/chekUser")
    .get( controller.userCheck);

  app.route( "/back-end/setUserNull")
    .post( controller.setUserNull);

  app.route( "/back-end/getProfile")
    .get( controller.getProfile);

  app.route( "/back-end/updateUser")
    .post( controller.updateUser);

  app.route( "/back-end/getlistOfTypeOfAnimalOfColor")
    .get( controller.getlistOfTypeOfAnimalOfColor);

  app.route( "/back-end/getPetsOfUser")
    .get( controller.getPetsOfUser);

  app.route( "/back-end/getColor")
    .get( controller.getColor);

  app.route( "/back-end/getTypesOfAnimal")
    .get( controller.getTypesOfAnimal);

  app.route( "/back-end/getlistOftypeOfPosts")
    .get( controller.getlistOftypeOfPosts);

  app.route( "/back-end/getPosts")
    .get( controller.getPosts);

  app.route( "/back-end/addColour")
    .post( controller.addColour);

  app.route( "/back-end/deleteColor")
    .post( controller.deleteColor);

  app.route( "/back-end/addTypeOfAnimal")
    .post( controller.addTypeOfAnimal);

  app.route( "/back-end/deleteAnimalType")
    .post( controller.deleteAnimalType);

  app.route( "/back-end/addlistOfTypeOfAnimalOfColor")
    .post( controller.addlistOfTypeOfAnimalOfColor);

  app.route( "/back-end/deleteColorOfAnymalType")
    .post( controller.deleteColorOfAnymalType);

  app.route( "/back-end/addlistOftypeOfPosts")
    .post( controller.addlistOftypeOfPosts);

  app.route( "/back-end/addPetsToUser")
    .post( controller.addPetsToUser);

  app.route( "/back-end/addPosts")
    .post( controller.addPosts);

  app.route( "/back-end/singlepost/:postId")
    .get( controller.singlepost);

  app.route( "/back-end/deleteAnimal")
    .post( controller.deleteAnimal);

  app.route( "/back-end/deletePost")
    .post( controller.deletePost);

  app.route( "/back-end/getAllPostOfuser")
    .get( controller.getAllPostOfuser);

}
