document
  .getElementById("make-customer-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload
    createCustomer(); // call your function
  });

document
  .getElementById("search-customer-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload
    showCustomer(); // call your function
  });

// Code for creating users. (Register)
//
function ResultBookingCustomer(returnedData) {
  // Iterate over all nodes in root node (i.e. the 'created' element in root which has an attribute called status)
  for (i = 0; i < returnedData.childNodes.length; i++) {
    if (returnedData.childNodes.item(i).nodeName == "created") {
      alert(returnedData.childNodes.item(i).attributes["status"].value);
    }
  }
}

function createCustomer() {
  var input = {
    ID: Math.floor(Math.random() * 100),
    firstname: document.getElementById("firstName").value,
    lastname: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
  };

  console.log(input);

  fetch("../API/booking/makecustomer_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      ResultBookingCustomer(
        new window.DOMParser().parseFromString(text, "text/xml")
      );
    })
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}

// Code for getting user (Login)
//
function showCustomer() {
  var customerID = document.getElementById("custidentification").value;

  var input = {
    customerID: encodeURIComponent(customerID),
  };

  fetch("../API/booking/getcustomer_XML.php", {
    method: "POST", // or 'PUT'
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      // first then()
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      ResultCustomers(new window.DOMParser().parseFromString(text, "text/xml"));
    })
    .catch(function (error) {
      // catch
      alert("Request failed\n" + error);
    });

  // call the desired home page
  showpage("pageMyPage");
}

function ResultCustomers(returnedData) {
  // Fix characters in XML notation to HTML notation
  fixChars(returnedData);

  var resultset = returnedData.childNodes[0];

  // Iterate over all nodes in root node (i.e. customers)
  for (i = 0; i < resultset.childNodes.length; i++) {
    // Iterate over all child nodes of that node that are customer nodes
    if (resultset.childNodes.item(i).nodeName == "customer") {
      // Retrieve customer information
      var customer = resultset.childNodes.item(i);

      // Store customer data in localStorage only
      const userData = {
        id: customer.attributes["id"].value,
        firstname: customer.attributes["firstname"].value,
        lastname: customer.attributes["lastname"].value,
        address: customer.attributes["address"].value,
        email: customer.attributes["email"].value,
        lastvisit: customer.attributes["lastvisit"].value,
      };

      // Save to localStorage with timestamp
      saveUserToLocalStorage(userData);

      // Update login display
      var div = document.getElementById("CustomerOutputDiv");
      div.innerHTML =
        "Login successful! Welcome " +
        userData.firstname +
        " " +
        userData.lastname;

      // Update navigation bar with user name
      updateNavigationForLoggedInUser();

      // Update My Page welcome message
      updateMyPageWelcome();
    }
  }
}

function updateNavigationForLoggedInUser() {
  const loginButton = document.querySelector(".nav-login-button");
  const logoutButton = document.querySelector(".nav-logout-button");
  const currentUser = getCurrentUser();

  if (loginButton && currentUser) {
    loginButton.textContent = "Hi, " + currentUser.firstname;
    loginButton.onclick = function () {
      showpage("pageMyPage");
    };
  }

  if (logoutButton) {
    logoutButton.style.display = "inline-block";
  }
}

function updateMyPageWelcome() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const myPageDiv = document.getElementById("pageMyPage");
    if (myPageDiv) {
      // Update the welcome message in My Page
      const welcomeSection = myPageDiv.querySelector(".welcome-section h2");
      if (welcomeSection) {
        welcomeSection.textContent =
          "Welcome back, " + currentUser.firstname + "!";
      }

      // Update user info display
      const userInfoDiv = document.getElementById("user-info-display");
      if (userInfoDiv) {
        userInfoDiv.innerHTML = `
          <p><strong>Name:</strong> ${currentUser.firstname} ${currentUser.lastname}</p>
          <p><strong>Email:</strong> ${currentUser.email}</p>
          <p><strong>Address:</strong> ${currentUser.address}</p>
          <p><strong>Customer ID:</strong> ${currentUser.id}</p>
          <p><strong>Last Visit:</strong> ${currentUser.lastvisit}</p>
        `;
      }
    }
  }
}

// LocalStorage functions - Pure localStorage implementation
function saveUserToLocalStorage(userData) {
  try {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("loginTime", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save user to localStorage:", error);
  }
}

function getCurrentUser() {
  try {
    const userData = localStorage.getItem("currentUser");
    const loginTime = localStorage.getItem("loginTime");

    if (userData && loginTime) {
      // Check if session is still valid (24 hours)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return JSON.parse(userData);
      } else {
        // Session expired, clear storage
        clearUserFromLocalStorage();
      }
    }
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
  }
  return null;
}

function clearUserFromLocalStorage() {
  try {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loginTime");
  } catch (error) {
    console.error("Failed to clear user from localStorage:", error);
  }
}

function logout() {
  clearUserFromLocalStorage();
  resetNavigationForLoggedOutUser();
  showpage("pageHome");
  alert("You have been logged out successfully.");
}

// Minimal helper - get any user field with one function
function getUser(field) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user ? user[field] : null;
}

function resetNavigationForLoggedOutUser() {
  const loginButton = document.querySelector(".nav-login-button");
  const logoutButton = document.querySelector(".nav-logout-button");

  if (loginButton) {
    loginButton.textContent = "Login";
    loginButton.onclick = function () {
      showpage("pageLogin");
    };
  }

  if (logoutButton) {
    logoutButton.style.display = "none";
  }
}

// Initialize app state on page load
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already logged in from previous session
  const savedUser = getCurrentUser();

  if (savedUser) {
    // User is logged in, update UI
    updateNavigationForLoggedInUser();
    updateMyPageWelcome();
  } else {
    // No saved user, show logged out state
    resetNavigationForLoggedOutUser();
  }
});

// util functions
function fixChars(returnedData) {
  var resultset = returnedData.childNodes[0];

  // Iterate over all nodes in root node recursively and replace the strings inside attributes
  x = returnedData.getElementsByTagName("*");
  for (i = 0; i < x.length; i++) {
    for (j = 0; j < x[i].attributes.length; j++) {
      x[i].attributes[j].nodeValue = x[i].attributes[j].nodeValue.replace(
        /%/g,
        "&"
      );
    }
  }
}
