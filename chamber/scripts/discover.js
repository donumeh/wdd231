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
    // Create and show detailed modal (future enhancement)
    showAttractionDetails(attraction);
  } else {
    // Fallback alert
    alert(
      `Thank you for your interest in ${attractionName}! More detailed information coming soon.`,
    );
  }

  // Analytics tracking
}

/**
 * Show detailed information for an attraction (future modal implementation)
 * @param {Object} attraction - Attraction data object
 */
function showAttractionDetails(attraction) {
  // Future implementation: Create and show modal with detailed information
  // For now, show alert with basic info
  const message = `${attraction.name}\n\nLocation: ${attraction.address}\n\nDescription: ${attraction.description}`;
  alert(message);
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
