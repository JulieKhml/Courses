window.onload = function() {
  chackAuthorithation();
}

var chackAuthorithation = function () {
  $.ajax({
     url: "/back-end/chekUser",
     type: "GET",
     cache: false,
     success: function(data){
       if(JSON.stringify(data) === JSON.stringify({})){
         document.getElementById('log').innerHTML = "Log in";
       }else{
         document.getElementById('log').innerHTML = "Log out";
       }
     }
   });
}

function handleFileSelect(evt) {
  var files = evt.target.files[0]; // FileList object
  // Loop through the FileList and render image files as thumbnails.
  //for (var i = 0, f; f = files[i]; i++) {
    // Only process image files.
  var span = document.createElement('span');
  var list = document.getElementById('list');
  if (files.type.match('image.*')) {
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
       span.innerHTML = ['<img class="thumb" src="', e.target.result,
                         '" title="', escape(theFile.name), '"/>'].join('');

      };
    })(files);
    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
  }else {
    span.innerHTML = "IT is not an image ";
  }
  if (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  list.appendChild(span);
}

function addImage(){
  var list = document.getElementById('list');
  console.log(list.firstChild.firstChild);
  console.log(list.firstChild.firstChild.getAttribute("src"));
  console.log(list.firstChild.firstChild.getAttribute("title"));
  if (list.firstChild) {
    $.ajax({
       url: "/back-end/uploadAvatar",
       type: "POST",
       success: function(response) {
         console.log("AVATAR Added");
         //document.getElementById('list').insertBefore(span, null);
       },
       error: function(jqXHR, textStatus, errorMessage) {
           console.log(errorMessage); // Optional
       },
       data: {
         src: list.firstChild.firstChild.getAttribute("src"),
         name: list.firstChild.firstChild.getAttribute("title")
       }
    });
  }
}
