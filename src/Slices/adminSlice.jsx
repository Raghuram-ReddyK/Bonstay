import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks handle asynchronous operations like API calls.
// They dispatch actions based on the promise lifecycle (pending, fulfilled, rejected).

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} userType - 'admin' or 'regular'
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} userId
 * @property {string} hotelId
 * @property {string} hotelName
 * @property {string} status - 'confirmed', 'pending', etc.
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Hotel
 * @property {string} id
 * @property {string} name
 * @property {number} rooms - Example: Can be used for occupancy rate calculation.
 */

/**
 * Async thunk to fetch all necessary admin data concurrently.
 * It fetches users, bookings, hotels, and admin code requests.
 * @returns {Promise<{users: User[], bookings: Booking[], hotels: Hotel[], adminRequests: any[]}>} The fetched data.
 */
export const fetchAdminData = createAsyncThunk(
    'admin/fetchAdminData',
    async (_, { rejectWithValue }) => {
        try {
            // Use Promise.all to make multiple API requests concurrently for efficiency.
            const [usersRes, bookingsRes, hotelsRes, requestsRes] = await Promise.all([
                axios.get('http://localhost:4000/users'), // Fetches user data
                axios.get('http://localhost:4000/bookings'), // Fetches booking data
                axios.get('http://localhost:4000/hotels'), // Fetches hotel data
                axios.get('http://localhost:4000/admin-code-requests') // Fetches admin request data
            ]);

            // Return an object containing all fetched data.
            return {
                users: usersRes.data,
                bookings: bookingsRes.data,
                hotels: hotelsRes.data,
                adminRequests: requestsRes.data
            };
        } catch (error) {
            // If any request fails, reject with the error message or response data.
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Async thunk to simulate updating system settings.
 * Currently, it's a mock API call using a setTimeout.
 * @param {Object} settings - The settings object to update.
 * @returns {Promise<Object>} The updated settings.
 */
export const updateSystemSettings = createAsyncThunk(
    'admin/updateSystemSettings',
    async (settings, { rejectWithValue }) => {
        try {
            // Simulate an API call delay.
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In a real application, you would make an actual axios.put or axios.post call here.
            return settings; // Return the settings that were "updated".
        } catch (error) {
            // Reject with the error message if the mock call (or real call) fails.
            return rejectWithValue(error.message);
        }
    }
);

// Helper functions for generating mock data or calculating derived state.

/**
 * Generates analytics data based on users, bookings, and hotels data.
 * This function calculates key metrics for the admin dashboard.
 * @param {User[]} users - Array of user objects.
 * @param {Booking[]} bookings - Array of booking objects.
 * @param {Hotel[]} hotels - Array of hotel objects.
 * @returns {Object} Analytics metrics.
 */
const generateAnalytics = (users, bookings, hotels) => {
    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const adminUsers = users.filter(user => user.userType === 'admin').length;
    // Count confirmed bookings, including those without a 'status' field (assuming they are confirmed).
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || !b.status).length;
    // Calculate total revenue (example: 1000 per confirmed booking).
    const totalRevenue = confirmedBookings * 1000;
    // Calculate occupancy rate, ensuring it doesn't exceed 100%.
    const occupancyRate = Math.min((confirmedBookings / (hotels.length * 50)) * 100, 100);

    return {
        totalUsers,
        totalBookings,
        totalRevenue,
        occupancyRate: Number(occupancyRate.toFixed(1)), // Format to one decimal place.
        adminUsers,
        regularUsers: totalUsers - adminUsers,
        confirmedBookings,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        monthlyGrowth: Math.floor(Math.random() * 20) + 5, // Mock monthly growth.
        userGrowthRate: Math.floor(Math.random() * 15) + 3 // Mock user growth rate.
    };
};

/**
 * Generates mock system monitoring data (CPU, memory, disk, network, service status, security alerts).
 * This simulates real-time system health metrics.
 * @returns {Object} System monitoring data.
 */
const generateSystemMonitoring = () => {
    const cpuUsage = Math.floor(Math.random() * 60) + 20;
    const memoryUsage = Math.floor(Math.random() * 50) + 30;
    const diskUsage = Math.floor(Math.random() * 40) + 50;
    const networkLatency = Math.floor(Math.random() * 100) + 20;

    // Helper to determine status based on usage percentage.
    const getStatus = (usage) => {
        if (usage < 50) return 'healthy';
        if (usage < 80) return 'warning';
        return 'critical';
    };

    return {
        cpuUsage,
        memoryUsage,
        diskUsage,
        networkLatency,
        cpuStatus: getStatus(cpuUsage),
        memoryStatus: getStatus(memoryUsage),
        diskStatus: getStatus(diskUsage),
        networkStatus: networkLatency < 50 ? 'healthy' : networkLatency < 100 ? 'warning' : 'critical',
        overallHealth: cpuUsage < 70 && memoryUsage < 70 ? 'healthy' : 'warning', // Overall health based on CPU and memory.
        services: [ // Mock service statuses.
            { name: 'Web Server', status: Math.random() > 0.1 ? 'online' : 'offline', uptime: '99.9%' },
            { name: 'Database', status: Math.random() > 0.05 ? 'online' : 'offline', uptime: '99.8%' },
            { name: 'API Gateway', status: Math.random() > 0.08 ? 'online' : 'offline', uptime: '99.7%' },
            { name: 'Payment Service', status: Math.random() > 0.12 ? 'online' : 'offline', uptime: '99.5%' },
            { name: 'Email Service', status: Math.random() > 0.15 ? 'online' : 'offline', uptime: '98.9%' },
            { name: 'File Storage', status: Math.random() > 0.06 ? 'online' : 'offline', uptime: '99.6%' }
        ],
        securityAlerts: [ // Mock security alerts.
            {
                message: 'Multiple login attempts detected',
                severity: 'medium',
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
            },
            {
                message: 'SSL certificate expires in 30 days',
                severity: 'low',
                timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString()
            },
            {
                message: 'Unusual API usage pattern detected',
                severity: 'high',
                timestamp: new Date(Date.now() - Math.random() * 1800000).toISOString()
            }
        ].slice(0, Math.floor(Math.random() * 3) + 1) // Randomly select 1 to 3 alerts.
    };
};

/**
 * Generates mock activity logs based on user and booking data.
 * @param {User[]} users - Array of user objects.
 * @param {Booking[]} bookings - Array of booking objects.
 * @returns {Object[]} An array of activity log entries.
 */
const generateActivityLogs = (users, bookings) => {
    const activities = [];
    const now = new Date();
    const types = ['user_login', 'user_logout', 'booking_created', 'booking_modified', 'user_created', 'user_updated', 'security_alert', 'system_error'];
    const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.45', '198.51.100.30'];

    // Add recent user creation activities.
    users.slice(-10).forEach((user, index) => {
        activities.push({
            id: `user_${user.id}_${index}`,
            type: 'user_created',
            user: user.name || `User ${user.id}`,
            description: `New user account created: ${user.name || `User ${user.id}`}`,
            timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
        });
    });

    // Add recent booking creation activities.
    bookings.slice(-15).forEach((booking, index) => {
        activities.push({
            id: `booking_${booking.id}_${index}`,
            type: 'booking_created',
            user: `User ${booking.userId}`,
            description: `New booking created for ${booking.hotelName || `Hotel ${booking.hotelId}`}`,
            timestamp: booking.createdAt || new Date(now.getTime() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
            ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
        });
    });

    // Generate additional random activities to fill up the logs.
    for (let i = 0; i < 20; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        activities.push({
            id: `activity_${i}`,
            type,
            user: `User${Math.floor(Math.random() * 100)}`,
            description: getActivityDescription(type), // Get a descriptive message based on activity type.
            timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
        });
    }

    // Sort activities by timestamp (most recent first) and keep the latest 50.
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50);
};

/**
 * Helper function to get a descriptive message for an activity type.
 * @param {string} type - The type of activity.
 * @returns {string} The description for the activity.
 */
const getActivityDescription = (type) => {
    const descriptions = {
        user_login: 'User logged into the system',
        user_logout: 'User logged out of the system',
        booking_created: 'New booking was created',
        booking_modified: 'Existing booking was modified',
        user_created: 'New user account was created',
        user_updated: 'User profile was updated',
        security_alert: 'Security alert triggered',
        system_error: 'System error occurred'
    };
    return descriptions[type] || 'Unknown activity';
};

/**
 * Generates mock system notifications.
 * @returns {Object[]} An array of notification objects.
 */
const generateNotifications = () => {
    const notifications = [];
    const now = new Date();
    const types = ['info', 'warning', 'error', 'success', 'security'];

    for (let i = 0; i < 10; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        notifications.push({
            id: Date.now() + i, // Unique ID for each notification.
            type,
            title: getNotificationTitle(type), // Get a title based on notification type.
            message: getNotificationMessage(type), // Get a message based on notification type.
            timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            read: Math.random() > 0.6 // Randomly set some notifications as read.
        });
    }

    // Sort notifications by timestamp (most recent first).
    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Helper function to get a title for a notification type.
 * @param {string} type - The type of notification.
 * @returns {string} The title for the notification.
 */
const getNotificationTitle = (type) => {
    const titles = {
        info: 'System Information',
        warning: 'System Warning',
        error: 'System Error',
        success: 'Operation Successful',
        security: 'Security Alert'
    };
    return titles[type] || 'Notification';
};

/**
 * Helper function to get a random message for a notification type.
 * @param {string} type - The type of notification.
 * @returns {string} A random message for the notification.
 */
const getNotificationMessage = (type) => {
    const messages = {
        info: ['System backup completed successfully', 'New user registration', 'Server maintenance scheduled'],
        warning: ['High memory usage detected', 'SSL certificate expires soon', 'Unusual login pattern'],
        error: ['Database connection failed', 'Payment processing error', 'API endpoint unavailable'],
        success: ['Booking confirmed successfully', 'User profile updated', 'Email sent successfully'],
        security: ['Multiple failed login attempts', 'Suspicious activity detected', 'Unauthorized access attempt']
    };
    const typeMessages = messages[type] || ['System notification'];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
};

// Redux Slice for admin-related state and actions.
const adminSlice = createSlice({
    name: 'admin', // Name of the slice, used as a prefix for generated action types.
    initialState: {
        // Core data fetched from APIs.
        users: [],
        bookings: [],
        hotels: [],
        adminRequests: [],

        // Derived analytics data.
        analytics: {
            totalUsers: 0,
            totalBookings: 0,
            totalRevenue: 0,
            occupancyRate: 0,
            monthlyGrowth: 0
        },

        // System monitoring data.
        systemMonitoring: {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            networkLatency: 0,
            overallHealth: 'healthy',
            services: [],
            securityAlerts: []
        },

        // Activity logs.
        activityLogs: [],

        // Notifications and their settings.
        notifications: [],
        notificationSettings: {
            emailNotifications: true,
            smsNotifications: false,
            securityAlerts: true,
            bookingAlerts: true
        },

        // UI state indicators.
        loading: false, // Indicates if data is being fetched.
        error: null, // Stores any error that occurred during data fetching.
        lastUpdated: null // Timestamp of the last data refresh.
    },
    reducers: {
        // Standard reducer for setting loading state.
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Standard reducer for setting error state.
        setError: (state, action) => {
            state.error = action.payload;
        },

        // Reducer to update analytics data by regenerating it from current state.
        updateAnalytics: (state) => {
            state.analytics = generateAnalytics(state.users, state.bookings, state.hotels);
        },

        // Reducer to update system monitoring data by regenerating it.
        updateSystemData: (state) => {
            state.systemMonitoring = generateSystemMonitoring();
        },

        // Reducer to update activity logs by regenerating them.
        updateActivityLogs: (state) => {
            state.activityLogs = generateActivityLogs(state.users, state.bookings);
        },

        // Reducer to add a new notification to the list.
        addNotification: (state, action) => {
            state.notifications.unshift({ // Add new notification to the beginning of the array.
                id: Date.now(),
                timestamp: new Date().toISOString(),
                read: false,
                ...action.payload
            });
            state.notifications = state.notifications.slice(0, 50); // Keep only the last 50 notifications.
        },

        // Reducer to mark a specific notification as read.
        markNotificationAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification) notification.read = true;
        },

        // Reducer to mark all notifications as read.
        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
        },

        // Reducer to update notification settings.
        updateNotificationSettings: (state, action) => {
            state.notificationSettings = { ...state.notificationSettings, ...action.payload };
        },

        // Reducer to refresh all derived data (analytics, monitoring, logs, notifications).
        refreshData: (state) => {
            state.analytics = generateAnalytics(state.users, state.bookings, state.hotels);
            state.systemMonitoring = generateSystemMonitoring();
            state.activityLogs = generateActivityLogs(state.users, state.bookings);
            state.notifications = generateNotifications();
            state.lastUpdated = new Date().toISOString(); // Update the last updated timestamp.
        }
    },
    // Extra reducers handle actions dispatched by createAsyncThunk.
    extraReducers: (builder) => {
        builder
            // Handle the pending state of fetchAdminData.
            .addCase(fetchAdminData.pending, (state) => {
                state.loading = true; // Set loading to true.
                state.error = null; // Clear any previous errors.
            })
            // Handle the fulfilled state of fetchAdminData.
            .addCase(fetchAdminData.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false.
                // Populate core data from the fetched payload.
                state.users = action.payload.users;
                state.bookings = action.payload.bookings;
                state.hotels = action.payload.hotels;
                state.adminRequests = action.payload.adminRequests;
                // Generate and update derived data based on the newly fetched core data.
                state.analytics = generateAnalytics(action.payload.users, action.payload.bookings, action.payload.hotels);
                state.systemMonitoring = generateSystemMonitoring();
                state.activityLogs = generateActivityLogs(action.payload.users, action.payload.bookings);
                state.notifications = generateNotifications();
                state.lastUpdated = new Date().toISOString(); // Set the last updated timestamp.
            })
            // Handle the rejected state of fetchAdminData.
            .addCase(fetchAdminData.rejected, (state, action) => {
                state.loading = false; // Set loading to false.
                state.error = action.payload; // Store the error message.
            })
            // Handle the fulfilled state of updateSystemSettings.
            .addCase(updateSystemSettings.fulfilled, (state, action) => {
                // Update notification settings with the new settings.
                state.notificationSettings = { ...state.notificationSettings, ...action.payload };
            });
    }
});

// Export actions generated by createSlice for use in components.
export const {
    setLoading,
    setError,
    updateAnalytics,
    updateSystemData,
    updateActivityLogs,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateNotificationSettings,
    refreshData
} = adminSlice.actions;

// Export the reducer as default for Redux store configuration.
export default adminSlice.reducer;
