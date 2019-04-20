function handleFileSelect(evt) {
  var files = evt.target.files[0]; // FileList object
  // Loop through the FileList and render image files as thumbnails.
  //for (var i = 0, f; f = files[i]; i++) {
    // Only process image files.
  var span = document.createElement('span');
  var list = document.getElementById('list');
  if (files.type.match('image.*') &&  (files.type != "image/gif")) {
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
       span.innerHTML = ['<img class="thumb" src="', e.target.result,
                         '" title="', escape(theFile.name), '"/>'].join('');
       if(document.getElementById('src') != null ){
         document.getElementById('src').value  = e.target.result;
       }
       if(document.getElementById('name') != null ){
         document.getElementById('name').value  = escape(theFile.name);
       }
      };
    })(files);
    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
  }else {
    span.innerHTML = "IT is not an image";
  }
  if (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  list.appendChild(span);
}

function addImage(){
  document.getElementById("files").click();
}
