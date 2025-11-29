// Search functionality with API integration
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
}

function saveSearchToLocalStorage() {
  // hämta datan från senaste sökningen
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

  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = '<div class="loading-spinner">Searching...</div>';

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
    resultsDiv.innerHTML = '<p style="color: #b7bfd6;">No flights found.</p>';
    return;
  }

  const headers = [
    "ID",
    "Name",
    "Type",
    "Company",
    "Location",
    "Category",
    "Size",
    "Cost",
    "Auxdata",
  ];
  let output =
    "<table style='width: 100%; border-collapse: collapse; margin-top: 1rem;'>";
  output +=
    "<thead><tr style='border-bottom: 1px solid rgba(255,255,255,0.1);'>";
  headers.forEach(
    (h) =>
      (output += `<th style='padding: 10px; text-align: left; color: #b7bfd6;'>${h}</th>`)
  );
  output +=
    "<th style='padding: 10px; text-align: left; color: #b7bfd6;'>Action</th></tr></thead><tbody>";

  for (let i = 0; i < resources.length; i++) {
    const r = resources[i];
    const resourceID = r.getAttribute("id");
    output += "<tr style='border-bottom: 1px solid rgba(255,255,255,0.08);'>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" + resourceID + "</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      r.getAttribute("name") +
      "</td>";
    output += "<td style='padding: 10px; color: #f5f7ff;'>" + apptype + "</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      r.getAttribute("company") +
      "</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      r.getAttribute("location") +
      "</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      r.getAttribute("category") +
      "</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      r.getAttribute("size") +
      "</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      r.getAttribute("cost") +
      " SEK</td>";
    output +=
      "<td style='padding: 10px; color: #f5f7ff;'>" +
      (r.getAttribute("auxdata") || "-") +
      "</td>";
    output +=
      "<td style='padding: 10px;'><button class='book-btn' onclick='selectForBooking(\"" +
      resourceID +
      "\"); event.stopPropagation();' style='background: linear-gradient(120deg, #ff4f9a, #ffb347); border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer;'>View Availability</button></td>";
    output += "</tr>";
  }
  output += "</tbody></table>";
  resultsDiv.innerHTML = output;
}

function selectForBooking(resourceID) {
  showpage("pageBooking");
  if (typeof fetchAvailability === "function") {
    fetchAvailability(resourceID);
  }
}
