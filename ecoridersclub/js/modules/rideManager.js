// RideManager ES Module
// Handles ride data processing, filtering, and management

export class RideManager {
    constructor() {
        this.rides = [];
        this.filters = {
            difficulty: 'all',
            distance: 'all',
            date: 'all'
        };
    }

    // Process rides data using array methods
    processRides(ridesData) {
        this.rides = ridesData;
        return this.getFilteredRides();
    }

    // Filter rides based on current filters using array methods
    getFilteredRides() {
        return this.rides
            .filter(ride => this.matchesFilters(ride))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Check if ride matches current filters
    matchesFilters(ride) {
        const { difficulty, distance, date } = this.filters;

        // Difficulty filter
        if (difficulty !== 'all' && ride.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
            return false;
        }

        // Distance filter
        if (distance !== 'all') {
            const rideDistance = ride.distance;
            switch (distance) {
                case 'short':
                    if (rideDistance >= 20) return false;
                    break;
                case 'medium':
                    if (rideDistance < 20 || rideDistance >= 35) return false;
                    break;
                case 'long':
                    if (rideDistance < 35) return false;
                    break;
            }
        }

        // Date filter
        if (date !== 'all') {
            const rideDate = new Date(ride.date);
            const today = new Date();
            const daysDiff = Math.ceil((rideDate - today) / (1000 * 60 * 60 * 24));

            switch (date) {
                case 'this-week':
                    if (daysDiff < 0 || daysDiff > 7) return false;
                    break;
                case 'this-month':
                    if (daysDiff < 0 || daysDiff > 30) return false;
                    break;
                case 'upcoming':
                    if (daysDiff < 0) return false;
                    break;
            }
        }

        return true;
    }

    // Update filters and return filtered results
    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        return this.getFilteredRides();
    }

    // Get ride by ID
    getRideById(id) {
        return this.rides.find(ride => ride.id === id);
    }

    // Get rides by difficulty using array methods
    getRidesByDifficulty(difficulty) {
        return this.rides.filter(ride =>
            ride.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
    }

    // Get upcoming rides within specified days
    getUpcomingRides(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + days);

        return this.rides
            .filter(ride => {
                const rideDate = new Date(ride.date);
                return rideDate >= new Date() && rideDate <= cutoffDate;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Get ride statistics using reduce
    getRideStats() {
        return this.rides.reduce((stats, ride) => {
            // Count by difficulty
            const difficulty = ride.difficulty.toLowerCase();
            stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;

            // Total distance
            stats.totalDistance += ride.distance;

            // Average distance
            stats.averageDistance = stats.totalDistance / this.rides.length;

            // Participation statistics
            stats.totalParticipants += ride.currentParticipants;
            stats.totalCapacity += ride.maxParticipants;
            stats.averageParticipation = stats.totalParticipants / this.rides.length;

            // Most popular features
            ride.features.forEach(feature => {
                stats.popularFeatures[feature] = (stats.popularFeatures[feature] || 0) + 1;
            });

            return stats;
        }, {
            byDifficulty: {},
            totalDistance: 0,
            averageDistance: 0,
            totalParticipants: 0,
            totalCapacity: 0,
            averageParticipation: 0,
            popularFeatures: {}
        });
    }

    // Search rides by title, description, or features
    searchRides(searchTerm) {
        const term = searchTerm.toLowerCase();

        return this.rides.filter(ride => {
            return ride.title.toLowerCase().includes(term) ||
                   ride.description.toLowerCase().includes(term) ||
                   ride.features.some(feature => feature.toLowerCase().includes(term)) ||
                   ride.leader.toLowerCase().includes(term);
        });
    }

    // Get available spots for each ride
    getAvailabilityStatus() {
        return this.rides.map(ride => ({
            id: ride.id,
            title: ride.title,
            available: ride.maxParticipants - ride.currentParticipants,
            percentFull: (ride.currentParticipants / ride.maxParticipants) * 100,
            status: this.getAvailabilityStatusText(ride)
        }));
    }

    getAvailabilityStatusText(ride) {
        const available = ride.maxParticipants - ride.currentParticipants;
        const percentFull = (ride.currentParticipants / ride.maxParticipants) * 100;

        if (available === 0) return 'Full';
        if (percentFull >= 90) return 'Almost Full';
        if (percentFull >= 75) return 'Filling Up';
        if (percentFull >= 50) return 'Half Full';
        return 'Available';
    }

    // Update ride participation
    updateRideParticipation(rideId, increment = 1) {
        const rideIndex = this.rides.findIndex(ride => ride.id === rideId);
        if (rideIndex !== -1) {
            this.rides[rideIndex].currentParticipants += increment;
            return this.rides[rideIndex];
        }
        return null;
    }

    // Get rides for specific date range
    getRidesInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return this.rides.filter(ride => {
            const rideDate = new Date(ride.date);
            return rideDate >= start && rideDate <= end;
        });
    }

    // Get ride recommendations based on user preferences
    getRecommendations(userProfile) {
        const { experience, preferences = [], maxDistance = 50 } = userProfile;

        return this.rides
            .filter(ride => {
                // Filter by experience level
                if (experience === 'beginner' && ride.difficulty === 'Advanced') {
                    return false;
                }
                if (experience === 'advanced' && ride.difficulty === 'Beginner') {
                    return false;
                }

                // Filter by distance preference
                if (ride.distance > maxDistance) {
                    return false;
                }

                // Check if ride has preferred features
                if (preferences.length > 0) {
                    return ride.features.some(feature =>
                        preferences.includes(feature.toLowerCase())
                    );
                }

                return true;
            })
            .sort((a, b) => {
                // Prioritize rides with more matching features
                const aMatches = a.features.filter(f =>
                    preferences.includes(f.toLowerCase())
                ).length;
                const bMatches = b.features.filter(f =>
                    preferences.includes(f.toLowerCase())
                ).length;

                return bMatches - aMatches;
            });
    }

    // Export ride data for sharing or backup
    exportRideData() {
        return {
            rides: this.rides,
            stats: this.getRideStats(),
            exportDate: new Date().toISOString()
        };
    }

    // Validate ride data structure
    validateRideData(ride) {
        const required = ['id', 'title', 'date', 'difficulty', 'distance', 'leader'];
        const missing = required.filter(field => !ride[field]);

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Validate data types and ranges
        if (typeof ride.distance !== 'number' || ride.distance <= 0) {
            throw new Error('Distance must be a positive number');
        }

        if (new Date(ride.date) < new Date()) {
            console.warn(`Ride ${ride.id} has a past date`);
        }

        return true;
    }

    // Get calendar view data
    getCalendarData(year, month) {
        const monthRides = this.rides.filter(ride => {
            const rideDate = new Date(ride.date);
            return rideDate.getFullYear() === year && rideDate.getMonth() === month;
        });

        // Group by day
        return monthRides.reduce((calendar, ride) => {
            const day = new Date(ride.date).getDate();
            if (!calendar[day]) {
                calendar[day] = [];
            }
            calendar[day].push({
                id: ride.id,
                title: ride.title,
                time: ride.time,
                difficulty: ride.difficulty
            });
            return calendar;
        }, {});
    }
}

export default RideManager;
