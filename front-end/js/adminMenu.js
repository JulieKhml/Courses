var app5;
var app4;
var app3;
var typeOfPosts;
// TODO: зробити синхронізацію виведення після видалення!!!

window.onload = function () {
  chackAuthorithation();
  setColor();
  setTypeofPets();
  setColorTypeAnimals();
  setListOfTypeOfColorsOfAnimals();
  settypeOfPosts();
}
settypeOfPosts = function () {
  $.ajax({
     url: "/back-end/getlistOftypeOfPosts",
     type: "GET",
     success: function (data) {
       typeOfPosts = new Vue({
        el: '#typeOfPosts',
        data: {
          list: data
        },
        methods: {
          addRow() {
            if(document.getElementById('nameTypeOfPost').value != ""){
              $.ajax({
                 url: "/back-end/addlistOftypeOfPosts",
                 type: "POST",
                 cache: false,
                 success: function(data){
                   typeOfPosts.list.push(data);
                   document.getElementById('nameTypeOfPost').value = "";
                 },
                 data: {
                   name: document.getElementById('nameTypeOfPost').value
                 }
               });
            }
          }
        }
      });
     }
   });
}

setListOfTypeOfColorsOfAnimals = function () {
  setTimeout( function(){
    app5.listOfTypeOfAnimalOfColor.forEach(function(item, index) {
      var index = -1;
      var val = item.id_colour;
      var k;
      if(app5.idOfType_OfAnimals && app5.idOfType_OfAnimals.indexOf(item.id_type_of_animal) == -1){
        app5.idOfType_OfAnimals.push(item.id_type_of_animal);
      }
      if(app5.idOfColour && app5.idOfColour[item.id_type_of_animal] == null){
        app5.idOfColour[item.id_type_of_animal] = [];
        k = app5.colors.find(function(item, i){
          if(item.id_colour === val){
            index = i;
            return i;
          }
        });

        app5.idOfColour[item.id_type_of_animal].push(index);
      }else if(app5.idOfColour && app5.idOfColour[item.id_type_of_animal] != null) {
        k = app5.colors.find(function(item, i){
          if(item.id_colour === val){
            index = i;
            return i;
          }
        });
        app5.idOfColour[item.id_type_of_animal].push(index);
      }
    });
  },1000);
}

setColorTypeAnimals = function () {
  $.ajax({
     url: "/back-end/getlistOfTypeOfAnimalOfColor",
     type: "GET",
     cache: false,
     success: function(data){
        app5 = new Vue({
         el: '#listOfTypeOfAnimalOfColor',
         data: {
           colors: data.Color,
           type_of_animals: data.Type_of_animals,
           listOfTypeOfAnimalOfColor: data.Type_of_animals_of_colour,
           checkedColors : [],
           checkedType_of_animal: -1,
           idOfType_OfAnimals: [],
           idOfColour: []
         },
         methods: {
           addColoursToTypeOfAnimal() {
             if(this.checkedType_of_animal != -1){
               if(this.checkedColors.length != 0 ){
                 $.ajax({
                    url: "/back-end/addlistOfTypeOfAnimalOfColor",
                    type: "POST",
                    cache: false,
                    success: function(data){
                      setTimeout( function(){
                        data.forEach(function(item, index) {
                          app5.listOfTypeOfAnimalOfColor.push({
                            id_colour: parseInt(item.id_colour),
                            id_type_of_animal: parseInt(item.id_type_of_animal)
                          });
                          console.log(app5.idOfType_OfAnimals);
                          console.log(app5.idOfColour);
                          console.log(item.id_colour);
                          console.log(item.id_type_of_animal);
                          var index = -1;
                          var val = parseInt(item.id_colour);
                          var k;
                          if(app5.idOfType_OfAnimals && app5.idOfType_OfAnimals.indexOf(parseInt(item.id_type_of_animal)) == -1){
                            app5.idOfType_OfAnimals.push(parseInt(item.id_type_of_animal));
                          }
                          if(app5.idOfColour && app5.idOfColour[parseInt(item.id_type_of_animal)] == null){
                            app5.idOfColour[parseInt(item.id_type_of_animal)] = [];
                            k = app5.colors.find(function(item, i){
                              if(parseInt(item.id_colour) === val){
                                index = i;
                                return i;
                              }
                            });

                            app5.idOfColour[parseInt(item.id_type_of_animal)].push(index);
                          }else if(app5.idOfColour && app5.idOfColour[parseInt(item.id_type_of_animal)] != null) {
                            k = app5.colors.find(function(item, i){
                              if(parseInt(item.id_colour) === val){
                                index = i;
                                return i;
                              }
                            });
                            app5.idOfColour[parseInt(item.id_type_of_animal)].push(index);
                          }
                        });


                        setColorTypeAnimals();
                        alert("Додано");
                        app5.checkedColors = [];
                        app5.checkedType_of_animal = -1;
                      },1500);
                    },
                    error: function(request, status, error){
                    },
                    data: {
                      id_type_of_animal: app5.checkedType_of_animal,
                      list_of_id_colors: app5.checkedColors
                    }
                  });
               }else {
                 alert("Виберіть кольори");
               }
             }else {
               alert("Виберіть тип тварини");
             }

          },
          deleteItem(animal_id, color_id, index){
            console.log("animal_id=" + animal_id);
            console.log("color_id=" + this.colors[parseInt(color_id)].id_colour);
            $.ajax({
               url: "/back-end/deleteColorOfAnymalType",
               type: "POST",
               cache: false,
               success: function(data){
                 app5.idOfColour[parseInt(animal_id)].splice(index, 1);
                 alert("Видалено");
               },
               data: {
                 id_animal: parseInt(animal_id),
                 id_color: parseInt(this.colors[parseInt(color_id)].id_colour)
               }
             });
          }
        }
      });
    }
  });
}

