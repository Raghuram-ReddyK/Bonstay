import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material'; // Importing Material-UI components for UI elements
import {
    People,
    BookOnline,
    Assessment,
    Security,
    Timeline,
    Settings,
    ExitToApp,
    Notifications,
    Warning,
    CheckCircle,
    TrendingUp,
    Hotel,
    AttachMoney
} from '@mui/icons-material'; // Importing Material-UI icons

import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import axios from 'axios'; // HTTP client for making API requests

/**
 * AdminQuickActions Component
 * This component displays a quick overview for the admin dashboard, including:
 * - A welcome message for the admin.
 * - Quick statistics (total users, bookings, hotels, revenue).
 * - A list of quick action buttons to navigate to different admin sections.
 * - A section for system notifications and quick stats.
 *
 * It fetches some dynamic data (like pending requests) and uses props for other data.
 * @param {Object} props - Component props
 * @param {function} props.onTabChange - Callback function to change the active tab in the parent AdminLayout.
 * @param {Object} props.admin - Admin user object (e.g., { name: 'Admin', ... }).
 * @param {Array} props.allUsers - Array of all user data.
 * @param {Array} props.allBookings - Array of all booking data.
 * @param {Array} props.allHotels - Array of all hotel data.
 */
const AdminQuickActions = ({ onTabChange, admin, allUsers, allBookings, allHotels }) => {
    // useState hooks for managing component-specific state
    const [notifications, setNotifications] = useState([]); // State to hold system notifications
    const [quickStats, setQuickStats] = useState({ // State to hold quick statistics
        pendingRequests: 0,
        todayBookings: 0,
        systemAlerts: 0, // Mocked
        recentActivity: 0 // Mocked
    });
    const navigate = useNavigate(); // Hook to programmatically navigate between routes

    // useEffect hook to fetch quick stats and generate notifications on component mount or data change
    useEffect(() => {
        fetchQuickStats(); // Fetch dynamic quick stats
        generateNotifications(); // Generate static/mock notifications
    }, [allUsers, allBookings]); // Dependencies: allUsers and allBookings to re-run when these props change

    /**
     * Fetches quick statistics from the backend and updates the component's state.
     * This includes pending admin requests and today's bookings.
     */
    const fetchQuickStats = async () => {
        try {
            // Fetch admin code requests to count pending ones
            const adminRequestsRes = await axios.get('http://localhost:4000/admin-code-requests');
            const pendingRequests = adminRequestsRes.data.filter(req => req.status === 'pending').length;

            // Calculate today's bookings from the 'allBookings' prop
            const today = new Date().toDateString(); // Get today's date string for comparison
            const todayBookings = allBookings.filter(booking => {
                if (!booking.createdAt) return false; // Ensure createdAt exists
                return new Date(booking.createdAt).toDateString() === today; // Compare date strings
            }).length;

            // Update the quickStats state
            setQuickStats({
                pendingRequests,
                todayBookings,
                systemAlerts: Math.floor(Math.random() * 5) + 1, // Mock system alerts
                recentActivity: Math.floor(Math.random() * 20) + 10 // Mock recent activity
            });
        } catch (error) {
            console.error('Error fetching quick stats:', error); // Log any errors during API call
        }
    };

    /**
     * Generates a set of mock system notifications based on current quick stats.
     */
    const generateNotifications = () => {
        const notifications = [
            {
                id: 1,
                type: 'warning',
                title: 'Pending Admin Requests',
                message: `${quickStats.pendingRequests} admin code requests awaiting approval`,
                urgent: quickStats.pendingRequests > 5 // Mark as urgent if many pending requests
            },
            {
                id: 2,
                type: 'info',
                title: 'System Status',
                message: 'All systems operational',
                urgent: false
            },
            {
                id: 3,
                type: 'success',
                title: 'Daily Performance',
                message: `${quickStats.todayBookings} bookings completed today`,
                urgent: false
            }
        ];
        setNotifications(notifications); // Update the notifications state
    };

    // Array defining the quick action buttons and their properties
    const quickActions = [
        {
            title: 'View Analytics',
            description: 'Real-time dashboard with key metrics',
            icon: <Assessment />,
            color: 'primary',
            action: () => onTabChange(null, 0) // Navigates to the Analytics tab (index 0)
        },
        {
            title: 'Manage Users',
            description: 'Add, edit, or remove user accounts',
            icon: <People />,
            color: 'secondary',
            action: () => onTabChange(null, 2) // Navigates to the Users tab (index 1)
        },
        {
            title: 'Review Bookings',
            description: 'Monitor and manage all hotel bookings',
            icon: <BookOnline />,
            color: 'success',
            action: () => onTabChange(null, 3) // Navigates to the Bookings tab (index 2)
        },
        {
            title: 'Admin Requests',
            description: 'Process admin access requests',
            icon: <Security />,
            color: 'warning',
            badge: quickStats.pendingRequests, // Displays a badge with the number of pending requests
            action: () => onTabChange(null, 5) // Navigates to the Admin Requests tab (index 4)
        },
        {
            title: 'System Monitoring',
            description: 'Check system health and performance',
            icon: <Timeline />,
            color: 'info',
            action: () => onTabChange(null, 6) // Navigates to the System Monitoring tab (index 5)
        },
        {
            title: 'Activity Logs',
            description: 'View system and user activity logs',
            icon: <Timeline />, // Reusing Timeline icon, could be different if needed
            color: 'default',
            action: () => onTabChange(null, 7) // Navigates to the Activity Logs tab (index 6)
        }
    ];

    /**
     * Handles the logout action by clearing session storage and navigating to the login page.
     */
    const handleLogout = () => {
        sessionStorage.clear(); // Clears all items from session storage (e.g., auth tokens)
        navigate('/login'); // Redirects the user to the login page
    };

    // Main component render
    return (
        <Box>
            {/* Welcome Section */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Welcome back, {admin?.name || 'Admin'}! {/* Display admin's name or 'Admin' */}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Here's your admin control center. Monitor, manage, and optimize your hotel booking platform.
                            </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                            {/* Top right icons for notifications, settings, and logout */}
                            <Tooltip title="Notifications">
                                <IconButton color="inherit">
                                    <Notifications />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Settings">
                                <IconButton color="inherit">
                                    <Settings />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Logout">
                                <IconButton color="inherit" onClick={handleLogout}>
                                    <ExitToApp />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Quick Stats Cards */}
            <Grid container spacing={3} mb={3}>
                {/* Total Users Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" color="primary">
                                {allUsers.length} {/* Display total number of users */}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total Users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Bookings Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <BookOnline sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                            <Typography variant="h4" color="success.main">
                                {allBookings.length} {/* Display total number of bookings */}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total Bookings
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Active Hotels Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Hotel sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h4" color="warning.main">
                                {allHotels.length} {/* Display total number of hotels */}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Active Hotels
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Revenue Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AttachMoney sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                            <Typography variant="h4" color="info.main">
                                ₹{(allBookings.length * 1000).toLocaleString()} {/* Calculate and display total revenue */}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Total Revenue
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Quick Actions Section */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Map through the quickActions array to render each action button */}
                                {quickActions.map((action, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)', // Slight lift on hover
                                                    boxShadow: 4 // Increased shadow on hover
                                                }
                                            }}
                                            onClick={action.action} // Call the action function on click
                                        >
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <Box
                                                    sx={{
                                                        mr: 2,
                                                        p: 1,
                                                        borderRadius: '50%',
                                                        bgcolor: `${action.color}.main`, // Background color from action.color
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {action.icon} {/* Display the action icon */}
                                                </Box>
                                                <Box flex={1}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {action.title} {/* Action title */}
                                                        {action.badge > 0 && ( // Display badge if badge value is greater than 0
                                                            <Chip
                                                                label={action.badge}
                                                                size="small"
                                                                color="error" // Error color for badges
                                                                sx={{ ml: 1 }}
                                                            />
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {action.description} {/* Action description */}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Notifications & Quick Stats Section */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                System Notifications
                            </Typography>
                            <List dense>
                                {/* Map through the notifications array to render each notification */}
                                {notifications.map((notification) => (
                                    <React.Fragment key={notification.id}>
                                        <ListItem>
                                            <ListItemIcon>
                                                {/* Display icon based on notification type */}
                                                {notification.type === 'warning' && <Warning color="warning" />}
                                                {notification.type === 'info' && <CheckCircle color="info" />}
                                                {notification.type === 'success' && <TrendingUp color="success" />}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {notification.title} {/* Notification title */}
                                                        </Typography>
                                                        {notification.urgent && ( // Display 'Urgent' chip if notification is urgent
                                                            <Chip label="Urgent" size="small" color="error" />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={notification.message}
                                            />
                                        </ListItem>
                                        <Divider /> {/* Divider between notifications */}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Summary Card */}
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Stats
                            </Typography>
                            {/* Display individual quick stats */}
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2">Today's Bookings</Typography>
                                <Chip label={quickStats.todayBookings} size="small" color="primary" />
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2">Pending Requests</Typography>
                                <Chip
                                    label={quickStats.pendingRequests}
                                    size="small"
                                    color={quickStats.pendingRequests > 0 ? "warning" : "success"} // Color based on pending requests count
                                />
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2">System Alerts</Typography>
                                <Chip label={quickStats.systemAlerts} size="small" color="info" />
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Recent Activity</Typography>
                                <Chip label={quickStats.recentActivity} size="small" color="default" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminQuickActions;
