function setupHistory() {
  window.onpopstate = function (event) {
    if (event.state) {
      // Set flag to prevent pushState when handling back/forward
      localStorage.setItem("fromPopstate", "true");
      showpage(event.state);
      localStorage.removeItem("fromPopstate");
    }
  };
}

window.onload = function () {
  setupHistory();
  // Sätt initial state för första sidan
};

function showpage(pageid) {
  //  Om det var från init ovan
  if (!localStorage.getItem("fromPopstate")) {
    history.pushState(pageid, null);
  }

  // display

  var pages = document.getElementsByClassName("pages");
  for (let page of pages) {
    page.style.display = "none";
  }

  var targetPage = document.getElementById(pageid);
  if (targetPage) {
    targetPage.style.display = "block";

    // Update page-specific content
    if (pageid === "pageMyPage" && typeof updateMyPageWelcome === "function") {
      updateMyPageWelcome();
    }
  }
}
