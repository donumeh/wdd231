// EcoRiders Club - Main JavaScript Module
// Comprehensive implementation with API fetching, local storage, modals, and dynamic content

import { RideManager } from "./modules/rideManager.js";
import { ModalManager } from "./modules/modalManager.js";
import { StorageManager } from "./modules/storageManager.js";

class EcoRidersApp {
  constructor() {
    this.rideManager = new RideManager();
    this.modalManager = new ModalManager();
    this.storageManager = new StorageManager();
    this.rides = [];
    this.currentUser = this.storageManager.getUser() || {};
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be fully loaded
      await this.waitForDOM();

      // Initialize all components
      this.initializeNavigation();
      this.initializeForms();
      this.initializeModals();
      this.loadUserPreferences();

      // Fetch and display rides data
      await this.loadRidesData();

      // Setup event listeners
      this.setupEventListeners();

      console.log("🚴‍♀️ EcoRiders Club App Initialized Successfully! 🚴‍♂️");
    } catch (error) {
      console.error("Error initializing app:", error);
      this.showNotification(
        "Error loading application. Please refresh the page.",
        "error",
      );
    }
  }

  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }

  // API Data Fetching with try-catch and async handling
  async loadRidesData() {
    try {
      console.log("Fetching rides data...");

      // Fetch data from local JSON file (simulating API)
      const response = await fetch("data/rides.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.rides = data.rides;

      // Use array methods to process and display data
      this.processAndDisplayRides();

      console.log(`Successfully loaded ${this.rides.length} rides`);
    } catch (error) {
      console.error("Error fetching rides data:", error);
      this.handleDataFetchError();
    }
  }

  handleDataFetchError() {
    // Fallback to stored data or show error
    const storedRides = this.storageManager.getRides();

    if (storedRides && storedRides.length > 0) {
      this.rides = storedRides;
      this.processAndDisplayRides();
      this.showNotification(
        "Using cached ride data. Some information may be outdated.",
        "info",
      );
    } else {
      this.showNotification(
        "Unable to load ride data. Please check your connection and try again.",
        "error",
      );
      this.displayFallbackContent();
    }
  }

  // Dynamic Content Generation - Display at least 15 items with 4+ properties each
  processAndDisplayRides() {
    const ridesGrid = document.querySelector(".rides-grid");
    if (!ridesGrid) return;

    // Filter and map rides using array methods
    const upcomingRides = this.rides
      .filter((ride) => new Date(ride.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 15); // Display at least 15 items

    // Clear existing content
    ridesGrid.innerHTML = "";

    // Generate dynamic content using template literals and array methods
    const ridesHTML = upcomingRides
      .map((ride) => this.createRideCardHTML(ride))
      .join("");
    ridesGrid.innerHTML = ridesHTML;

    // Store processed data in local storage
    this.storageManager.saveRides(upcomingRides);

    // Setup event listeners for new elements
    this.setupRideCardEvents();
  }

  // Template Literals for dynamic HTML generation
  createRideCardHTML(ride) {
    const availableSpots = ride.maxParticipants - ride.currentParticipants;
    const difficultyClass = ride.difficulty.toLowerCase().replace(" ", "-");

    return `
            <div class="ride-card ${difficultyClass}" data-ride-id="${ride.id}">
                <div class="ride-header">
                    <h3>${ride.title}</h3>
                    <span class="difficulty-badge ${difficultyClass}">${ride.difficulty}</span>
                </div>
                <div class="ride-details">
                    <p class="ride-date">📅 ${this.formatDate(ride.date)} at ${ride.time}</p>
                    <p class="ride-distance">📏 Distance: ${ride.distance} miles</p>
                    <p class="ride-duration">⏱️ Duration: ${ride.duration}</p>
                    <p class="ride-leader">👤 Leader: ${ride.leader}</p>
                </div>
                <div class="ride-info">
                    <p class="ride-description">${ride.description}</p>
                    <div class="ride-features">
                        ${ride.features.map((feature) => `<span class="feature-tag">${feature}</span>`).join("")}
                    </div>
                </div>
                <div class="ride-footer">
                    <div class="availability">
                        <span class="spots-available">${availableSpots} spots available</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(ride.currentParticipants / ride.maxParticipants) * 100}%"></div>
                        </div>
                    </div>
                    <button class="join-ride-btn" data-ride-id="${ride.id}" ${availableSpots === 0 ? "disabled" : ""}>
                        ${availableSpots === 0 ? "Full" : "Join Ride"}
                    </button>
                </div>
            </div>
        `;
  }

  setupRideCardEvents() {
    // DOM Manipulation and Event Handling
    const joinButtons = document.querySelectorAll(".join-ride-btn");
    joinButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const rideId = e.target.getAttribute("data-ride-id");
        this.openRideModal(rideId);
      });
    });

    // Add hover effects and interactions
    const rideCards = document.querySelectorAll(".ride-card");
    rideCards.forEach((card) => {
      card.addEventListener("mouseenter", this.handleCardHover);
      card.addEventListener("mouseleave", this.handleCardLeave);
      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("join-ride-btn")) {
          const rideId = card.getAttribute("data-ride-id");
          this.showRideDetails(rideId);
        }
      });
    });
  }

  handleCardHover = (e) => {
    e.target.style.transform = "translateY(-5px) scale(1.02)";
    e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  };

  handleCardLeave = (e) => {
    e.target.style.transform = "translateY(0) scale(1)";
    e.target.style.boxShadow = "";
  };

  // Modal Dialog Implementation
  openRideModal(rideId) {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) return;

    this.modalManager.openRideModal(ride, (formData) => {
      this.handleRideRegistration(ride, formData);
    });
  }

  initializeModals() {
    // Setup modal close events
    const modals = document.querySelectorAll("dialog");
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.close();
        }
      });

      const closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => modal.close());
      }
    });
  }

  handleRideRegistration(ride, formData) {
    try {
      // Save registration to local storage
      const registration = {
        rideId: ride.id,
        rideTitle: ride.title,
        rideDate: ride.date,
        userData: formData,
        registrationDate: new Date().toISOString(),
      };

      this.storageManager.saveRegistration(registration);

      // Update ride participants
      const rideIndex = this.rides.findIndex((r) => r.id === ride.id);
      if (rideIndex !== -1) {
        this.rides[rideIndex].currentParticipants++;
      }

      this.showNotification(
        `Successfully registered for ${ride.title}! Check your email for details.`,
        "success",
      );
      this.processAndDisplayRides(); // Refresh the display
    } catch (error) {
      console.error("Registration error:", error);
      this.showNotification("Registration failed. Please try again.", "error");
    }
  }

  // Navigation functionality
  initializeNavigation() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenu && navMenu) {
      mobileMenu.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        mobileMenu.classList.toggle("active");
      });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", this.handleNavigation);
    });

    // Update active navigation state
    this.updateActiveNavigation();
  }

  handleNavigation = (e) => {
    const href = e.target.getAttribute("href");

    // Handle internal page links
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetSection = document.querySelector(href);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Close mobile menu
      const navMenu = document.getElementById("nav-menu");
      if (navMenu) {
        navMenu.classList.remove("active");
      }
    }
  };

  updateActiveNavigation() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.remove("active");

      if (
        href === currentPage ||
        (currentPage === "" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  // Form handling with validation
  initializeForms() {
    const membershipForm = document.querySelector(".membership-form");
    if (membershipForm) {
      membershipForm.addEventListener(
        "submit",
        this.handleMembershipSubmission,
      );
    }

    const newsletterBtn = document.querySelector(".newsletter-btn");
    const newsletterInput = document.querySelector(".newsletter-input");

    if (newsletterBtn && newsletterInput) {
      newsletterBtn.addEventListener("click", this.handleNewsletterSignup);
      newsletterInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleNewsletterSignup(e);
        }
      });
    }
  }

  handleMembershipSubmission = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const memberData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      experience: formData.get("experience"),
      safetyPledge: formData.get("safety-pledge"),
      joinDate: new Date().toISOString(),
    };

    if (this.validateMembershipForm(memberData)) {
      this.storageManager.saveMember(memberData);
      this.currentUser = memberData;
      this.showNotification(
        "Welcome to EcoRiders Club! Check your email for membership details.",
        "success",
      );
      e.target.reset();

      // Update UI to show logged in state
      this.updateUserInterface();
    }
  };

  validateMembershipForm(data) {
    if (!data.name || !data.email || !data.safetyPledge) {
      this.showNotification(
        "Please fill in all required fields and agree to safety guidelines.",
        "error",
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showNotification("Please enter a valid email address.", "error");
      return false;
    }

    return true;
  }

  handleNewsletterSignup = (e) => {
    e.preventDefault();

    const emailInput = document.querySelector(".newsletter-input");
    const email = emailInput.value.trim();

    if (!email) {
      this.showNotification("Please enter your email address.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Save to local storage
    this.storageManager.saveNewsletterSubscription(email);
    this.showNotification(
      "Thank you for subscribing to our newsletter!",
      "success",
    );
    emailInput.value = "";
  };

  // Local Storage Management
  loadUserPreferences() {
    const preferences = this.storageManager.getPreferences();

    if (preferences.theme) {
      document.body.classList.add(preferences.theme);
    }

    if (preferences.notifications !== undefined) {
      this.notificationsEnabled = preferences.notifications;
    }

    // Load user registrations and update UI
    const registrations = this.storageManager.getRegistrations();
    if (registrations.length > 0) {
      this.updateRegistrationStatus(registrations);
    }
  }

  updateRegistrationStatus(registrations) {
    // Use array methods to process registrations
    const activeRegistrations = registrations
      .filter((reg) => new Date(reg.rideDate) >= new Date())
      .reduce((acc, reg) => {
        acc[reg.rideId] = reg;
        return acc;
      }, {});

    // Update UI to show registered status
    Object.keys(activeRegistrations).forEach((rideId) => {
      const button = document.querySelector(`[data-ride-id="${rideId}"]`);
      if (button) {
        button.textContent = "Registered";
        button.classList.add("registered");
        button.disabled = true;
      }
    });
  }

  updateUserInterface() {
    const loginBtn = document.querySelector(".login-btn");
    if (loginBtn && this.currentUser.name) {
      loginBtn.textContent = `Hello, ${this.currentUser.name.split(" ")[0]}`;
      loginBtn.href = "#profile";
    }
  }

  // Additional helper methods
  formatDate(dateString) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  showRideDetails(rideId) {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) return;

    // Create a detailed view modal or expand card
    this.modalManager.showRideDetails(ride);
  }

  setupEventListeners() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".ride-card, .quick-link-card, .news-card, .sidebar-card",
    );
    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

    // Window events
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
  }

  handleScroll = () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleResize = () => {
    // Handle responsive layout changes
    const navMenu = document.getElementById("nav-menu");
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
    }
  };

  displayFallbackContent() {
    const ridesGrid = document.querySelector(".rides-grid");
    if (ridesGrid) {
      ridesGrid.innerHTML = `
                <div class="fallback-message">
                    <h3>Unable to load rides</h3>
                    <p>Please check your internet connection and try refreshing the page.</p>
                    <button onclick="location.reload()" class="retry-btn">Retry</button>
                </div>
            `;
    }
  }

  // Notification system
  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      color: "white",
      fontWeight: "600",
      zIndex: "10000",
      maxWidth: "300px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    });

    // Set background color based on type
    const colors = {
      success: "var(--primary-green)",
      error: "#d32f2f",
      info: "var(--accent-orange)",
      warning: "#f57c00",
    };

    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 4000);
  }
}

// Initialize the application
const app = new EcoRidersApp();

// Global error handler
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error);
  // In production, this could send errors to a logging service
});

// Service Worker Registration (for future PWA implementation)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registered successfully");
      })
      .catch((registrationError) => {
        console.log("ServiceWorker registration failed");
      });
  });
}

export default app;