setTypeofPets = function () {
  $.ajax({
     url: "/back-end/getTypesOfAnimal",
     type: "GET",
     cache: false,
     success: function(data){
         app4 = new Vue({
         el: '#listOfTypesOfAnimal',
         data: {
           listOfTypesOfAnimal: data
         },
        methods: {
          addRow() {
            if(document.getElementById('nameOfType') != null && document.getElementById('nameOfType').value != ""){
              $.ajax({
                 url: "/back-end/addTypeOfAnimal",
                 type: "POST",
                 cache: false,
                 success: function(data){
                   app4.listOfTypesOfAnimal.push(data);
                   document.getElementById('nameOfType').value = "";

                   alert("Додано");
                 },
                 error: function(request, status, error){
                   console.log(request.responseText);
                 },
                 data: {
                   name: document.getElementById('nameOfType').value
                 }
               });
            }else {
              alert("Ведіть назву виду тварини");
            }
          },
          deleteRow(index) {
            console.log(app4.listOfTypesOfAnimal[index].id_type_of_animal);
            $.ajax({
               url: "/back-end/deleteAnimalType",
               type: "POST",
               cache: false,
               success: function(data){
                 app4.listOfTypesOfAnimal.splice(index, 1);

                 alert("Видалено");
               },
               data: {
                 id: app4.listOfTypesOfAnimal[index].id_type_of_animal
               }
             });
          }
        }
       });
     }
   });
}

setColor = function () {
  $.ajax({
     url: "/back-end/getColor",
     type: "GET",
     cache: false,
     success: function(data){
         app3 = new Vue({
         el: '#listOfColours',
         data: {
           listOfColors: data,
           src: ""
         },
         methods: {
           previewImage: function(event) {
             var input = event.target;
             if (input.files && input.files[0] && (input.files[0].type.match('image.*') &&  (input.files[0].type != "image/gif"))) {
               var reader = new FileReader();
               reader.onload = (e) => {
                 this.src = e.target.result;
                   document.getElementById('infoAboutImage').innerHTML = "";
               }
               reader.readAsDataURL(input.files[0]);
             }else {
               this.src = "";
               document.getElementById('infoAboutImage').innerHTML = "IT is not an image";
             }
           },
           addColour() {
           if(document.getElementById('list').firstChild != null && document.getElementById('infoAboutImage').innerHTML != "IT is not an image"
            && this.src != ""){
             if(document.getElementById('nameOfColour').value != ""){
               $.ajax({
                  url: "/back-end/addColour",
                  type: "POST",
                  cache: false,
                  success: function(data){
                    app3.listOfColors.push(data);
                    app5.colors.push(data);
                    document.getElementById('list').firstChild.firstChild.src = "";
                    document.getElementById('list').firstChild.firstChild.title = "";
                    document.getElementById('nameOfColour').value = "";
                    setColor();

                    alert("Додано");
                  },
                  data: {
                    src: document.getElementById('list').firstChild.firstChild.src,
                    title: document.getElementById('list').firstChild.firstChild.title,
                    name: document.getElementById('nameOfColour').value
                  }
                });
             }else {
               alert("Ведіть назву кольору");
             }
           }else {
             alert("Виберіть картинку для кольору");
           }
         },
         deleteRow(index) {
           $.ajax({
              url: "/back-end/deleteColor",
              type: "POST",
              cache: false,
              success: function(data){
                app3.listOfColors.splice(index, 1);
                alert("Видалено");
              },
              data: {
                id: app3.listOfColors[index].id_colour
              }
            });
         }
        }
       });
     }
   });
}
