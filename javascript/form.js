// Form management functionality
// Handles form resets and clearing when navigating between pages
// Refrenced in navigation.js

// function to reset all forms between pages

function resetFormForPage(pageid) {
  const targetPage = document.getElementById(pageid);
  if (!targetPage) return;

  // Don't reset flight search form to preserve searches
  if (pageid === "pageFlights") {
    const resultsDiv = document.getElementById("search-results");
    if (resultsDiv) resultsDiv.innerHTML = "";
    return;
  }

  // Reset all forms in the page
  const forms = targetPage.getElementsByTagName("form");
  for (let form of forms) {
    form.reset();

    // Special handling for register form
    if (pageid === "pageRegister") {
      form.querySelectorAll(".error-message").forEach((e) => e.remove());
      form.querySelectorAll("input, textarea").forEach((input) => {
        input.style.borderColor = "";
        input.style.boxShadow = "";
      });
    }
  }

  // Clear result divs
  if (pageid === "pageBooking") {
    const bookingResult = document.getElementById("booking-result");
    if (bookingResult) bookingResult.innerHTML = "";
    const resourceID = document.getElementById("booking-resourceID");
    if (resourceID) resourceID.value = "";
  }
}

function formResetUtil() {
  // referenced in user.js and index.html onclick
  // Clear saved search to prevent loadSearchFromLocalStorage from restoring it
  localStorage.removeItem("lastSearch");

  const forms = document.getElementsByTagName("form");
  for (let form of forms) {
    form.reset();
  }
}
