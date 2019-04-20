var prevScrollpos = window.pageYOffset;

window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > 600) {
    document.getElementById("header").style.backgroundColor  = "black";
  } else {
    document.getElementById("header").style.backgroundColor  = "inherit";
  }
  prevScrollpos = currentScrollPos;
}

//login();


var login = function() {
  if(document.getElementById('log').innerHTML === "Вхід"){
     $.ajax({
        url: "/back-end/chekUser",
        type: "GET",
        cache: false,
        success: function(data){
          if(data == null){
            window.location.href = "Login";
          }else{
            document.getElementById('log').innerHTML = "Вихід";
          }
        }
      });
  }else {
    $.ajax({
       type: "POST",
       url: "/back-end/setUserNull",
       dataType: "json",
       success: function( resp ) {
         console.log("User loged out");
         document.getElementById('log').innerHTML = "Вхід";
         window.location.href = "Home";
        },
        error: function( req, status, err ) {
          console.log( 'something went wrong', status, err );
        }
     });

  }
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



window.onload = function() {
  chackAuthorithation();
}
