var idPost = - 1;
var post;
window.onload = function () {
  idPost = parseInt(document.location.search.split('=')[1]);

  $.ajax({
     url: "/back-end/singlepost/" + idPost,
     type: "GET",
     cache: false,
     success: function(data){
       console.log(data);
       post = new Vue({
         el: '#post',
         data: {
           post: data.post,
           type_of_post: data.type_of_post,
           animal: data.animal,
           type_of_animal: data.type_of_animal,
           creator: data.creator,
           color: data.color,
           this_User: data.user,
           is_admin: data.admin
         },
         methods: {
           deleteRow(){
             $.ajax({
                url: "/back-end/deletePost",
                type: "POST",
                data: {
                  id_post: post.post.id_post
                },
                success: function (data) {
                  window.location.href = "Posts";
                 alert("Видалено");
              }
            });
           }
         }
       });
       setTimeout(function () {
         initMap(post.post.map);
       },800);
     },
     error: function () {
       console.log("error");
       window.location.href="Error";
     }
   });


}
