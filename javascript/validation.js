// Validation functions with multiple HTML events

// Email validation regex (non-trivial)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex (non-trivial - Swedish format)
const phoneRegex = /^(\+46|0)[1-9]\d{6,9}$/;

// Error messages container
let errorMessages = {};

// Initialize validation on page load
document.addEventListener("DOMContentLoaded", function () {
  setupValidation();
});

function setupValidation() {
  const registrationForm = document.getElementById("make-customer-form");
  if (!registrationForm) return;

  // Event 1: Input event - real-time validation
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", function (e) {
      validateEmail(e.target);
    });
  }

  // Event 2: Blur event - validate when leaving field
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("blur", function (e) {
      validatePhone(e.target);
    });
  }

  // Event 3: Keypress event - prevent invalid characters
  const firstNameInput = document.getElementById("firstName");
  if (firstNameInput) {
    firstNameInput.addEventListener("keypress", function (e) {
      // Allow only letters, spaces, and hyphens
      const char = String.fromCharCode(e.which);
      if (!/^[a-zA-Z\s-]$/.test(char)) {
        e.preventDefault();
        showFieldError(e.target, "Only letters, spaces, and hyphens allowed");
      } else {
        clearFieldError(e.target);
      }
    });
  }

  const lastNameInput = document.getElementById("lastName");
  if (lastNameInput) {
    lastNameInput.addEventListener("keypress", function (e) {
      const char = String.fromCharCode(e.which);
      if (!/^[a-zA-Z\s-]$/.test(char)) {
        e.preventDefault();
        showFieldError(e.target, "Only letters, spaces, and hyphens allowed");
      } else {
        clearFieldError(e.target);
      }
    });
  }

  // Event 4: Focus event - clear errors when focusing
  const inputs = registrationForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("focus", function (e) {
      clearFieldError(e.target);
    });
  });

  // Form submit validation
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      // If validation passes, call the original createCustomer function
      createCustomer();
    }
  });
}

function validateForm() {
  let isValid = true;
  errorMessages = {};

  // Validate first name
  const firstName = document.getElementById("firstName");
  if (!firstName || !firstName.value.trim()) {
    showFieldError(firstName, "First name is required");
    isValid = false;
  } else if (firstName.value.trim().length < 2) {
    showFieldError(firstName, "First name must be at least 2 characters");
    isValid = false;
  }

  // Validate last name
  const lastName = document.getElementById("lastName");
  if (!lastName || !lastName.value.trim()) {
    showFieldError(lastName, "Last name is required");
    isValid = false;
  } else if (lastName.value.trim().length < 2) {
    showFieldError(lastName, "Last name must be at least 2 characters");
    isValid = false;
  }

  // Validate email
  const email = document.getElementById("email");
  if (!email || !email.value.trim()) {
    showFieldError(email, "Email is required");
    isValid = false;
  } else if (!validateEmail(email)) {
    isValid = false;
  }

  // Validate phone
  const phone = document.getElementById("phone");
  if (phone && phone.value.trim() && !validatePhone(phone)) {
    isValid = false;
  }

  // Validate address
  const address = document.getElementById("address");
  if (!address || !address.value.trim()) {
    showFieldError(address, "Address is required");
    isValid = false;
  } else if (address.value.trim().length < 5) {
    showFieldError(address, "Address must be at least 5 characters");
    isValid = false;
  }

  return isValid;
}

function validateEmail(input) {
  if (!input) return false;

  const value = input.value.trim();

  if (!value) {
    showFieldError(input, "Email is required");
    return false;
  }

  if (!value.includes("@")) {
    showFieldError(input, "Email must contain @ symbol");
    return false;
  }

  if (!emailRegex.test(value)) {
    showFieldError(input, "Invalid email format. Example: name@example.com");
    return false;
  }

  clearFieldError(input);
  return true;
}

function validatePhone(input) {
  if (!input || !input.value.trim()) {
    return true; // Phone is optional
  }

  const value = input.value.trim().replace(/\s/g, ""); // Remove spaces

  if (!phoneRegex.test(value)) {
    showFieldError(
      input,
      "Invalid phone format. Use Swedish format: +46 70 123 45 67 or 070-123 45 67"
    );
    return false;
  }

  clearFieldError(input);
  return true;
}

function showFieldError(input, message) {
  if (!input) return;

  // Remove existing error
  clearFieldError(input);

  // Add error class
  input.style.borderColor = "#ff4f9a";
  input.style.boxShadow = "0 0 0 3px rgba(255, 79, 154, 0.2)";

  // Create error message element
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#ff4f9a";
  errorDiv.style.fontSize = "0.85rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = message;

  // Insert after input
  input.parentNode.appendChild(errorDiv);

  // Store error message
  errorMessages[input.id] = message;
}

function clearFieldError(input) {
  if (!input) return;

  input.style.borderColor = "";
  input.style.boxShadow = "";

  // Remove error message
  const errorDiv = input.parentNode.querySelector(".error-message");
  if (errorDiv) {
    errorDiv.remove();
  }

  delete errorMessages[input.id];
}
