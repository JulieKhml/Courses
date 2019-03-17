var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > 490) {
    document.getElementById("header").style.backgroundColor  = "black";
  } else {
    document.getElementById("header").style.backgroundColor  = "inherit";
  }
  prevScrollpos = currentScrollPos;
}

//login();


var login = function() {
  if(document.getElementById('log').innerHTML === "Log in"){
    fetch("/back-end/chekUser" ).then( (response) => {
      console.log(response);
       if ( response.status == 200 )
       {
         response.json().then((data) => {
           if(JSON.stringify(data) === JSON.stringify({})){
             window.location.href = "Login";
           }else{
             document.getElementById('log').innerHTML = "Log out";
           }
         });
       }
     });
  }else {
    $.ajax({
       type: "POST",
       url: "/back-end/setUserNull",
       dataType: "json",
       success: function( resp ) {
         console.log("User loged out");
         document.getElementById('log').innerHTML = "Log in";
         window.location.href = "Home";
        },
        error: function( req, status, err ) {
          console.log( 'something went wrong', status, err );
        }
     });

  }
}

var chackAuthorithation = function () {
  fetch( "/back-end/chekUser" ).then( (response) => {
    console.log(response);
     if ( response.status == 200 )
     {
       response.json().then((data) => {
         if(data == null){
           document.getElementById('log').innerHTML = "Log in";
         }else{
           document.getElementById('log').innerHTML = "Log out";
         }
       });
     }
   });
}
window.onload = function() {
  chackAuthorithation();
}
