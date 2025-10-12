// StorageManager ES Module
// Handles local storage operations for user data, preferences, and application state

export class StorageManager {
    constructor() {
        this.storagePrefix = 'ecoridersclub_';
        this.storageKeys = {
            user: 'user',
            preferences: 'preferences',
            rides: 'rides',
            registrations: 'registrations',
            newsletter: 'newsletter',
            favorites: 'favorites',
            searchHistory: 'searchHistory',
            visitHistory: 'visitHistory'
        };
        this.initializeStorage();
    }

    initializeStorage() {
        // Check if localStorage is available
        if (!this.isStorageAvailable()) {
            console.warn('localStorage is not available. Using memory storage as fallback.');
            this.memoryStorage = {};
        }

        // Initialize default preferences if they don't exist
        if (!this.getPreferences()) {
            this.savePreferences(this.getDefaultPreferences());
        }

        // Track visit history
        this.recordVisit();
    }

    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Generic storage operations
    setItem(key, value) {
        const fullKey = this.storagePrefix + key;

        try {
            const serializedValue = JSON.stringify(value);

            if (this.isStorageAvailable()) {
                localStorage.setItem(fullKey, serializedValue);
            } else {
                this.memoryStorage[fullKey] = serializedValue;
            }
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    getItem(key) {
        const fullKey = this.storagePrefix + key;

        try {
            let value;
            if (this.isStorageAvailable()) {
                value = localStorage.getItem(fullKey);
            } else {
                value = this.memoryStorage[fullKey];
            }

            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    }

    removeItem(key) {
        const fullKey = this.storagePrefix + key;

        try {
            if (this.isStorageAvailable()) {
                localStorage.removeItem(fullKey);
            } else {
                delete this.memoryStorage[fullKey];
            }
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }

    clear() {
        try {
            if (this.isStorageAvailable()) {
                // Remove only items with our prefix
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.storagePrefix)) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } else {
                this.memoryStorage = {};
            }
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // User management
    saveUser(userData) {
        const userToSave = {
            ...userData,
            lastLogin: new Date().toISOString(),
            memberId: userData.memberId || this.generateMemberId()
        };
        return this.setItem(this.storageKeys.user, userToSave);
    }

    getUser() {
        return this.getItem(this.storageKeys.user);
    }

    updateUser(updates) {
        const currentUser = this.getUser();
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                ...updates,
                lastUpdated: new Date().toISOString()
            };
            return this.saveUser(updatedUser);
        }
        return false;
    }

    removeUser() {
        return this.removeItem(this.storageKeys.user);
    }

    isUserLoggedIn() {
        const user = this.getUser();
        return user && user.email;
    }

    // Member management
    saveMember(memberData) {
        return this.saveUser(memberData);
    }

    generateMemberId() {
        return 'ECO' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // Preferences management
    getDefaultPreferences() {
        return {
            theme: 'light',
            notifications: true,
            emailUpdates: true,
            rideReminders: true,
            difficultyPreference: 'all',
            maxDistance: 50,
            preferredDays: ['saturday', 'sunday'],
            language: 'en',
            units: 'imperial',
            autoLogin: false
        };
    }

    savePreferences(preferences) {
        const prefsToSave = {
            ...this.getDefaultPreferences(),
            ...preferences,
            lastUpdated: new Date().toISOString()
        };
        return this.setItem(this.storageKeys.preferences, prefsToSave);
    }

    getPreferences() {
        const prefs = this.getItem(this.storageKeys.preferences);
        return prefs || this.getDefaultPreferences();
    }

    updatePreference(key, value) {
        const currentPrefs = this.getPreferences();
        currentPrefs[key] = value;
        return this.savePreferences(currentPrefs);
    }

    // Rides data management
    saveRides(ridesData) {
        const ridesToSave = {
            rides: ridesData,
            lastUpdated: new Date().toISOString(),
            version: '1.0'
        };
        return this.setItem(this.storageKeys.rides, ridesToSave);
    }

    getRides() {
        const ridesData = this.getItem(this.storageKeys.rides);
        return ridesData ? ridesData.rides : [];
    }

    getRidesMetadata() {
        const ridesData = this.getItem(this.storageKeys.rides);
        return ridesData ? {
            lastUpdated: ridesData.lastUpdated,
            version: ridesData.version,
            count: ridesData.rides ? ridesData.rides.length : 0
        } : null;
    }

    // Registration management
    saveRegistration(registrationData) {
        const registrations = this.getRegistrations();
        const newRegistration = {
            ...registrationData,
            id: this.generateRegistrationId(),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        registrations.push(newRegistration);
        return this.setItem(this.storageKeys.registrations, registrations);
    }

    getRegistrations() {
        return this.getItem(this.storageKeys.registrations) || [];
    }

    getRegistrationById(id) {
        const registrations = this.getRegistrations();
        return registrations.find(reg => reg.id === id);
    }

    getRegistrationsByRideId(rideId) {
        const registrations = this.getRegistrations();
        return registrations.filter(reg => reg.rideId === rideId);
    }

    updateRegistration(id, updates) {
        const registrations = this.getRegistrations();
        const index = registrations.findIndex(reg => reg.id === id);

        if (index !== -1) {
            registrations[index] = {
                ...registrations[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            return this.setItem(this.storageKeys.registrations, registrations);
        }
        return false;
    }

    cancelRegistration(id) {
        return this.updateRegistration(id, { status: 'cancelled' });
    }

    generateRegistrationId() {
        return 'REG_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // Newsletter subscription
    saveNewsletterSubscription(email) {
        const subscriptions = this.getItem(this.storageKeys.newsletter) || [];

        if (!subscriptions.includes(email)) {
            subscriptions.push({
                email: email,
                subscribedAt: new Date().toISOString(),
                active: true
            });
            return this.setItem(this.storageKeys.newsletter, subscriptions);
        }
        return false;
    }

    getNewsletterSubscriptions() {
        return this.getItem(this.storageKeys.newsletter) || [];
    }

    unsubscribeNewsletter(email) {
        const subscriptions = this.getNewsletterSubscriptions();
        const subscription = subscriptions.find(sub => sub.email === email);

        if (subscription) {
            subscription.active = false;
            subscription.unsubscribedAt = new Date().toISOString();
            return this.setItem(this.storageKeys.newsletter, subscriptions);
        }
        return false;
    }

    // Favorites management
    addToFavorites(rideId, rideData) {
        const favorites = this.getFavorites();

        if (!favorites.some(fav => fav.rideId === rideId)) {
            favorites.push({
                rideId: rideId,
                rideData: rideData,
                addedAt: new Date().toISOString()
            });
            return this.setItem(this.storageKeys.favorites, favorites);
        }
        return false;
    }

    removeFromFavorites(rideId) {
        const favorites = this.getFavorites();
        const filteredFavorites = favorites.filter(fav => fav.rideId !== rideId);
        return this.setItem(this.storageKeys.favorites, filteredFavorites);
    }

    getFavorites() {
        return this.getItem(this.storageKeys.favorites) || [];
    }

    isFavorite(rideId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.rideId === rideId);
    }

    // Search history
    addToSearchHistory(searchTerm) {
        if (!searchTerm || searchTerm.trim().length < 2) return false;

        const history = this.getSearchHistory();
        const cleanTerm = searchTerm.trim().toLowerCase();

        // Remove existing entry if it exists
        const filteredHistory = history.filter(item => item.term !== cleanTerm);

        // Add to beginning of array
        filteredHistory.unshift({
            term: cleanTerm,
            searchedAt: new Date().toISOString()
        });

        // Keep only last 20 searches
        const limitedHistory = filteredHistory.slice(0, 20);

        return this.setItem(this.storageKeys.searchHistory, limitedHistory);
    }

    getSearchHistory() {
        return this.getItem(this.storageKeys.searchHistory) || [];
    }

    clearSearchHistory() {
        return this.removeItem(this.storageKeys.searchHistory);
    }

    // Visit tracking
    recordVisit() {
        const visits = this.getVisitHistory();
        const currentVisit = {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };

        visits.push(currentVisit);

        // Keep only last 50 visits
        const limitedVisits = visits.slice(-50);

        return this.setItem(this.storageKeys.visitHistory, limitedVisits);
    }

    getVisitHistory() {
        return this.getItem(this.storageKeys.visitHistory) || [];
    }

    getVisitStats() {
        const visits = this.getVisitHistory();

        return {
            totalVisits: visits.length,
            firstVisit: visits.length > 0 ? visits[0].timestamp : null,
            lastVisit: visits.length > 0 ? visits[visits.length - 1].timestamp : null,
            uniquePages: [...new Set(visits.map(v => v.page))].length,
            averageVisitsPerDay: this.calculateAverageVisitsPerDay(visits)
        };
    }

    calculateAverageVisitsPerDay(visits) {
        if (visits.length === 0) return 0;

        const firstVisit = new Date(visits[0].timestamp);
        const lastVisit = new Date(visits[visits.length - 1].timestamp);
        const daysDiff = (lastVisit - firstVisit) / (1000 * 60 * 60 * 24);

        return daysDiff > 0 ? visits.length / daysDiff : visits.length;
    }

    // Data export and import
    exportData() {
        const data = {};

        Object.values(this.storageKeys).forEach(key => {
            const value = this.getItem(key);
            if (value) {
                data[key] = value;
            }
        });

        return {
            data: data,
            exportedAt: new Date().toISOString(),
            version: '1.0',
            userAgent: navigator.userAgent
        };
    }

    importData(importData) {
        if (!importData || !importData.data) {
            throw new Error('Invalid import data format');
        }

        try {
            Object.entries(importData.data).forEach(([key, value]) => {
                if (this.storageKeys[key]) {
                    this.setItem(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Storage usage information
    getStorageUsage() {
        if (!this.isStorageAvailable()) {
            return { total: 0, used: 0, available: 0 };
        }

        try {
            let used = 0;
            for (let key in localStorage) {
                if (key.startsWith(this.storagePrefix)) {
                    used += localStorage[key].length;
                }
            }

            // Estimate total available storage (5MB is typical)
            const total = 5 * 1024 * 1024; // 5MB in bytes

            return {
                total: total,
                used: used,
                available: total - used,
                usagePercentage: (used / total) * 100
            };
        } catch (error) {
            console.error('Error calculating storage usage:', error);
            return { total: 0, used: 0, available: 0 };
        }
    }

    // Cleanup operations
    cleanup() {
        // Remove expired registrations
        const registrations = this.getRegistrations();
        const activeRegistrations = registrations.filter(reg => {
            const rideDate = new Date(reg.rideDate);
            const now = new Date();
            // Keep registrations for 30 days after ride date
            return (now - rideDate) < (30 * 24 * 60 * 60 * 1000);
        });

        if (activeRegistrations.length !== registrations.length) {
            this.setItem(this.storageKeys.registrations, activeRegistrations);
        }

        // Limit search history
        const searchHistory = this.getSearchHistory();
        if (searchHistory.length > 20) {
            this.setItem(this.storageKeys.searchHistory, searchHistory.slice(0, 20));
        }

        // Limit visit history
        const visitHistory = this.getVisitHistory();
        if (visitHistory.length > 50) {
            this.setItem(this.storageKeys.visitHistory, visitHistory.slice(-50));
        }
    }
}

export default StorageManager;
