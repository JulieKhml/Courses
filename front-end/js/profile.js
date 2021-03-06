window.onload = function() {
  chackAuthorithation();
  setUserInfo();
  setPets();
  setListOfTypeOfColorsOfAnimals();
  setListOfPets();
  setlistOfPost();
  setTimeout(function() {
    $.ajax({
       url: "/back-end/getAllPostOfuser",
       type: "GET",
       success: function (data) {
         if(listOfPost){
           listOfPost.id_post = data;
         }
         console.log(data);
         console.log("hi");
     }
   });
  }, 300);
}
var appPets;
var app2;
var app;
var listOfPets;
var listOfPost;

var setlistOfPost = function() {
  listOfPost = new Vue({
   el: '#listOfPost',
   data: {
     id_post: []
   }
 });
}

var setListOfPets = function(){
  listOfPets = new Vue({
   el: '#listOfPets',
   data: {
     list: [],
     typeOfAnimal: [],
     color: []
   },
   methods: {
     deleteRow(index){
       $.ajax({
          url: "/back-end/deleteAnimal",
          type: "POST",
          data: {
            id_animal: listOfPets.list[index].id_animal
          },
          success: function (data) {

           listOfPets.list.splice(index, 1);
           alert("Видалено");
        }
      });
     }
   }
 });
  $.ajax({
     url: "/back-end/getPetsOfUser",
     type: "GET",
     success: function (data) {
       listOfPets.list = data;
       listOfPets.color = appPets.colors;
       listOfPets.list.forEach(function(item, index){

         listOfPets.typeOfAnimal.push(appPets.idOfColour[parseInt(item.id_type_of_animal)]);

       });

     }
   });
}

setListOfTypeOfColorsOfAnimals = function () {
  setTimeout( function(){
    appPets.listOfTypeOfAnimalOfColor.forEach(function(item, index) {
      var index = -1;
      var val = item.id_colour;
      var k;
      if(appPets.idOfType_OfAnimals && appPets.idOfType_OfAnimals.indexOf(item.id_type_of_animal) == -1){
        appPets.idOfType_OfAnimals.push(item.id_type_of_animal);
      }
      if(appPets.idOfColour && appPets.idOfColour[item.id_type_of_animal] == null){
        appPets.idOfColour[item.id_type_of_animal] = [];
        k = appPets.colors.find(function(item, i){
          if(item.id_colour === val){
            index = i;
            return i;
          }
        });

        appPets.idOfColour[item.id_type_of_animal].push(index);
      }else if(appPets.idOfColour && appPets.idOfColour[item.id_type_of_animal] != null) {
        k = appPets.colors.find(function(item, i){
          if(item.id_colour === val){
            index = i;
            return i;
          }
        });
        appPets.idOfColour[item.id_type_of_animal].push(index);
      }
    });
  },1000);
}

var setPets = function () {

 appPets = new Vue({
    el: '#pets',
    data: {
      colors: [],
      type_of_animals: [],
      listOfTypeOfAnimalOfColor: [],
      nameOfPets: '',
      gender: 'Ч',
      chipped: 'Не знаю',
      collar: false,
      imageOfPets: '',
      titleOfPets: '',
      typeOfAnimal: -1,
      idOfType_OfAnimals: [],
      idOfColour: []
    },
    methods: {
      previewImage: function(event) {
        var input = event.target;
        if (input.files && input.files[0] && (input.files[0].type.match('image.*') &&  (input.files[0].type != "image/gif"))) {
          var reader = new FileReader();
          reader.onload = (e) => {
            this.imageOfPets = e.target.result;
              document.getElementById('infoAboutPhotoPets').innerHTML = "";
          }
          reader.readAsDataURL(input.files[0]);
        }else {
          this.imageOfPets = "";
          document.getElementById('infoAboutPhotoPets').innerHTML = "IT is not an image";
        }
      },
      addPets: function(){
        window.location.href = "/Animal";
      },
      onChange(event) {
        this.typeOfAnimal = parseInt(event.target.value);
      }
    }
  });

  $.ajax({
     url: "/back-end/getlistOfTypeOfAnimalOfColor",
     type: "GET",
     success: function (data) {
       if(appPets){
         appPets.colors = data.Color;
         appPets.type_of_animals = data.Type_of_animals;
         appPets.listOfTypeOfAnimalOfColor = data.Type_of_animals_of_colour;
       }
     }
   });


}


