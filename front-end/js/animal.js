window.onload = function() {
  chackAuthorithation();
  setUserInfo();
  setPets();
  setListOfTypeOfColorsOfAnimals();
  setListOfPets();
}
var appPets;
var app2;
var app;
var listOfPets;

var setListOfPets = function(){
  listOfPets = new Vue({
   el: '#listOfPets',
   data: {
     list: [],
     typeOfAnimal: [],
     color: []
   },
   methods: {

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

       console.log(listOfPets.color);
       console.log(listOfPets.typeOfAnimal);
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
        if(this.nameOfPets != ''){
          if(this.typeOfAnimal != -1){
            $.ajax({
               url: "/back-end/addPetsToUser",
               type: "POST",
               data: {
                 nameOfPets: appPets.nameOfPets,
                 gender: appPets.gender,
                 chipped: appPets.chipped,
                 collar: appPets.collar,
                 imageOfPets: appPets.imageOfPets,
                 titleOfPets: appPets.titleOfPets,
                 typeOfAnimal: appPets.typeOfAnimal
               },
               success: function () {
                 appPets.nameOfPets = '';
                 appPets.imageOfPets = '';
                 appPets.titleOfPets = '';
                 alert("Додано");
               }
             });
          }else {
            alert("Виберіть тип тварини'");
          }
        }else {
          alert("Введіть ім'я тварини'");
        }
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
         //type_of_animals[item - 1].id_type_of_animal
         var sel = document.getElementById('typeAnimal');

         appPets.type_of_animals.forEach(function(item, index) {
           var opt = document.createElement('option');
           opt.appendChild(document.createTextNode(item.name_type));
           opt.value = item.id_type_of_animal;
           sel.appendChild(opt);
         });
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

         var app1 = new Vue({
           el: '#app1',
           data: {
             admin: data.admin
           }
         });
        info = {
          updatedEmail: data.email,
          updatedLastName: data.lastName,
          updatedFirstName: data.firstName,
          address: data.address,
          src: "data:image/jpeg;base64," + data.src.toString('base64'),
          title: data.title.split("/")[1],
        }
        info2 = {
          updatedEmail: data.email,
          updatedLastName: data.lastName,
          updatedFirstName: data.firstName,
          address: data.address,
          src: "data:image/jpeg;base64," + data.src.toString('base64'),
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

setMap = function () {
    document.getElementById("maps").style.visibility = 'visible';
    document.getElementById("maps").style.position = 'relative';
}

upDate = function() {
  document.getElementById("maps").style.visibility = 'hidden';
  document.getElementById("maps").style.position = 'absolute';

  var list = document.getElementById('list');
  var src;
  var title;
  if(list.firstChild == null){
    src = "";
    title = "";
  }else {
    src = list.firstChild.firstChild.src;
    title = list.firstChild.firstChild.title;
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
       setUserInfo();
     },
     data: data
   });
}

deleteAvatar = function(){
  var list = document.getElementById('list');
  if (list.firstChild.firstChild) {
    list.firstChild.firstChild.src = "";
  }
}
