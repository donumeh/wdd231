// Discover Page JavaScript - Ibadan Chamber of Commerce
// Author: Emeka MacDonald Umeh

// Global variables
let attractions = [];

/**
 * Initialize the discover page functionality
 */
document.addEventListener("DOMContentLoaded", function () {
  updateFooterDates();
  handleVisitorMessage();
  loadAttractions();
  setupNavigation();
  setupAccessibility();
});

/**
 * Update footer copyright year and last modified date
 */
function updateFooterDates() {
  const currentYear = new Date().getFullYear();
  const lastModified = new Date(document.lastModified);

  const copyrightYear = document.getElementById("copyright-year");
  const lastModifiedSpan = document.getElementById("last-modified");

  if (copyrightYear) {
    copyrightYear.textContent = currentYear;
  }

  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = lastModified.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Handle visitor message display using localStorage
 */
function handleVisitorMessage() {
  const messageDiv = document.getElementById("visitorMessage");
  const messageText = document.getElementById("messageText");
  const lastVisitKey = "ibadan-chamber-last-visit";

  // Get current time and last visit time
  const now = Date.now();
  const lastVisit = localStorage.getItem(lastVisitKey);

  let message = "";

  if (!lastVisit) {
    // First time visitor
    message = "Welcome! Let us know if you have any questions.";
  } else {
    // Calculate days between visits
    const lastVisitDate = new Date(parseInt(lastVisit));
    const currentDate = new Date(now);
    const timeDiff = currentDate - lastVisitDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
      // Less than a day since last visit
      message = "Back so soon! Awesome!";
    } else if (daysDiff === 1) {
      // Exactly 1 day ago
      message = "You last visited 1 day ago.";
    } else {
      // More than 1 day ago
      message = `You last visited ${daysDiff} days ago.`;
    }
  }

  // Display the message
  if (messageText && messageDiv) {
    messageText.textContent = message;
    messageDiv.style.display = "block";
  }

  // Store current visit timestamp
  localStorage.setItem(lastVisitKey, now.toString());
}

/**
 * Close the visitor message banner
 */
function closeVisitorMessage() {
  const messageDiv = document.getElementById("visitorMessage");
  if (messageDiv) {
    messageDiv.style.display = "none";
  }
}

/**
 * Load attractions data from JSON file
 */
