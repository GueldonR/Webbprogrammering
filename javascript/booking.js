// Booking functionality

function makeBooking(resourceID, date, dateto, position) {
  const customerID = localStorage.getItem("user_id");

  if (!customerID) {
    alert("Please log in first");
    showpage("pageLogin");
    return;
  }

  const resultDiv = document.getElementById("booking-result");
  resultDiv.innerHTML =
    '<div class="loading-spinner">Processing booking...</div>';

  const input = {
    customerID: customerID,
    resourceID: resourceID,
    date: date.replace("T", " "),
    dateto: (dateto || date).replace("T", " "),
    position: position,
    status: "2",
    type: apptype,
    rebate: "UNK",
    auxdata: "",
  };

  fetch("../API/booking/makebooking_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      return response.ok
        ? response.text()
        : Promise.reject(response.statusText);
    })
    .then(function (xmlText) {
      const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
      const result = xmlDoc.getElementsByTagName("result")[0];

      if (result) {
        const bookingcost = result.getAttribute("bookingcost");
        resultDiv.innerHTML = `
          <div style="background: rgba(54, 240, 232, 0.1); border: 1px solid #36f0e8; border-radius: 1rem; padding: 1.5rem; color: #f5f7ff;">
            <h3 style="color: #36f0e8; margin-bottom: 1rem;">Booking Successful!</h3>
            <p><strong>Cost:</strong> ${bookingcost} SEK</p>
            <button onclick="showpage('pageMyPage')" class="primary-action" style="margin-top: 1rem;">View My Bookings</button>
          </div>
        `;
      } else {
        const error = xmlDoc.getElementsByTagName("error")[0];
        resultDiv.innerHTML = `<p style="color: #ff4f9a;">Error: ${
          error ? error.textContent : "Booking failed"
        }</p>`;
      }
    })
    .catch(function (error) {
      resultDiv.innerHTML = `<p style="color: #ff4f9a;">Request failed: ${error}</p>`;
    });
}

// Fetch availability for a resource
function fetchAvailability(resourceID) {
  if (!resourceID) return;

  const availabilityDiv = document.getElementById("availability-results");
  if (availabilityDiv) {
    availabilityDiv.innerHTML = '<div class="loading-spinner">Loading...</div>';
  }

  fetch("../API/booking/getavailability_search_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resid: resourceID, type: apptype }),
  })
    .then(function (response) {
      return response.ok
        ? response.text()
        : Promise.reject(response.statusText);
    })
    .then(function (xmlText) {
      const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
      if (typeof fixChars === "function") fixChars(xmlDoc);
      displayAvailableDates(xmlDoc, resourceID);
    })
    .catch(function (error) {
      if (availabilityDiv) {
        availabilityDiv.innerHTML =
          '<p style="color: #ff4f9a;">Error: ' + error + "</p>";
      }
    });
}

// Display available dates as clickable elements
function displayAvailableDates(availabilityXML, resourceID) {
  const availabilityDiv = document.getElementById("availability-results");
  if (!availabilityDiv) return;

  const availabilities = availabilityXML.getElementsByTagName("availability");
  const availableDates = [];

  for (let i = 0; i < availabilities.length; i++) {
    const avail = availabilities[i];
    const remaining = parseInt(avail.getAttribute("remaining") || "0");
    if (remaining > 0) {
      availableDates.push({
        date: avail.getAttribute("date").replace(" ", "T"),
        dateto: (
          avail.getAttribute("dateto") || avail.getAttribute("date")
        ).replace(" ", "T"),
        remaining: remaining,
        cost: avail.getAttribute("cost"),
      });
    }
  }

  availableDates.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (availableDates.length === 0) {
    availabilityDiv.innerHTML =
      '<p style="color: #b7bfd6;">No available dates found.</p>';
    return;
  }

  let output =
    '<h3 style="color: #f5f7ff; margin-bottom: 1rem;">Available Dates - Click to Book</h3><div>';
  availableDates.forEach((d) => {
    output += `<button class="availability-btn" onclick='selectAvailableDate("${
      d.date
    }", "${d.dateto}", ${
      d.remaining
    }, "${resourceID}")' style="display: block; width: 100%; margin-bottom: 0.5rem; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f7ff; cursor: pointer; text-align: left;">${d.date.replace(
      "T",
      " "
    )} - Available: ${d.remaining} - ${d.cost} SEK</button>`;
  });
  output += "</div>";
  availabilityDiv.innerHTML = output;
}

// Select an available date and create booking directly
function selectAvailableDate(dateStr, datetoStr, remaining, resourceID) {
  makeBooking(resourceID, dateStr, datetoStr, remaining);
}
