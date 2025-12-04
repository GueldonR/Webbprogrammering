// hamburgermenu
function openNav() {
  document.getElementById("mySidenav").style.width = "50vw";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

document.querySelector(".closebtn").addEventListener("click", closeNav);
document.getElementById("sidebar-button").addEventListener("click", openNav);



function animationBonanza(){
  var featureCards = document.getElementsByClassName("feature-card");
  for (let fc of featureCards) {
    // when hovering
    fc.addEventListener("mouseover", () => {fc.style.transform = "translateY(-10px)"})
    // mouseout
    fc.addEventListener("mouseout", () => {fc.style.transform = "translateY(0px)"})
  }
}



addEventListener("DOMContentLoaded", animationBonanza);

// to close and open nav on "0" key-press
document.addEventListener("DOMContentLoaded", function() {
  const nav = document.getElementById("mySidenav");

  window.addEventListener("keydown", (event) => {
    if (event.key === "0") {
      console.log("recognized");
      const navState = getComputedStyle(nav);

      if (parseInt(navState.width) === 0) {
        openNav();
      } else {
        closeNav();
      }
    }
  });
});

// lägger till en translate styling på feature card