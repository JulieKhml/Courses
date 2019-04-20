window.onload = function() {
  chackAuthorithation();

  setPosts();

}

var post;

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

class Post {
  constructor(id_post, title, text, created_at, time_at, type_of_post, author, animal) {
    this.id_post = id_post;
    this.title = title;
    this.text = text;
    this.created_at = created_at;
    this.time_at = time_at;
    this.type_of_post = type_of_post;
    this.author = author;
    this.animal = animal;
  }
}

class Author {
  constructor(first_name, last_name, email, avatar, title) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.avatar = avatar;
    this.title = title;
  }
}

class Animal {
  constructor(name, chipped, collar, gender, name_type, title, src, id_type_of_animal) {
    this.name = name;
    this.chipped = chipped;
    this.collar = collar;
    this.gender = gender;
    this.name_type = name_type;
    this.title = title;
    this.src = src;
    this.id_type_of_animal = id_type_of_animal;
  }
}

setTypePostOnClick = function(e) {
  post.searchType_of_post = e.value;
}

setTypeAnimalOnClick = function(e) {
  post.searchType_of_animal = e.value;
}

setPosts = function () {
  $.ajax({
     url: "/back-end/getPosts",
     type: "GET",
     cache: false,
     success: function(data){
       post = new Vue({
        el: '#list_of_post',
        data: {
          post: data,
          searchType_of_post: '',
          searchType_of_animal: '',
          post_user_animal: []
        },
        methods: {

        },
        computed: {
          filterTypeOfPost() {
            return this.post.type_of_post.filter(type => {
              return type.name.toLowerCase().includes(this.searchType_of_post.toLowerCase())
            })
          },
          filterTypeOfanimal() {
            return this.post_user_animal.filter(item => {
              if(JSON.stringify(item.animal) != JSON.stringify({})) return item.animal.name_type.toLowerCase().includes(this.searchType_of_animal.toLowerCase())
              if(JSON.stringify(item.animal) === JSON.stringify({})){
                if(this.searchType_of_animal === ''){
                   return true
                }else {
                   return false
                }
              }

            });
          }
        }
       });
       setTimeout(function () {
         post.post.type_of_post.forEach(function (item, index){
           var len = 0;
           post.post.type_of_post_and_post.forEach(function (item1, index1) {
             if(item1.id_type_of_post == item.id_type_of_post) len += 1;
             if(post.post.type_of_post_and_post.length - 1 == index1) item.len = len;

           });
         });

         post.post.post.forEach(function (item, index){
           var author;
           var id_type_of_post = -1;
           var animal = {};
           post.post.post_of_user_and_user.forEach(function (item1, index1){
             if(item1.id_post == item.id_post){
               author = new Author(item1.first_name, item1.last_name, item1.email, item1.src, item1.title);
             }
           });
           post.post.animal_of_post.forEach(function (item2, index2){
             if(item2.id_post == item.id_post){
               animal = new Animal(item2.name, item2.chipped, item2.collar, item2.gender, item2.name_type, item2.title, item2.src, item2.id_type_of_animal);
             }
           });
           post.post.type_of_post_and_post.forEach(function (item3, index3){
             if(item3.id_post == item.id_post){
               id_type_of_post = item3.id_type_of_post;
             }
           });
           setTimeout(function() {
             post.post_user_animal.push(new Post(item.id_post, item.title, item.text, item.created_at, item.time_at, id_type_of_post, author, animal));
           }, 100);
         });

       }, 100);
     }
   });

}
