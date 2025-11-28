// Booking functionality

// Initialize booking form
document.addEventListener("DOMContentLoaded", function () {
  setupBookingForm();
});

function setupBookingForm() {
  const bookingForm = document.getElementById("booking-form");
  if (!bookingForm) return;

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    makeBooking();
  });

  // Auto-fill dateto if empty
  const dateInput = document.getElementById("booking-date");
  const datetoInput = document.getElementById("booking-dateto");

  if (dateInput && datetoInput) {
    dateInput.addEventListener("change", function () {
      if (!datetoInput.value) {
        datetoInput.value = dateInput.value;
      }
    });
  }
}

function makeBooking() {
  const customerID = localStorage.getItem("user_id");

  if (!customerID) {
    alert("Please log in first");
    showpage("pageLogin");
    return;
  }

  const resourceID = document.getElementById("booking-resourceID").value;
  const date = document.getElementById("booking-date").value;
  const dateto = document.getElementById("booking-dateto").value || date;
  const position = document.getElementById("booking-position").value;
  const status = document.getElementById("booking-status").value;

  if (!resourceID || !date || !position || !status) {
    alert("Please fill in all required fields");
    return;
  }

  // Show loading animation before search is preformed
  const resultDiv = document.getElementById("booking-result");
  resultDiv.innerHTML =
    '<div class="loading-spinner">Processing booking...</div>';
  resultDiv.style.opacity = "0";
  setTimeout(() => {
    resultDiv.style.opacity = "1";
  }, 100);

  const input = {
    customerID: customerID,
    resourceID: resourceID,
    date: date.replace("T", " "),
    dateto: dateto.replace("T", " ") || date.replace("T", " "),
    position: position,
    status: status,
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
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (xmlText) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const result = xmlDoc.getElementsByTagName("result")[0];

      if (result) {
        const size = result.getAttribute("size");
        const bookingcost = result.getAttribute("bookingcost");
        const remaining = result.getAttribute("remaining");

        resultDiv.innerHTML = `
          <div style="background: rgba(54, 240, 232, 0.1); border: 1px solid #36f0e8; border-radius: 1rem; padding: 1.5rem; color: #f5f7ff;">
            <h3 style="color: #36f0e8; margin-bottom: 1rem;">Booking Successful!</h3>
            <p><strong>Cost:</strong> ${bookingcost} SEK</p>
            <p><strong>Total Size:</strong> ${size}</p>
            <p><strong>Remaining:</strong> ${remaining}</p>
            <button onclick="showpage('pageMyPage')" class="primary-action" style="margin-top: 1rem;">
              View My Bookings
            </button>
          </div>
        `;
      } else {
        const error = xmlDoc.getElementsByTagName("error")[0];
        if (error) {
          resultDiv.innerHTML = `<p style="color: #ff4f9a;">Error: ${error.textContent}</p>`;
        } else {
          resultDiv.innerHTML = `<p style="color: #ff4f9a;">Booking failed. Please try again.</p>`;
        }
      }
    })
    .catch(function (error) {
      resultDiv.innerHTML = `<p style="color: #ff4f9a;">Request failed: ${error}</p>`;
    });
}
