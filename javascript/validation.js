// Regex registry
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(\+46|0)[1-9]\d{6,9}$/;
const numberRegex = /^[0-9]$/;
const postalCodeRegex = /^\d{5}$/;

// event listeners
// intit of form validation
document.addEventListener("DOMContentLoaded", setupRegistrationFormValidation);

// initializes live-form validation
function setupRegistrationFormValidation() {
  const form = document.getElementById("make-customer-form");
  if (!form) return;

  // Event driven validation
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", (e) => validateEmailField(e.target));
  }

  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("blur", (e) => validatePhoneField(e.target));
  }

  const postalCodeInput = document.getElementById("postalCode");
  if (postalCodeInput) {
    postalCodeInput.addEventListener("keypress", (e) => {
      if (e.key.match(numberRegex) != null) {
        clearValidationError(postalCodeInput);
      } else {
        e.preventDefault();
        displayValidationError(postalCodeInput, "Only numbers allowed");
      }
    });
  }

  const countrySelect = document.getElementById("country");
  if (countrySelect) {
    countrySelect.addEventListener("change", (e) => {
      if (e.target.value == "") {
        displayValidationError(countrySelect, "Please select a country");
      } else {
        clearValidationError(countrySelect);
      }
    });
  }

  const termsCheckbox = document.getElementById("terms-of-service");
  if (termsCheckbox) {
    termsCheckbox.addEventListener("click", (e) => {
      if (!e.target.checked) {
        displayValidationError(termsCheckbox, "You must accept the terms");
      } else {
        clearValidationError(termsCheckbox);
      }
    });
  }

  // remove error message when field is in focus
  form.querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener("focus", (e) => clearValidationError(e.target));
  });

  // validates the registration before submitting
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    //creates customer if(func) returns true
    if (validateRegistrationForm()) {
      createCustomer();
    }
  });
}

function validateRegistrationForm() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const postalCode = document.getElementById("postalCode");
  const country = document.getElementById("country");
  const address = document.getElementById("address");
  const termsCheckbox = document.getElementById("terms-of-service");

  // bool controls from send outcome
  // if it goes through checks and returns true its a valid customer
  let isValid = true;

  if (firstName?.value.trim().length < 2) {
    displayValidationError(
      firstName,
      "We dont accept names less than 2 characters"
    );
    isValid = false;
  }

  if (lastName?.value.trim().length < 2) {
    displayValidationError(
      lastName,
      "We dont accept names less than 2 characters"
    );
    isValid = false;
  }

  if (!validateEmailField(email)) {
    isValid = false;
  }

  if (!validatePhoneField(phone)) {
    isValid = false;
  }

  if (postalCode?.value) {
    const postalValue = postalCode.value.toString();
    if (
      postalValue.match(postalCodeRegex) == null ||
      postalValue < 10000 ||
      postalValue > 99999
    ) {
      displayValidationError(
        postalCode,
        "Postal code must be 5 digits (10000-99999)"
      );
      isValid = false;
    }
  }

  if (!country?.value) {
    displayValidationError(country, "Please select a country");
    isValid = false;
  }

  if (!address?.value.trim()) {
    displayValidationError(address, "Address is required");
    isValid = false;
  } else if (address.value.trim().length < 5) {
    displayValidationError(address, "Address must be at least 5 characters");
    isValid = false;
  }

  if (!termsCheckbox?.checked) {
    displayValidationError(
      termsCheckbox,
      "You must accept the terms of service"
    );
    isValid = false;
  }

  return isValid;
}

function validateEmailField(input) {
  if (!input) return false;

  const value = input.value.trim();
  if (!value) {
    displayValidationError(input, "Email is required");
    return false;
  }

  // Match is null if there is no match
  if (value.match(emailRegex) != null) {
    clearValidationError(input);
    return true;
  } else {
    displayValidationError(
      input,
      "Invalid email format. Example: name@example.com"
    );
    return false;
  }
}

function validatePhoneField(input) {
  if (!input?.value.trim()) return true; // not needed
  const value = input.value.trim().replace(/\s/g, ""); // reonove all WS
  // Match is null if there is no match
  if (value.match(phoneRegex) != null) {
    clearValidationError(input);
    return true;
  } else {
    displayValidationError(
      input,
      "Invalid phone format. Use Swedish format: +46 70 123 45 67 or 070-123 45 67"
    );
    return false;
  }
}

function displayValidationError(input, message) {
  if (!input) return;

  // clear any previous errors
  clearValidationError(input);

  // prepare element
  input.style.borderColor = "#ff4f9a";
  input.style.boxShadow = "0 0 0 3px rgba(255, 79, 154, 0.2)";

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#ff4f9a";
  errorDiv.style.fontSize = "0.85rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = message;

  // attach element to the input div
  input.parentNode.appendChild(errorDiv);
}

function clearValidationError(input) {
  if (!input) return;

  input.style.borderColor = "";
  input.style.boxShadow = "";

  const errorDiv = input.parentNode.querySelector(".error-message");
  if (errorDiv) errorDiv.remove();
}