async function loadAttractions() {
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const gridDiv = document.getElementById("attractionsGrid");

  try {
    // Show loading state
    showLoadingState();

    // Fetch attractions data
    const response = await fetch("./data/attractions.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    attractions = await response.json();

    // Validate data structure
    if (!Array.isArray(attractions) || attractions.length === 0) {
      throw new Error("Invalid attractions data structure");
    }

    // Display attractions
    displayAttractions(attractions);
    showContentState();
  } catch (error) {
    console.error("Error loading attractions:", error);
    showErrorState();

    // Fallback to placeholder data after delay
    setTimeout(() => {
      createFallbackAttractions();
    }, 2000);
  }
}

/**
 * Display loading state
 */
function showLoadingState() {
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const gridDiv = document.getElementById("attractionsGrid");

  if (loadingDiv) loadingDiv.style.display = "block";
  if (errorDiv) errorDiv.style.display = "none";
  if (gridDiv) gridDiv.style.display = "none";
}

/**
 * Display error state
 */
function showErrorState() {
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");

  if (loadingDiv) loadingDiv.style.display = "none";
  if (errorDiv) errorDiv.style.display = "block";
}

/**
 * Display content state
 */
function showContentState() {
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const gridDiv = document.getElementById("attractionsGrid");

  if (loadingDiv) loadingDiv.style.display = "none";
  if (errorDiv) errorDiv.style.display = "none";
  if (gridDiv) gridDiv.style.display = "grid";
}

/**
 * Display attractions in the grid layout
 * @param {Array} attractionsData - Array of attraction objects
 */
function displayAttractions(attractionsData) {
  const gridDiv = document.getElementById("attractionsGrid");
  if (!gridDiv) {
    console.error("Attractions grid container not found");
    return;
  }

  gridDiv.innerHTML = "";

  attractionsData.forEach((attraction) => {
    const card = createAttractionCard(attraction);
    gridDiv.appendChild(card);
  });

  // Setup lazy loading for images
  setupLazyLoading();
}

/**
 * Create an attraction card element
 * @param {Object} attraction - Attraction data object
 * @returns {HTMLElement} - Created card element
 */
function createAttractionCard(attraction) {
  const card = document.createElement("div");
  card.className = "attraction-card";
  card.setAttribute("data-attraction-id", attraction.id);
  card.setAttribute("role", "article");
  card.setAttribute("aria-labelledby", `attraction-${attraction.id}-title`);

  // Generate placeholder image URL with attraction name
  const placeholderUrl = `./images/attractions/${attraction.image}`;

  card.innerHTML = `
        <figure>
            <img
                src="${placeholderUrl}"
                alt="${attraction.imageAlt || attraction.name}"
                loading="lazy"
                onerror="handleImageError(this)"
                width="300"
                height="200"
            />
        </figure>
        <h2 id="attraction-${attraction.id}-title">${escapeHtml(attraction.name)}</h2>
        <address>${escapeHtml(attraction.address)}</address>
        <p>${escapeHtml(attraction.description)}</p>
        <button onclick="learnMore('${escapeHtml(attraction.name)}')" aria-label="Learn more about ${escapeHtml(attraction.name)}">
            Learn More
        </button>
    `;

  return card;
}

/**
 * Handle "Learn More" button clicks
 * @param {string} attractionName - Name of the attraction
 */
function learnMore(attractionName) {
  // Find the attraction data
  const attraction = attractions.find((a) => a.name === attractionName);

  if (attraction) {
    showAttractionModal(attraction);
  } else {
    console.error("Attraction not found:", attractionName);
  }

  // Analytics tracking
  console.log(`User clicked Learn More for: ${attractionName}`);
}

/**
 * Show detailed information for an attraction in modal
 * @param {Object} attraction - Attraction data object
 */
function showAttractionModal(attraction) {
  const modal = document.getElementById("attractionModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = modal.querySelector("#modalImage img");
  const modalAddress = document.getElementById("modalAddress");
  const modalDescription = document.getElementById("modalDescription");
  const modalExtraInfo = document.getElementById("modalExtraInfo");

  if (!modal) {
    console.error("Modal element not found");
    return;
  }

  // Populate modal content
  modalTitle.textContent = attraction.name;

  // Set image with fallback
  const placeholderUrl = `https://via.placeholder.com/600x250/2c5530/ffffff?text=${encodeURIComponent(attraction.name)}`;
  modalImage.src = placeholderUrl;
  modalImage.alt = attraction.imageAlt || attraction.name;
  modalImage.onerror = function () {
    this.src = placeholderUrl;
  };

  modalAddress.textContent = attraction.address;
  modalDescription.textContent = attraction.description;

  // Add extra information based on attraction type
  modalExtraInfo.innerHTML = generateExtraInfo(attraction);

  // Show the modal
  modal.showModal();

  // Focus management for accessibility
  const closeBtn = document.getElementById("closeModal");
  if (closeBtn) {
    closeBtn.focus();
  }
  setupModalFunctionality();
}

/**
 * Generate additional information for attractions
 * @param {Object} attraction - Attraction data object
 * @returns {string} HTML content for extra info
 */
function generateExtraInfo(attraction) {
  const infoMap = {
    "University of Ibadan": {
      title: "Quick Facts",
      items: [
        "Established in 1948",
        "First university in Nigeria",
        "Famous Trenchard Hall",
        "Largest university library in Africa",
        "Beautiful botanical gardens",
      ],
    },
    "Cocoa House": {
      title: "Building Features",
      items: [
        "26 floors tall",
        "First skyscraper in tropical Africa",
        "Built from cocoa export revenues",
        "Iconic Ibadan landmark",
        "Panoramic city views",
      ],
    },
    "Mapo Hall": {
      title: "Historical Significance",
      items: [
        "Built in 1929",
        "Colonial administrative center",
        "360-degree city views",
        "Cultural heritage site",
        "Traditional ceremonies venue",
      ],
    },
    "Agodi Gardens": {
      title: "Facilities & Activities",
      items: [
        "Beautiful botanical gardens",
        "Recreational lake",
        "Children's playground",
        "Wildlife viewing",
        "Perfect for family picnics",
      ],
    },
    "National Museum Ibadan": {
      title: "Collections & Exhibits",
      items: [
        "Traditional Nigerian artifacts",
        "Archaeological findings",
        "Cultural heritage displays",
        "Ancient kingdoms exhibits",
        "Traditional crafts showcase",
      ],
    },
    "Trans Wonderland Amusement Park": {
      title: "Attractions & Rides",
      items: [
        "Thrilling roller coasters",
        "Water slides and pools",
        "Family-friendly rides",
        "Adventure activities",
        "Food courts and restaurants",
      ],
    },
    "Bower Memorial Tower": {
      title: "Tower Information",
      items: [
        "60 feet tall",
        "Built in 1936",
        "Memorial to Captain Bower",
        "Spectacular city views",
        "Historical landmark",
      ],
    },
    "Ibadan Golf Club": {
      title: "Golf Course Details",
      items: [
        "Established in 1932",
        "18-hole championship course",
        "Beautiful landscaping",
        "Professional tournaments",
        "Business networking venue",
      ],
    },
  };

  const info = infoMap[attraction.name];
  if (!info) {
    return "<h3>Additional Information</h3><p>More details coming soon!</p>";
  }

  const itemsList = info.items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  return `
        <h3>${escapeHtml(info.title)}</h3>
        <ul>${itemsList}</ul>
    `;
}

/**
 * Handle image loading errors
 * @param {HTMLImageElement} img - Image element that failed to load
 */
function handleImageError(img) {
  img.setAttribute("data-placeholder", "true");
  const altText = img.alt || "Ibadan Attraction";
  img.src = `https://via.placeholder.com/300x200/2c5530/ffffff?text=${encodeURIComponent(altText)}`;
}

/**
 * Create fallback attractions when JSON fails to load
 */
function createFallbackAttractions() {
  const fallbackAttractions = [
    {
      id: 1,
      name: "University of Ibadan",
      address: "University Road, Ibadan, Oyo State, Nigeria",
      description:
        "Nigeria's premier university established in 1948, renowned for academic excellence and beautiful campus.",
      image: "university-ibadan.webp",
      imageAlt: "University of Ibadan main entrance",
    },
    {
      id: 2,
      name: "Cocoa House",
      address: "Dugbe, Ibadan, Oyo State, Nigeria",
      description:
        "Iconic 26-storey skyscraper, the first of its kind in tropical Africa, built from cocoa export revenues.",
      image: "cocoa-house.webp",
      imageAlt: "Cocoa House towering over Ibadan skyline",
    },
    {
      id: 3,
      name: "Mapo Hall",
      address: "Mapo Hill, Ibadan, Oyo State, Nigeria",
      description:
        "Historic town hall built in 1929, offering panoramic views of Ibadan and rich administrative heritage.",
      image: "mapo-hall.webp",
      imageAlt: "Historic Mapo Hall on the hill",
    },
    {
      id: 4,
      name: "Agodi Gardens",
      address: "Agodi GRA, Ibadan, Oyo State, Nigeria",
      description:
        "Beautiful recreational park featuring gardens, lake, children's playground, and various wildlife.",
      image: "agodi-gardens.webp",
      imageAlt: "Serene lake and gardens at Agodi",
    },
    {
      id: 5,
      name: "National Museum Ibadan",
      address: "University of Ibadan, Ibadan, Oyo State, Nigeria",
      description:
        "Extensive collection of Nigerian artifacts, traditional art, and archaeological findings.",
      image: "national-museum.webp",
      imageAlt: "Traditional artifacts at National Museum",
    },
    {
      id: 6,
      name: "Trans Wonderland Amusement Park",
      address: "Liberty Road, Challenge, Ibadan, Oyo State, Nigeria",
      description:
        "Nigeria's premier amusement park with thrilling rides, water attractions, and family entertainment.",
      image: "trans-wonderland.webp",
      imageAlt: "Colorful rides at Trans Wonderland",
    },
    {
      id: 7,
      name: "Bower Memorial Tower",
      address: "Oke Are, Ibadan, Oyo State, Nigeria",
      description:
        "60-foot tower built in 1936, offering spectacular 360-degree views of the ancient city.",
      image: "bower-tower.webp",
      imageAlt: "Bower Memorial Tower against blue sky",
    },
    {
      id: 8,
      name: "Ibadan Golf Club",
      address: "Jericho GRA, Ibadan, Oyo State, Nigeria",
      description:
        "Historic 18-hole championship golf course established in 1932, perfect for golf enthusiasts.",
      image: "ibadan-golf-club.webp",
      imageAlt: "Well-maintained golf course fairways",
    },
  ];

  attractions = fallbackAttractions;
  displayAttractions(fallbackAttractions);
  showContentState();
}

/**
 * Setup navigation functionality
 */
function setupNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Update ARIA attributes for accessibility
      const isExpanded = hamburger.classList.contains("active");
      hamburger.setAttribute("aria-expanded", isExpanded);
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.focus();
      }
    });
  }

  // Setup modal functionality
  setupModalFunctionality();
}

