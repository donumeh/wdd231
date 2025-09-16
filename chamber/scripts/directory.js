// Directory page JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the directory page
  initializeDirectory();
  updateFooterDates();
  setupNavigation();
});

let membersData = [];
let currentView = "grid";

// Initialize directory functionality
async function initializeDirectory() {
  try {
    showLoading();
    await fetchMembers();
    displayMembers(currentView);
    setupViewToggle();
    hideLoading();
  } catch (error) {
    console.error("Error initializing directory:", error);
    showError("Failed to load member directory. Please try again later.");
    hideLoading();
  }
}

// Fetch members data from JSON file
async function fetchMembers() {
  try {
    const response = await fetch("./data/members.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    membersData = await response.json();
    console.log("Members data loaded:", membersData.length, "members");
  } catch (error) {
    console.error("Error fetching members data:", error);
    throw error;
  }
}

// Display members in grid or list view
function displayMembers(viewType) {
  const container = document.getElementById("directory-container");
  if (!container) {
    console.error("Directory container not found");
    return;
  }

  container.innerHTML = "";

  if (viewType === "grid") {
    displayGridView(container);
  } else {
    displayListView(container);
  }
}

// Display members in grid view
function displayGridView(container) {
  const gridDiv = document.createElement("div");
  gridDiv.className = "directory-grid";
  gridDiv.id = "directory-grid";

  membersData.forEach((member) => {
    const memberCard = createMemberCard(member);
    gridDiv.appendChild(memberCard);
  });

  container.appendChild(gridDiv);
}

// Display members in list view
function displayListView(container) {
  const listDiv = document.createElement("div");
  listDiv.className = "directory-list active";
  listDiv.id = "directory-list";

  membersData.forEach((member) => {
    const memberListItem = createMemberListItem(member);
    listDiv.appendChild(memberListItem);
  });

  container.appendChild(listDiv);
}

// Create member card for grid view
function createMemberCard(member) {
  const card = document.createElement("div");
  card.className = "member-card";

  const membershipText = getMembershipText(member.membershipLevel);
  const membershipClass = getMembershipClass(member.membershipLevel);

  card.innerHTML = `
        <div class="membership-badge ${membershipClass}">${membershipText}</div>

        <div class="business-image">
            <span>🏢</span>
        </div>

        <h3>${member.name}</h3>
        <p class="business-description">${member.description}</p>

        <div class="contact-info">
            <span><strong>📍</strong> ${member.address}</span>
            <span><strong>📞</strong> <a href="tel:${member.phone}">${member.phone}</a></span>
            <span><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener">${getDomainFromURL(member.website)}</a></span>
            <span><strong>📅</strong> Est. ${member.yearEstablished}</span>
        </div>

        <div class="services-list">
            ${member.services.map((service) => `<span class="service-tag">${service}</span>`).join("")}
        </div>
    `;

  return card;
}

// Create member list item for list view
function createMemberListItem(member) {
  const listItem = document.createElement("div");
  listItem.className = "member-list-item";

  listItem.innerHTML = `
        <div class="business-image">
            <span>🏢</span>
        </div>

        <div class="list-item-info">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>Est. ${member.yearEstablished} • ${getMembershipText(member.membershipLevel)} Member</p>
        </div>

        <div class="list-item-contacts">
            <a href="tel:${member.phone}">${member.phone}</a>
            <a href="${member.website}" target="_blank" rel="noopener">${getDomainFromURL(member.website)}</a>
        </div>
    `;

  return listItem;
}

// Setup view toggle functionality
function setupViewToggle() {
  const gridBtn = document.getElementById("grid-view");
  const listBtn = document.getElementById("list-view");

  if (!gridBtn || !listBtn) {
    console.error("View toggle buttons not found");
    return;
  }

  gridBtn.addEventListener("click", () => {
    if (currentView !== "grid") {
      currentView = "grid";
      updateViewToggle();
      displayMembers("grid");
    }
  });

  listBtn.addEventListener("click", () => {
    if (currentView !== "list") {
      currentView = "list";
      updateViewToggle();
      displayMembers("list");
    }
  });

  // Set initial state
  updateViewToggle();
}

// Update view toggle button states
function updateViewToggle() {
  const gridBtn = document.getElementById("grid-view");
  const listBtn = document.getElementById("list-view");

  if (gridBtn && listBtn) {
    gridBtn.classList.toggle("active", currentView === "grid");
    listBtn.classList.toggle("active", currentView === "list");
  }
}

// Get membership level text
function getMembershipText(level) {
  switch (level) {
    case 3:
      return "Gold";
    case 2:
      return "Silver";
    case 1:
      return "Member";
    default:
      return "Member";
  }
}

// Get membership level CSS class
function getMembershipClass(level) {
  switch (level) {
    case 3:
      return "gold";
    case 2:
      return "silver";
    case 1:
      return "member";
    default:
      return "member";
  }
}

// Extract domain from URL
function getDomainFromURL(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch (error) {
    return url;
  }
}

// Show loading spinner
function showLoading() {
  const container = document.getElementById("directory-container");
  if (container) {
    container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
  }
}

// Hide loading spinner
function hideLoading() {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
}

// Show error message
function showError(message) {
  const container = document.getElementById("directory-container");
  if (container) {
    container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: #d32f2f;">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
  }
}

// Update footer with current year and last modification
function updateFooterDates() {
  const currentYear = new Date().getFullYear();
  const lastModified = new Date(document.lastModified);

  // Update copyright year
  const copyrightElement = document.getElementById("copyright-year");
  if (copyrightElement) {
    copyrightElement.textContent = currentYear;
  }

  // Update last modified date
  const lastModifiedElement = document.getElementById("last-modified");
  if (lastModifiedElement) {
    const formattedDate = lastModified.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    lastModifiedElement.textContent = formattedDate;
  }
}

// Setup responsive navigation
function setupNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      // Animate hamburger icon
      const spans = hamburger.querySelectorAll("span");
      spans.forEach((span, index) => {
        if (navMenu.classList.contains("active")) {
          if (index === 0)
            span.style.transform = "rotate(45deg) translate(5px, 5px)";
          if (index === 1) span.style.opacity = "0";
          if (index === 2)
            span.style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
          span.style.transform = "none";
          span.style.opacity = "1";
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");

        // Reset hamburger icon
        const spans = hamburger.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      }
    });

    // Close menu when window is resized to desktop view
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");

        // Reset hamburger icon
        const spans = hamburger.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      }
    });
  }
}

// Theme toggle functionality (bonus feature)
function setupThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      // Save preference to localStorage
      const isDarkMode = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      document.body.classList.add("dark-mode");
    }
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener("DOMContentLoaded", setupThemeToggle);

// Filter members by membership level (bonus feature)
function filterByMembership(level) {
  const filteredMembers =
    level === "all"
      ? membersData
      : membersData.filter((member) => member.membershipLevel === level);

  // Temporarily store original data and replace with filtered data
  const originalData = membersData;
  membersData = filteredMembers;
  displayMembers(currentView);
  membersData = originalData;
}

// Search functionality (bonus feature)
function searchMembers(searchTerm) {
  const filteredMembers = membersData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.services.some((service) =>
        service.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // Temporarily store original data and replace with filtered data
  const originalData = membersData;
  membersData = filteredMembers;
  displayMembers(currentView);
  membersData = originalData;
}

// Export functions for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchMembers,
    displayMembers,
    filterByMembership,
    searchMembers,
  };
}
