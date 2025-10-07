// Set timestamp when form loads
document.addEventListener("DOMContentLoaded", function () {
  const timestampField = document.getElementById("timestamp");
  const currentDateTime = new Date().toISOString();
  timestampField.value = currentDateTime;

  // Update copyright year and last modified date
  const currentYear = new Date().getFullYear();
  const lastModified = new Date(document.lastModified);

  document.getElementById("copyright-year").textContent = currentYear;
  document.getElementById("last-modified").textContent =
    lastModified.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
});

// Modal functionality
const modals = document.querySelectorAll(".modal");
const modalTriggers = document.querySelectorAll("[data-modal]");
const closeBtns = document.querySelectorAll(".close");

// Open modal
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", function (e) {
    e.preventDefault();
    const modalId = this.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  });
});

// Close modal
closeBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const modalId = this.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Restore scrolling
    }
  });
});

// Close modal when clicking outside of it
window.addEventListener("click", function (e) {
  modals.forEach((modal) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Restore scrolling
    }
  });
});

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    modals.forEach((modal) => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});

// Form validation and enhancement
const form = document.getElementById("membershipForm");
const orgTitleField = document.getElementById("org_title");

// Custom validation message for organization title
orgTitleField.addEventListener("invalid", function () {
  if (this.validity.patternMismatch) {
    this.setCustomValidity(
      "Organization title must be at least 7 characters long and contain only letters, hyphens, and spaces.",
    );
  } else {
    this.setCustomValidity("");
  }
});

orgTitleField.addEventListener("input", function () {
  this.setCustomValidity("");
});

// Hamburger menu functionality (if exists)
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}