/**
 * Setup modal event listeners
 */
function setupModalFunctionality() {
  const modal = document.getElementById("attractionModal");
  const closeBtn = document.getElementById("closeModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  if (!modal) return;

  // Close modal function
  function closeModal() {
    modal.close();
  }

  // Close button event listeners
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  // Close on backdrop click
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  modal.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Trap focus within modal when open
  modal.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      trapFocusInModal(e, modal);
    }
  });
}

/**
 * Trap focus within modal for accessibility
 * @param {KeyboardEvent} e - The keyboard event
 * @param {HTMLElement} modal - The modal element
 */
function trapFocusInModal(e, modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
}

/**
 * Setup lazy loading for images using Intersection Observer
 */
function setupLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const originalSrc = img.dataset.originalSrc;

            if (originalSrc) {
              // Try to load the original image
              const tempImage = new Image();
              tempImage.onload = function () {
                img.src = originalSrc;
                img.removeAttribute("data-original-src");
              };
              tempImage.onerror = function () {};
              tempImage.src = originalSrc;
            }

            imageObserver.unobserve(img);
          }
        });
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      },
    );

    // Observe all images
    const images = document.querySelectorAll(".attraction-card img");
    images.forEach((img) => imageObserver.observe(img));
  }
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
  // Keyboard navigation for attraction cards
  document.addEventListener("keydown", function (e) {
    const focused = document.activeElement;

    // Handle Enter and Space key on Learn More buttons
    if (
      (e.key === "Enter" || e.key === " ") &&
      focused.tagName === "BUTTON" &&
      focused.textContent.includes("Learn More")
    ) {
      e.preventDefault();
      focused.click();
    }
  });

  // Announce dynamic content changes to screen readers
  const gridDiv = document.getElementById("attractionsGrid");
  if (gridDiv) {
    gridDiv.setAttribute("aria-live", "polite");
    gridDiv.setAttribute("aria-label", "Ibadan attractions gallery");
  }

  // Modal accessibility attributes
  const modal = document.getElementById("attractionModal");
  if (modal) {
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "modalTitle");
  }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} unsafe - Unsafe string
 * @returns {string} - Escaped string
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") {
    return unsafe;
  }

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Performance optimization - debounced resize handler
 */
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    // Handle resize-specific optimizations

    // Could implement dynamic grid adjustments here if needed
    const gridDiv = document.getElementById("attractionsGrid");
    if (gridDiv && window.innerWidth < 640) {
      gridDiv.setAttribute("aria-label", "Ibadan attractions list");
    } else {
      gridDiv.setAttribute("aria-label", "Ibadan attractions gallery");
    }
  }, 250);
});
