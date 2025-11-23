// Page navigation
function showpage(pageid) {
  var pages = document.getElementsByClassName("pages");
  for (page of pages) {
    page.style.display = "none";
  }
  document.getElementById(pageid).style.display = "block";
}

function showDialog(token) {
  alert("showing dialog: " + token);

  if (localStorage.getItem("flag") === "true") {
    return;
  }
  // We need an if-statement and a way to avoid saving history when called from historyChange
  // Otherwise we end up in an endless loop returning to the second to last page

  history.pushState(token, "Titel: " + token, "");
}

function historyChange(event) {
  localStorage.setItem("flag", "true");
  alert("token changed to: " + event.state);
  showDialog(event.state);
  localStorage.removeItem("flag");
  console.log("flag removed");
}

function setupHistory() {
  document.getElementById("outputValue").value = history.state;
  window.onpopstate = function (event) {
    historyChange(event);
  };
}
