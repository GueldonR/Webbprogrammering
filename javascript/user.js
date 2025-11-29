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
      console.log(
        "Success:" + returnedData.childNodes.item(i).attributes["status"].value
      );
      alert("Successfully registered!");
      const registerForm = document.getElementById("make-customer-form");
      if (registerForm) registerForm.reset();
      showpage("pageHome");
    }
  }
}

function createCustomer() {
  // Get the values from the form
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const address = document.getElementById("address");

  // Create unique id that us a okay length
  const rawLongID = Math.floor(Math.random() * Date.now());
  const shortID = rawLongID.toString().substring(0, 4);

  var input = {
    ID: shortID,
    firstname: firstName ? firstName.value.trim() : "",
    lastname: lastName ? lastName.value.trim() : "",
    email: email ? email.value.trim() : "",
    address: address ? address.value.trim() : "",
  };

  // Send the request to the server
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
}

function ResultCustomers(returnedData) {
  // Fix characters in XML notation to HTML notation
  fixChars(returnedData);

  var resultset = returnedData.childNodes[0];
  // flag for empty response
  var found = false;

  // Iterate over all nodes in root node (i.e. customers)
  for (i = 0; i < resultset.childNodes.length; i++) {
    // Iterate over all child nodes of that node that are customer nodes
    if (resultset.childNodes.item(i).nodeName == "customer") {
      found = true;
      // Retrieve customer information
      var customer = resultset.childNodes.item(i);

      // Save each field explicitly to localStorage
      localStorage.setItem("user_id", customer.attributes["id"].value);
      localStorage.setItem(
        "user_firstname",
        customer.attributes["firstname"].value
      );
      localStorage.setItem(
        "user_lastname",
        customer.attributes["lastname"].value
      );
      localStorage.setItem(
        "user_address",
        customer.attributes["address"].value
      );
      localStorage.setItem("user_email", customer.attributes["email"].value);
      localStorage.setItem(
        "user_lastvisit",
        customer.attributes["lastvisit"].value
      );
      localStorage.setItem("loginTime", new Date().toISOString());

      // Update navigation bar with user name
      updateNavigationForLoggedInUser();

      // call the desired home page
      showpage("pageMyPage");
    }
  }
  if (!found) throw new Error("Wrong Identifier");
}

function updateNavigationForLoggedInUser() {
  const loginButton = document.querySelector(".nav-login-button");
  const logoutButton = document.querySelector(".nav-logout-button");
  const firstname = localStorage.getItem("user_firstname");

  if (loginButton && firstname) {
    loginButton.textContent = "Hi, " + firstname;
    loginButton.onclick = function () {
      showpage("pageMyPage");
    };
  }

  if (logoutButton) {
    logoutButton.style.display = "inline-block";
  }
}

// LocalStorage functions
function clearUserFromLocalStorage() {
  localStorage.clear();
}

function logout() {
  // clears all session/form info
  clearUserFromLocalStorage();
  resetNavigationForLoggedOutUser();
  formResetUtil();
  showpage("pageHome");
  alert("You have been logged out successfully.");
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
  const userId = localStorage.getItem("user_id");
  if (userId) {
    updateNavigationForLoggedInUser();
  } else {
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