var setUserInfo = function(){
  var span = document.getElementById('avatar');
  $.ajax({
     url: "/back-end/getProfile",
     type: "GET",
     cache: false,
     success: function(data){
       if(data != null){
         document.getElementById("pac-input-from").value = data.address;

         var app1 = new Vue({
           el: '#app1',
           data: {
             admin: data.admin
           }
         });
        info = {
          updatedEmail: data.email,
          updatedLastName: data.last_name,
          updatedFirstName: data.first_name,
          address: data.address,
          src: data.src,
          title: data.title.split("/")[1],
        }
        info2 = {
          updatedEmail: data.email,
          updatedLastName: data.last_name,
          updatedFirstName: data.first_name,
          address: data.address,
          src: data.src,
          title: data.title.split("/")[1],
        }

        app2 = new Vue({
          el: '#info',
          data: {
            username: data.username,
            user: info
          }
        });
        app = new Vue({
           el: '#app',
           data: {
             change: false,
             user: info2
           },
            methods: {
              previewImage: function(event) {
                var input = event.target;
                if (input.files && input.files[0] && (input.files[0].type.match('image.*') &&  (input.files[0].type != "image/gif"))) {
                  var reader = new FileReader();
                  reader.onload = (e) => {
                    this.user.src = e.target.result;
                      document.getElementById('infoAboutImage').innerHTML = "";
                  }
                  reader.readAsDataURL(input.files[0]);
                }else {
                  this.user.src = "";
                  document.getElementById('infoAboutImage').innerHTML = "IT is not an image";
                }
              }
            }
         });
       }
     }
   });
}

var chackAuthorithation = function () {
  $.ajax({
     url: "/back-end/chekUser",
     type: "GET",
     cache: false,
     success: function(data){
       if(data == null){
         document.getElementById('log').innerHTML = "Вхід";
       }else{
         document.getElementById('log').innerHTML = "Вихід";
       }
     }
   });
}

showMap = function () {
    if(app){
      app.change = true;
      setTimeout(function () {
        initMap();
        },800);
    }
}

upDate = function() {
  var src;
  var title;
  if(list.firstChild == null){
    src = "";
    title = "";
  }else {
    src = app.user.src;
    title = app.user.title;
  }
  var data = {
    src: src,
    title: title,
    email: document.getElementById("updatedEmail").value,
    lastName: document.getElementById("updatedLastName").value,
    firstName: document.getElementById("updatedFirstName").value,
    address: document.getElementById("pac-input-from").value
  }
  $.ajax({
     url: "/back-end/updateUser",
     type: "POST",
     cache: false,
     success: function(data){
       app.user.updatedEmail = data.email;
       app.user.updatedLastName = data.last_name;
       app.user.updatedFirstName = data.first_name;
       app.user.address = data.address;
       app.user.src = data.src;
       app.user.title = data.title.split("/")[1];

       app2.user.updatedEmail = data.email;
       app2.user.updatedLastName = data.last_name;
       app2.user.updatedFirstName = data.first_name;
       app2.user.address = data.address;
       app2.user.src = data.src;
       app2.user.title = data.title.split("/")[1];
       if(app){
         app.change = false;
       }
     },
     data: data
   });
}

deleteAvatar = function(){
  var list = document.getElementById('list');
  if (list.firstChild.firstChild) {
    list.firstChild.firstChild.src = "";
    app.user.title = "";
    app.user.src = "";
  }
}
