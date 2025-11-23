// hamburgermenu
function openNav() {
  document.getElementById("mySidenav").style.width = "50vw";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

document.querySelector(".closebtn").addEventListener("click", closeNav);
document.getElementById("sidebar-button").addEventListener("click", openNav);
