// Page navigation
function showpage(pageid) {
  var pages = document.getElementsByClassName("pages");
  for (page of pages) {
    page.style.display = "none";
  }
  document.getElementById(pageid).style.display = "block";
}
