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
    resIDS: document.getElementById("resIDS")?.value || "",
    resNameS: document.getElementById("resNameS")?.value || "",
    resLocationS: document.getElementById("resLocationS")?.value || "",
    resCompanyS: document.getElementById("resCompanyS")?.value || "",
    resCategoryS: document.getElementById("resCategoryS")?.value || "",
    resFulltextS: document.getElementById("resFulltextS")?.value || "",
  };
  localStorage.setItem("lastSearch", JSON.stringify(searchData));
}

function loadSearchFromLocalStorage() {
  const savedSearch = localStorage.getItem("lastSearch");
  if (savedSearch) {
    try {
      const searchData = JSON.parse(savedSearch);
      if (searchData.resIDS)
        document.getElementById("resIDS").value = searchData.resIDS;
      if (searchData.resNameS)
        document.getElementById("resNameS").value = searchData.resNameS;
      if (searchData.resLocationS)
        document.getElementById("resLocationS").value = searchData.resLocationS;
      if (searchData.resCompanyS)
        document.getElementById("resCompanyS").value = searchData.resCompanyS;
      if (searchData.resCategoryS)
        document.getElementById("resCategoryS").value = searchData.resCategoryS;
      if (searchData.resFulltextS)
        document.getElementById("resFulltextS").value = searchData.resFulltextS;
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
  // Get search values from form inputs
  var input = {
    type: apptype,
    name: document.getElementById("resNameS")?.value || "UNK",
    location: document.getElementById("resLocationS")?.value || "UNK",
    company: document.getElementById("resCompanyS")?.value || "UNK",
    resID: document.getElementById("resIDS")?.value || "UNK",
    category: document.getElementById("resCategoryS")?.value || "UNK",
  };

  // If we use Free text search - do not combine with matches we overwrite if free search is given
  const fulltextValue = document.getElementById("resFulltextS")?.value || "";
  if (fulltextValue !== "") {
    input = {
      type: apptype,
      fulltext: fulltextValue,
    };
  }

  // Show loading animation
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = '<div class="loading-spinner">Searching...</div>';
  resultsDiv.style.opacity = "0";
  setTimeout(() => {
    resultsDiv.style.opacity = "1";
  }, 100);

  // Use getresources_XML.php to get resources
  fetch("../API/booking/getresources_XML.php", {
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
  const resources = xmlDoc.getElementsByTagName("resource");

  if (resources.length === 0) {
    resultsDiv.innerHTML =
      '<p style="color: #b7bfd6;">No flights found. Try different search criteria.</p>';
    return;
  }

  let html = '<h3 style="margin-bottom: 1rem;">Available Flights</h3>';
  html +=
    '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
  html += '<thead><tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">ID</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Name</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Type</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Company</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Location</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Category</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Size</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Cost</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Auxdata</th>';
  html +=
    '<th style="padding: 10px; text-align: left; color: #b7bfd6;">Action</th>';
  html += "</tr></thead><tbody>";

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const id = resource.getAttribute("id");
    const name = resource.getAttribute("name");
    const company = resource.getAttribute("company");
    const location = resource.getAttribute("location");
    const category = resource.getAttribute("category");
    const size = resource.getAttribute("size");
    const cost = resource.getAttribute("cost");
    const auxdata = resource.getAttribute("auxdata") || "-";

    html += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">';
    html += '<td style="padding: 10px; color: #f5f7ff;">' + id + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + name + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + apptype + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + company + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + location + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + category + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + size + "</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + cost + " SEK</td>";
    html += '<td style="padding: 10px; color: #f5f7ff;">' + auxdata + "</td>";
    html +=
      '<td style="padding: 10px;"><button class="book-btn" onclick="selectForBooking(\'' +
      id +
      "','" +
      cost +
      '\')" style="background: linear-gradient(120deg, #ff4f9a, #ffb347); border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer;">Book</button></td>';
    html += "</tr>";
  }

  html += "</tbody></table>";
  resultsDiv.innerHTML = html;
}

function selectForBooking(resourceID, cost) {
  // Navigate to booking page
  showpage("pageBooking");

  // Fill in booking form
  setTimeout(() => {
    document.getElementById("booking-resourceID").value = resourceID;

    // Set default position to 1
    document.getElementById("booking-position").value = 1;

    // Scroll to form
    document
      .getElementById("booking-form")
      .scrollIntoView({ behavior: "smooth" });
  }, 300);
}
