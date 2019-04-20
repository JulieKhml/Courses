window.onload = function() {
  chackAuthorithation();
  addPosts();
  initMap();
}
var createPost;

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

addPosts = function() {
  createPost = new Vue({
    el: '#listOfTypesOfPosts',
    data: {
      text: '',
      title: '',
      gal: '',
      gaj: '',
      mal: '',
      maj: '',
      nameStreet: '',
      time: '',
      type_of_post: -1,
      id_animal: -1,
    },
    methods: {
      onChange(event) {
        this.type_of_post = parseInt(event.target.value);
      },
      onChangeId_animal($event) {
        this.id_animal = parseInt(event.target.value);
      },
      createAnimal() {
        window.location.href = "Animal";
      },
      addRow() {
        if(document.getElementById('mapJson').value != undefined){
          this.gal = document.getElementById('mapJson').value.ia.l;
          this.gaj = document.getElementById('mapJson').value.ia.j;
          this.mal = document.getElementById('mapJson').value.na.l;
          this.maj = document.getElementById('mapJson').value.na.j;
          this.nameStreet = document.getElementById('pac-input-from').value;
        }
        if(this.type_of_post != -1){
          if(this.title != ''){
            if(this.text != ''){
              if(this.id_type_of_post != -1){
                if(this.id_animal != -1){
                  $.ajax({
                     url: "/back-end/addPosts",
                     type: "POST",
                     data: {
                       text: createPost.text,
                       title: createPost.title,
                       gal : createPost.gal,
                       gaj : createPost.gaj,
                       mal : createPost.mal,
                       maj : createPost.maj,
                       nameStreet : createPost.nameStreet,
                       time: createPost.time,
                       type_of_post: createPost.type_of_post,
                       id_animal: createPost.id_animal
                     },
                     success: function (data) {
                       //document.getElementById('mapJson').value = undefined;
                       createPost.text = '';
                       createPost.title = '';
                       createPost.gal = '';
                       createPost.gaj = '';
                       createPost.mal = '';
                       createPost.maj = '';
                       createPost.nameStreet = '';
                       document.getElementById('pac-input-from').value = '';
                       clearMarker();
                       alert('Додано');
                     }
                   });
                }else {
                  alert("Виберіть тварину");
                }
              }else {
                alert("Виберіть тип посту");
              }
            }else {
              alert("Введіть текст для посту");
            }
          }else {
            alert("Введіть заголовок посту");
          }
        }else {
          alert("Виберіть тип посту");
        }
      }
    }
  });

  $.ajax({
     url: "/back-end/getlistOftypeOfPosts",
     type: "GET",
     success: function (data) {
       if(createPost){
         var sel = document.getElementById('type_of_post');

         data.forEach(function(item, index) {
           var opt = document.createElement('option');
           opt.appendChild(document.createTextNode(item.name));
           opt.value = item.id_type_of_post;

           sel.appendChild(opt);
         });
         createPost.type_of_post = sel.value;
       }
     }
   });

   $.ajax({
      url: "/back-end/getPetsOfUser",
      type: "GET",
      success: function (data) {
        if(createPost){
          var sel = document.getElementById('id_animal');

          data.forEach(function(item, index) {
            var opt = document.createElement('option');
            opt.appendChild(document.createTextNode(item.name));
            opt.value = item.id_animal;

            sel.appendChild(opt);
          });

          var opt = document.createElement('option');
          opt.appendChild(document.createTextNode('БЕЗ ТВАРИНИ'));
          opt.value = -1;
          sel.appendChild(opt);
          sel.value = -1;
        }
      }
    });

    Number.prototype.AddZero= function(b,c){
     var  l= (String(b|| 10).length - String(this).length)+1;
     return l> 0? new Array(l).join(c|| '0')+this : this;
  }//to add zero to less than 10,

    var d = new Date(),
    localDateTime= [d.getFullYear(), (d.getMonth()+1).AddZero(), d.getDate().AddZero()].join('-') + 'T' +
            [d.getHours().AddZero(),
             d.getMinutes().AddZero()].join(':');
    createPost.time = localDateTime;
}
