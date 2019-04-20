function validate(){

  var name = document.forms["contactForm"]["exampleInputName1"].value;
  var email = document.forms["contactForm"]["exampleInputEmail1"].value;
  var phone = document.forms["contactForm"]["exampleInputPhone1"].value;
  var coment = document.forms["contactForm"]["exampleFormControlTextarea1"].value;
  if (name == "" ) {
    alert("Введіть ім'я");
    return false;
  }
  if (phone == "") {
    alert("Введіть номер телефону");
    return false;
  }
  if (email == "" ) {
    alert("Введіть електронну адресу");
    return false;
  }
  if (coment == "") {
    alert("Введіть коментарій");
    return false;
  }

}
