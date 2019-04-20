if(document.location.search == "?err=wrongpassword")
{
  document.getElementById("wpas").style.visibility = 'visible';
  document.getElementById("wuser").style.visibility = 'hidden';

}
if(document.location.search == "?err=wrongusername")
{
  document.getElementById("wpas").style.visibility = 'hidden';
  document.getElementById("wuser").style.visibility = 'visible';
}
