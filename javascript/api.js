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
      // Retrieve first name and last name for node
      var customer = resultset.childNodes.item(i);
      var div = document.getElementById("CustomerOutputDiv");
      output = customer.attributes["id"].value;
      output += " " + customer.attributes["firstname"].value;
      output += " " + customer.attributes["lastname"].value;
      output += " " + customer.attributes["address"].value;
      output += " " + customer.attributes["email"].value;
      output += " " + customer.attributes["lastvisit"].value;
      output += " " + customer.attributes["auxdata"].value;
      div.innerHTML = output;
    }
  }
}

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
