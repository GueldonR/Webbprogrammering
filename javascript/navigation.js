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
    if (pageid === "pageMyPage" && typeof updateMyPageData === "function") {
      setTimeout(function () {
        updateMyPageData();
      }, 50);
    }

    // Reset forms when navigating to their pages
    resetFormForPage(pageid);
  }
}

// function to reset all forms between pages
function resetFormForPage(pageid) {
  const pageConfig = {
    pageFlights: {
      form: "flight-search-form",
      clear: ["search-results"],
    },
    pageBooking: {
      form: "booking-form",
      clear: ["booking-result"],
      extra: () => {
        const field = document.getElementById("booking-resourceID");
        if (field) field.value = "";
      },
    },
    pageLogin: { form: "search-customer-form" },
    pageRegister: {
      form: "make-customer-form",
      extra: (form) => {
        form.querySelectorAll(".error-message").forEach((e) => e.remove());
        form.querySelectorAll("input, textarea").forEach((input) => {
          input.style.borderColor = "";
          input.style.boxShadow = "";
        });
      },
    },
  };

  const config = pageConfig[pageid];
  if (!config) return;

  const form = document.getElementById(config.form);
  if (form) {
    form.reset();
    if (config.extra) config.extra(form);
  }

  if (config.clear) {
    config.clear.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });
  }
}

// For students, User name of student to differentiate between different applications on the server
var apptype = "TravelDoctor";

//------------------------------------------------------------------------
// get Bookings
//------------------------------------------------------------------------
// Gets bookings using JSON - key was added to support React Element Keys
//------------------------------------------------------------------------
function getData() {
  var input = {
    customerID: localStorage.getItem("user_id"),
    type: apptype,
  };

  if (!input.customerID) {
    console.error("No customer ID found");
    alert("Please log in first");
    return;
  }

  fetch("../API/booking/getcustomerbookings_JSON.php", {
    method: "POST", // or 'PUT'
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      // first then()
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(function (data) {
      ResultBookingsCustomer(data);
    })
    .catch(function (error) {
      // catch
      alert("Request failed\n" + error);
    });
}
