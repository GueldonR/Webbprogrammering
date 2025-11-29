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
      updateMyPageData();
    }

    // Clear booking page when navigating via back button (popstate)
    if (pageid === "pageBooking" && localStorage.getItem("fromPopstate")) {
      const availabilityDiv = document.getElementById("availability-results");
      const bookingResultDiv = document.getElementById("booking-result");
      if (availabilityDiv) availabilityDiv.innerHTML = "";
      if (bookingResultDiv) bookingResultDiv.innerHTML = "";
    }

    // Load saved search when navigating to flights page
    if (
      pageid === "pageFlights" &&
      typeof loadSearchFromLocalStorage === "function"
    ) {
      loadSearchFromLocalStorage();
    }

    // Reset forms when navigating to their pages
    if (typeof resetFormForPage === "function") {
      resetFormForPage(pageid);
    }
  }
}

// Load customer bookings on Mypage,
// called in html and depends on react-babel
// was placed here since because of js-file dependencies, couldnt get a nice solution
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
