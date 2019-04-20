function validateForm(){
  var username = document.forms["myForm"]["username"].value;
  var email = document.forms["myForm"]["email"].value;
  var pass = document.forms["myForm"]["pass"].value;
  var repitPass = document.forms["myForm"]["repitPass"].value;
  var lastName = document.forms["myForm"]["lastName"].value;
  var firstName = document.forms["myForm"]["firstName"].value;
  if (username == "" ) {
    alert("Введіть ім'я користувача");
    return false;
  }
  if (email == "" ) {
    alert("Введіть електронну адресу");
    return false;
  }
  if (pass == "") {
    alert("Введіть пароль");
    return false;
  }
  if (repitPass == "") {
    alert("Підвердіть пароль");
    return false;
  }
  if (pass != repitPass) {
    alert("Паролі не співпадають");
    return false;
  }
  if (lastName == "") {
    alert("Введіть Ваше прізвище");
    return false;
  }
  if (firstName == "") {
    alert("Введіть Ваше ім'я");
    return false;
  }
}

window.onload = function () {
  console.log("dasd");
    chackAuthorithation();
}
