// My Page - Display user data from localStorage

function updateMyPageData() {
  const userId = decodeHTMLEntities(localStorage.getItem("user_id"));
  const firstname = decodeHTMLEntities(localStorage.getItem("user_firstname"));
  const lastname = decodeHTMLEntities(localStorage.getItem("user_lastname"));
  const email = decodeHTMLEntities(localStorage.getItem("user_email"));
  const address = decodeHTMLEntities(localStorage.getItem("user_address"));
  const lastvisit = decodeHTMLEntities(localStorage.getItem("user_lastvisit"));

  if (userId) {
    document.getElementById("mypage-welcome-title").textContent =
      "Welcome back, " + (firstname || "User") + "!";
    document.getElementById("mypage-user-id").textContent = userId;
    document.getElementById("mypage-user-firstname").textContent =
      firstname || "N/A";
    document.getElementById("mypage-user-lastname").textContent =
      lastname || "N/A";
    document.getElementById("mypage-user-email").textContent = email || "N/A";
    document.getElementById("mypage-user-address").textContent =
      address || "N/A";
    document.getElementById("mypage-user-lastvisit").textContent =
      lastvisit || "N/A";
  } else {
    showpage("pageLogin");
  }
}

// quick fix to decode fields correctly
function decodeHTMLEntities(text) {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}
