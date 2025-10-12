// ModalManager ES Module
// Handles modal dialog functionality using HTML5 <dialog> element

export class ModalManager {
    constructor() {
        this.activeModal = null;
        this.modalStack = [];
        this.initializeModals();
    }

    initializeModals() {
        // Setup global modal event handlers
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Initialize existing modals
        const modals = document.querySelectorAll('dialog');
        modals.forEach(modal => {
            this.setupModalEvents(modal);
        });
    }

    setupModalEvents(modal) {
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Setup close buttons
        const closeButtons = modal.querySelectorAll('.modal-close, [data-close-modal]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(modal);
            });
        });

        // Setup cancel buttons
        const cancelButtons = modal.querySelectorAll('.btn-secondary, [data-cancel]');
        cancelButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(modal);
            });
        });
    }

    openModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with id "${modalId}" not found`);
            return false;
        }

        // Add to modal stack
        this.modalStack.push(modal);
        this.activeModal = modal;

        // Apply options
        if (options.title) {
            const titleElement = modal.querySelector('.modal-title, h2, h3');
            if (titleElement) {
                titleElement.textContent = options.title;
            }
        }

        if (options.content) {
            const contentElement = modal.querySelector('.modal-body, .modal-content');
            if (contentElement) {
                contentElement.innerHTML = options.content;
            }
        }

        // Show modal
        modal.showModal();

        // Add CSS class for styling
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Focus management
        this.focusModal(modal);

        // Trigger custom event
        const event = new CustomEvent('modalOpened', {
            detail: { modal, modalId, options }
        });
        document.dispatchEvent(event);

        return true;
    }

    closeModal(modal) {
        if (!modal || !modal.open) return;

        // Remove from modal stack
        const index = this.modalStack.indexOf(modal);
        if (index > -1) {
            this.modalStack.splice(index, 1);
        }

        // Update active modal
        this.activeModal = this.modalStack.length > 0 ?
            this.modalStack[this.modalStack.length - 1] : null;

        // Close modal
        modal.close();
        modal.classList.remove('active');

        // Remove body class if no modals open
        if (this.modalStack.length === 0) {
            document.body.classList.remove('modal-open');
        }

        // Restore focus
        this.restoreFocus();

        // Trigger custom event
        const event = new CustomEvent('modalClosed', {
            detail: { modal }
        });
        document.dispatchEvent(event);
    }

    closeAllModals() {
        while (this.modalStack.length > 0) {
            this.closeModal(this.modalStack[this.modalStack.length - 1]);
        }
    }

    // Ride-specific modal functionality
    openRideModal(ride, onSubmit) {
        const modal = document.getElementById('ride-modal');
        if (!modal) {
            console.error('Ride modal not found');
            return;
        }

        // Update modal content with ride information
        const modalTitle = modal.querySelector('#modal-title');
        const modalRideInfo = modal.querySelector('#modal-ride-info');
        const form = modal.querySelector('#ride-registration-form');

        if (modalTitle) {
            modalTitle.textContent = `Join ${ride.title}`;
        }

        if (modalRideInfo) {
            modalRideInfo.innerHTML = this.createRideInfoHTML(ride);
        }

        // Setup form submission
        if (form && onSubmit) {
            form.replaceWith(form.cloneNode(true)); // Remove old listeners
            const newForm = modal.querySelector('#ride-registration-form');

            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);

                // Validate form
                if (this.validateRideForm(data)) {
                    onSubmit(data);
                    this.closeModal(modal);
                }
            });
        }

        // Open the modal
        modal.showModal();
        this.activeModal = modal;
        this.modalStack.push(modal);
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        this.focusModal(modal);
    }

    createRideInfoHTML(ride) {
        const availableSpots = ride.maxParticipants - ride.currentParticipants;

        return `
            <div class="modal-ride-details">
                <div class="ride-basic-info">
                    <h4>${ride.title}</h4>
                    <div class="ride-meta">
                        <span class="difficulty-badge ${ride.difficulty.toLowerCase()}">${ride.difficulty}</span>
                        <span class="date-info">📅 ${this.formatDate(ride.date)} at ${ride.time}</span>
                    </div>
                </div>

                <div class="ride-description">
                    <p>${ride.description}</p>
                </div>

                <div class="ride-details-grid">
                    <div class="detail-item">
                        <strong>Distance:</strong> ${ride.distance} miles
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${ride.duration}
                    </div>
                    <div class="detail-item">
                        <strong>Meeting Point:</strong> ${ride.meetingPoint}
                    </div>
                    <div class="detail-item">
                        <strong>Leader:</strong> ${ride.leader}
                    </div>
                </div>

                <div class="ride-features">
                    <h5>What to Expect:</h5>
                    <div class="features-list">
                        ${ride.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>

                <div class="ride-requirements">
                    <h5>Requirements:</h5>
                    <ul>
                        ${ride.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>

                <div class="availability-info ${availableSpots === 0 ? 'full' : ''}">
                    <strong>Availability:</strong> ${availableSpots} of ${ride.maxParticipants} spots available
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(ride.currentParticipants / ride.maxParticipants) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    validateRideForm(data) {
        const errors = [];

        if (!data['rider-name'] || data['rider-name'].trim().length < 2) {
            errors.push('Please enter your full name');
        }

        if (!data['rider-email']) {
            errors.push('Email address is required');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data['rider-email'])) {
                errors.push('Please enter a valid email address');
            }
        }

        if (!data['safety-agreement']) {
            errors.push('You must agree to follow safety guidelines');
        }

        if (errors.length > 0) {
            this.showFormErrors(errors);
            return false;
        }

        return true;
    }

    showFormErrors(errors) {
        // Remove existing error display
        const existingErrors = document.querySelector('.form-errors');
        if (existingErrors) {
            existingErrors.remove();
        }

        // Create error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-errors';
        errorDiv.innerHTML = `
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        // Insert into modal
        const form = document.querySelector('#ride-registration-form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    // Show detailed ride information modal
    showRideDetails(ride) {
        const existingModal = document.getElementById('ride-details-modal');

        // Create modal if it doesn't exist
        if (!existingModal) {
            this.createRideDetailsModal(ride);
        } else {
            this.updateRideDetailsModal(existingModal, ride);
        }
    }

    createRideDetailsModal(ride) {
        const modalHTML = `
            <dialog id="ride-details-modal" class="ride-details-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Ride Details</h3>
                        <button class="modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${this.createDetailedRideHTML(ride)}
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" data-close-modal>Close</button>
                        <button class="btn-primary" onclick="app.openRideModal('${ride.id}')">Join This Ride</button>
                    </div>
                </div>
            </dialog>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('ride-details-modal');
        this.setupModalEvents(modal);

        modal.showModal();
        this.activeModal = modal;
        this.modalStack.push(modal);
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        this.focusModal(modal);
    }

    createDetailedRideHTML(ride) {
        return `
            <div class="detailed-ride-info">
                <div class="ride-hero">
                    <h4>${ride.title}</h4>
                    <div class="ride-badges">
                        <span class="difficulty-badge ${ride.difficulty.toLowerCase()}">${ride.difficulty}</span>
                        <span class="weather-badge">${ride.weather || 'Weather info pending'}</span>
                    </div>
                </div>

                <div class="ride-overview">
                    <div class="overview-item">
                        <span class="icon">📅</span>
                        <div>
                            <strong>Date & Time</strong>
                            <p>${this.formatDate(ride.date)} at ${ride.time}</p>
                        </div>
                    </div>
                    <div class="overview-item">
                        <span class="icon">📏</span>
                        <div>
                            <strong>Distance</strong>
                            <p>${ride.distance} miles (${ride.duration})</p>
                        </div>
                    </div>
                    <div class="overview-item">
                        <span class="icon">📍</span>
                        <div>
                            <strong>Meeting Point</strong>
                            <p>${ride.meetingPoint}</p>
                            <small>${ride.address || ''}</small>
                        </div>
                    </div>
                    <div class="overview-item">
                        <span class="icon">👤</span>
                        <div>
                            <strong>Ride Leader</strong>
                            <p>${ride.leader}</p>
                            <small>${ride.leaderPhone || ''}</small>
                        </div>
                    </div>
                </div>

                <div class="ride-description-full">
                    <h5>About This Ride</h5>
                    <p>${ride.description}</p>
                    ${ride.terrain ? `<p><strong>Terrain:</strong> ${ride.terrain}</p>` : ''}
                </div>

                <div class="ride-features-detailed">
                    <h5>Features & Highlights</h5>
                    <div class="features-grid">
                        ${ride.features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
                    </div>
                </div>

                <div class="ride-requirements-detailed">
                    <h5>What to Bring</h5>
                    <ul class="requirements-list">
                        ${ride.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>

                <div class="participation-info">
                    <h5>Participation</h5>
                    <div class="participation-stats">
                        <div class="stat">
                            <span class="number">${ride.currentParticipants}</span>
                            <span class="label">Registered</span>
                        </div>
                        <div class="stat">
                            <span class="number">${ride.maxParticipants - ride.currentParticipants}</span>
                            <span class="label">Available</span>
                        </div>
                        <div class="stat">
                            <span class="number">${ride.maxParticipants}</span>
                            <span class="label">Total Spots</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Accessibility and keyboard navigation
    handleKeyDown(e) {
        if (!this.activeModal) return;

        switch (e.key) {
            case 'Escape':
                this.closeModal(this.activeModal);
                break;
            case 'Tab':
                this.trapFocus(e);
                break;
        }
    }

    focusModal(modal) {
        // Focus the first focusable element
        const focusableElements = this.getFocusableElements(modal);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    trapFocus(e) {
        if (!this.activeModal) return;

        const focusableElements = this.getFocusableElements(this.activeModal);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    getFocusableElements(container) {
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return Array.from(container.querySelectorAll(focusableSelectors));
    }

    restoreFocus() {
        // Restore focus to the element that opened the modal
        // This would typically be stored when opening the modal
        const lastFocused = document.querySelector('[data-last-focused]');
        if (lastFocused) {
            lastFocused.focus();
            lastFocused.removeAttribute('data-last-focused');
        }
    }

    // Utility methods
    formatDate(dateString) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Public API methods
    isModalOpen(modalId) {
        const modal = document.getElementById(modalId);
        return modal && modal.open;
    }

    getActiveModal() {
        return this.activeModal;
    }

    getModalStack() {
        return [...this.modalStack];
    }
}

export default ModalManager;
