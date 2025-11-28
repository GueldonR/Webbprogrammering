// Search functionality with API integration
// Based on course material implementation

var apptype = "TravelDoctor";

// Note: fixChars function is already defined in user.js and available globally

// Initialize search on page load
document.addEventListener("DOMContentLoaded", function () {
  setupSearch();
  loadSearchFromLocalStorage();
});

function setupSearch() {
  const searchForm = document.getElementById("flight-search-form");
  if (!searchForm) return;

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    performSearch();
  });

  // Save search terms to localStorage on input
  const searchInputs = searchForm.querySelectorAll("input");
  searchInputs.forEach((input) => {
    input.addEventListener("change", function () {
      saveSearchToLocalStorage();
    });
  });
}

function saveSearchToLocalStorage() {
  const searchData = {
    from: document.getElementById("from")?.value || "",
    to: document.getElementById("to")?.value || "",
    depart: document.getElementById("depart")?.value || "",
    return: document.getElementById("return")?.value || "",
    travelers: document.getElementById("travelers")?.value || "1",
  };
  localStorage.setItem("lastSearch", JSON.stringify(searchData));
}

function loadSearchFromLocalStorage() {
  const savedSearch = localStorage.getItem("lastSearch");
  if (savedSearch) {
    try {
      const searchData = JSON.parse(savedSearch);
      if (searchData.from)
        document.getElementById("from").value = searchData.from;
      if (searchData.to) document.getElementById("to").value = searchData.to;
      if (searchData.depart)
        document.getElementById("depart").value = searchData.depart;
      if (searchData.return)
        document.getElementById("return").value = searchData.return;
      if (searchData.travelers)
        document.getElementById("travelers").value = searchData.travelers;
    } catch (e) {
      console.error("Error loading search from localStorage:", e);
    }
  }
}

//------------------------------------------------------------------------
// searchResources
//------------------------------------------------------------------------
// Searches through the resources for a certain application.
// If only type is given all resources for application are given
// If either company, location or name are given in any combination, these values are searched
// If fulltext is given all attributes are searched at once
//------------------------------------------------------------------------
function performSearch() {
  const from = document.getElementById("from")?.value || "";
  const to = document.getElementById("to")?.value || "";

  // Build search parameters - use fulltext if both fields filled, otherwise individual
  var input = {
    type: apptype,
    name: from || "UNK",
    location: to || "UNK",
    company: "UNK",
    resID: "UNK",
    category: "UNK",
  };

  // If we use Free text search - do not combine with matches we overwrite if free search is given
  if (from && to) {
    input = {
      type: apptype,
      fulltext: from + " " + to,
    };
  }

  // Show loading animation
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = '<div class="loading-spinner">Searching...</div>';
  resultsDiv.style.opacity = "0";
  setTimeout(() => {
    resultsDiv.style.opacity = "1";
  }, 100);

  // Use getavailability_search_XML.php to get available flights with dates
  fetch("../API/booking/getavailability_search_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (xmlText) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      // Fix characters in XML notation to HTML notation
      fixChars(xmlDoc);
      displaySearchResults(xmlDoc);
      saveSearchToLocalStorage();
    })
    .catch(function (error) {
      resultsDiv.innerHTML =
        '<p style="color: #ff4f9a;">Search failed: ' + error + "</p>";
    });
}

function displaySearchResults(xmlDoc) {
  const resultsDiv = document.getElementById("search-results");
  const availabilities = xmlDoc.getElementsByTagName("availability");

  if (availabilities.length === 0) {
    resultsDiv.innerHTML =
      '<p style="color: #b7bfd6;">No flights found. Try different search criteria.</p>';
    return;
  }

  let html = '<h3 style="margin-bottom: 1rem;">Available Flights</h3>';
  html +=
    '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
  html += '<thead><tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Name</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Company</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Location</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Date</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Cost</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Available</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Action</th>';
  html += "</tr></thead><tbody>";

  for (let i = 0; i < availabilities.length; i++) {
    const avail = availabilities[i];
    const resourceID = avail.getAttribute("resourceID");
    const name = avail.getAttribute("name");
    const company = avail.getAttribute("company");
    const location = avail.getAttribute("location");
    const date = avail.getAttribute("date");
    const cost = avail.getAttribute("cost");
    const remaining = avail.getAttribute("remaining");

    html += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">';
    html += '<td style="padding: 10px; color: #f5f7ff;">' + name + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + company + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + location + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + date + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + cost + " SEK</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + remaining + "</td>";
    html +=
      '<td style="padding: 10px;"><button class="book-btn" onclick="selectForBooking(\'' +
      resourceID +
      "','" +
      date +
      "','" +
      cost +
      '\')" style="background: linear-gradient(120deg, #ff4f9a, #ffb347); border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer;">Book</button></td>';
    html += "</tr>";
  }

  html += "</tbody></table>";
  resultsDiv.innerHTML = html;
}

function selectForBooking(resourceID, date, cost) {
  // Navigate to booking page
  showpage("pageBooking");

  // Fill in booking form
  setTimeout(() => {
    document.getElementById("booking-resourceID").value = resourceID;
    document.getElementById("booking-date").value = date.replace(" ", "T");

    // Set default position to 1
    document.getElementById("booking-position").value = 1;

    // Scroll to form
    document
      .getElementById("booking-form")
      .scrollIntoView({ behavior: "smooth" });
  }, 300);
}
