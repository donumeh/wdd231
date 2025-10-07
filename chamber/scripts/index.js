document.addEventListener("DOMContentLoaded", () => {
  // Current Year for Footer
  const copyrightYearSpan = document.getElementById("copyright-year");
  if (copyrightYearSpan) {
    copyrightYearSpan.textContent = new Date().getFullYear();
  }

  // Last Modified Date for Footer
  const lastModifiedSpan = document.getElementById("last-modified");
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
  }

  // Hamburger Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // Theme Toggle
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
      } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
      }
    });

    // Apply saved theme on load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      themeToggle.textContent = "🌙";
    }
  }

  // Helper function to map numeric membership levels to strings
  const getMembershipLevelString = (level) => {
    switch (level) {
      case 3:
        return "Gold";
      case 2:
        return "Silver";
      case 1:
        return "Regular";
      default:
        return "Unknown";
    }
  };
});
