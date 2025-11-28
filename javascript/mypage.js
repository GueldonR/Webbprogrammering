// My Page - Display user data from localStorage

function updateMyPageData() {
  const userId = localStorage.getItem("user_id");
  const firstname = localStorage.getItem("user_firstname");
  const lastname = localStorage.getItem("user_lastname");
  const email = localStorage.getItem("user_email");
  const address = localStorage.getItem("user_address");
  const lastvisit = localStorage.getItem("user_lastvisit");

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
