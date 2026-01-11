import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Dashboard,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/apiConfig';
import axios from 'axios';

const AdminQuickActions = ({ onTabChange, admin, allUsers, allBookings, allHotels, dashboardLayout }) => {
    const [notifications, setNotifications] = useState([]);
    const [quickStats, setQuickStats] = useState({
        pendingRequests: 0,
        todayBookings: 0,
        systemAlerts: 0,
        recentActivity: 0
    });
    const navigate = useNavigate();

    // Get grid configuration based on dashboard layout preference
    const getGridItemSize = () => {
        switch (dashboardLayout) {
            case 'list':
                return { xs: 12, sm: 12, md: 12 }; // Full width for list view
            case 'compact':
                return { xs: 6, sm: 4, md: 2 }; // More compact layout
            case 'grid':
            default:
                return { xs: 12, sm: 6, md: 3 }; // Default grid layout
        }
    };

    const gridItemSize = getGridItemSize();

    useEffect(() => {
        fetchQuickStats();
        generateNotifications();
    }, [allUsers, allBookings]);

    const fetchQuickStats = async () => {
        try {
            // Get admin code requests
            const adminRequestsRes = await axios.get(getApiUrl('/admin-code-requests'));
            const pendingRequests = adminRequestsRes.data.filter(req => req.status === 'pending').length;

            // Get today's bookings
            const today = new Date().toDateString();
            const todayBookings = (allBookings || []).filter(booking => {
                if (!booking.createdAt) return false;
                return new Date(booking.createdAt).toDateString() === today;
            }).length;

            setQuickStats({
                pendingRequests,
                todayBookings,
                systemAlerts: Math.floor(Math.random() * 5) + 1, // Mock alerts
                recentActivity: Math.floor(Math.random() * 20) + 10 // Mock activity
            });
        } catch (error) {
            console.error('Error fetching quick stats:', error);
        }
    };

    const generateNotifications = () => {
        const notifications = [
            {
                id: 1,
                type: 'warning',
                title: 'Pending Admin Requests',
                message: `${quickStats.pendingRequests} admin code requests awaiting approval`,
                urgent: quickStats.pendingRequests > 5
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
        setNotifications(notifications);
    };

    const quickActions = [
        {
            title: 'View Analytics',
            description: 'Real-time dashboard with key metrics',
            icon: <Assessment />,
            color: 'primary',
            action: () => onTabChange(null, 0)
        },
        {
            title: 'Manage Users',
            description: 'Add, edit, or remove user accounts',
            icon: <People />,
            color: 'secondary',
            action: () => onTabChange(null, 2)
        },
        {
            title: 'Review Bookings',
            description: 'Monitor and manage all hotel bookings',
            icon: <BookOnline />,
            color: 'success',
            action: () => onTabChange(null, 3)
        },
        {
            title: 'Admin Requests',
            description: 'Process admin access requests',
            icon: <Security />,
            color: 'warning',
            badge: quickStats.pendingRequests,
            action: () => onTabChange(null, 5)
        },
        {
            title: 'System Monitoring',
            description: 'Check system health and performance',
            icon: <Timeline />,
            color: 'info',
            action: () => onTabChange(null, 6)
        },
        {
            title: 'Activity Logs',
            description: 'View system and user activity logs',
            icon: <Timeline />,
            color: 'default',
            action: () => onTabChange(null, 7)
        }
    ];

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <Box>
            {/* Welcome Section */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Welcome back, {admin?.name || 'Admin'}!
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Here's your admin control center. Monitor, manage, and optimize your hotel booking platform.
                            </Typography>
                        </Box>
                        {/* <Box display="flex" gap={1}>
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
                        </Box> */}
                    </Box>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Grid container spacing={dashboardLayout === 'compact' ? 2 : 3} mb={3}>
                <Grid item {...gridItemSize}>
                    <Card sx={{ height: dashboardLayout === 'list' ? 'auto' : '150px' }}>
                        <CardContent sx={{
                            textAlign: dashboardLayout === 'list' ? 'left' : 'center',
                            display: dashboardLayout === 'list' ? 'flex' : 'block',
                            alignItems: dashboardLayout === 'list' ? 'center' : 'initial',
                            gap: dashboardLayout === 'list' ? 2 : 0
                        }}>
                            <People sx={{
                                fontSize: dashboardLayout === 'compact' ? 30 : 40,
                                color: 'primary.main',
                                mb: dashboardLayout === 'list' ? 0 : 1
                            }} />
                            <Box>
                                <Typography
                                    variant={dashboardLayout === 'compact' ? 'h5' : 'h4'}
                                    color="primary"
                                >
                                    {(allUsers || []).length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Users
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item {...gridItemSize}>
                    <Card sx={{ height: dashboardLayout === 'list' ? 'auto' : '150px' }}>
                        <CardContent sx={{
                            textAlign: dashboardLayout === 'list' ? 'left' : 'center',
                            display: dashboardLayout === 'list' ? 'flex' : 'block',
                            alignItems: dashboardLayout === 'list' ? 'center' : 'initial',
                            gap: dashboardLayout === 'list' ? 2 : 0
                        }}>
                            <BookOnline sx={{
                                fontSize: dashboardLayout === 'compact' ? 30 : 40,
                                color: 'success.main',
                                mb: dashboardLayout === 'list' ? 0 : 1
                            }} />
                            <Box>
                                <Typography
                                    variant={dashboardLayout === 'compact' ? 'h5' : 'h4'}
                                    color="success.main"
                                >
                                    {(allBookings || []).length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Bookings
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item {...gridItemSize}>
                    <Card sx={{ height: dashboardLayout === 'list' ? 'auto' : '150px' }}>
                        <CardContent sx={{
                            textAlign: dashboardLayout === 'list' ? 'left' : 'center',
                            display: dashboardLayout === 'list' ? 'flex' : 'block',
                            alignItems: dashboardLayout === 'list' ? 'center' : 'initial',
                            gap: dashboardLayout === 'list' ? 2 : 0
                        }}>
                            <Hotel sx={{
                                fontSize: dashboardLayout === 'compact' ? 30 : 40,
                                color: 'warning.main',
                                mb: dashboardLayout === 'list' ? 0 : 1
                            }} />
                            <Box>
                                <Typography
                                    variant={dashboardLayout === 'compact' ? 'h5' : 'h4'}
                                    color="warning.main"
                                >
                                    {(allHotels || []).length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Active Hotels
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item {...gridItemSize}>
                    <Card sx={{ height: dashboardLayout === 'list' ? 'auto' : '150px' }}>
                        <CardContent sx={{
                            textAlign: dashboardLayout === 'list' ? 'left' : 'center',
                            display: dashboardLayout === 'list' ? 'flex' : 'block',
                            alignItems: dashboardLayout === 'list' ? 'center' : 'initial',
                            gap: dashboardLayout === 'list' ? 2 : 0
                        }}>
                            <AttachMoney sx={{
                                fontSize: dashboardLayout === 'compact' ? 30 : 40,
                                color: 'info.main',
                                mb: dashboardLayout === 'list' ? 0 : 1
                            }} />
                            <Box>
                                <Typography
                                    variant={dashboardLayout === 'compact' ? 'h5' : 'h4'}
                                    color="info.main"
                                >
                                    ₹{((allBookings || []).length * 1000).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Revenue
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                {quickActions.map((action, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 4
                                                }
                                            }}
                                            onClick={action.action}
                                        >
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <Box
                                                    sx={{
                                                        mr: 2,
                                                        p: 1,
                                                        borderRadius: '50%',
                                                        bgcolor: `${action.color}.main`,
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {action.icon}
                                                </Box>
                                                <Box flex={1}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {action.title}
                                                    </Typography>
                                                    {action.badge > 0 && (
                                                        <Chip
                                                            label={action.badge}
                                                            size="small"
                                                            color="error"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {action.description}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Notifications & Alerts */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                System Notifications
                            </Typography>
                            <List dense>
                                {notifications.map((notification) => (
                                    <React.Fragment key={notification.id}>
                                        <ListItem>
                                            <ListItemIcon>
                                                {notification.type === 'warning' && <Warning color="warning" />}
                                                {notification.type === 'info' && <CheckCircle color="info" />}
                                                {notification.type === 'success' && <TrendingUp color="success" />}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {notification.title}
                                                        </Typography>
                                                        {notification.urgent && (
                                                            <Chip label="Urgent" size="small" color="error" />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={notification.message}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Stats
                            </Typography>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2">Today's Bookings</Typography>
                                <Chip label={quickStats.todayBookings} size="small" color="primary" />
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2">Pending Requests</Typography>
                                <Chip
                                    label={quickStats.pendingRequests}
                                    size="small"
                                    color={quickStats.pendingRequests > 0 ? "warning" : "success"}
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
