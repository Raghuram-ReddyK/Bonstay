import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Card, CardContent, Grid, Typography, IconButton, Tooltip,
    Chip, LinearProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material'; // Importing Material-UI components for UI
import {
    TrendingUp, People, Hotel, BookOnline, AttachMoney, Refresh
} from '@mui/icons-material'; // Importing Material-UI icons
import { fetchAdminData, refreshData } from '../Slices/adminSlice';

// Importing Redux actions from the adminSlice
/**
 * AdminAnalytics Component
 * This component displays various analytics and recent booking data for an admin dashboard.
 * It fetches data from the Redux store and updates it periodically.
 */
const AdminAnalytics = () => {
    // useDispatch hook to get the dispatch function for dispatching actions
    const dispatch = useDispatch();

    // useSelector hook to extract data from the Redux store's 'admin' slice
    const { analytics, users, bookings, hotels, loading, lastUpdated } = useSelector(state => state.admin);

    // useEffect hook to handle data fetching and periodic refreshing
    useEffect(() => {
        // Fetch admin data only if the users array is empty (initial load)
        if (users.length === 0) {
            dispatch(fetchAdminData());
        }
        // Set up an interval to refresh data every 30 seconds
        const interval = setInterval(() => dispatch(refreshData()), 30000);
        // Cleanup function to clear the interval when the component unmounts or dependencies change
        return () => clearInterval(interval);
    }, [dispatch, users.length]); // Dependencies: dispatch (stable) and users.length (to prevent re-fetching if data exists)

    /**
     * MetricCard Sub-component
     * A reusable component to display a single metric card with an icon, title, value, and optional subtitle/trend.
     * @param {Object} props - Component props
     * @param {string} props.title - The title of the metric
     * @param {string|number} props.value - The main value of the metric
     * @param {React.ElementType} props.icon - The Material-UI icon component
     * @param {string} props.color - The primary color for the card and icon
     * @param {string} [props.subtitle] - Optional subtitle text
     * @param {number} [props.trend] - Optional trend percentage to display with a chip
     */
    const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" color={color} fontWeight="bold">
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="textSecondary">
                                {subtitle}
                            </Typography>
                        )}
                        {trend && (
                            <Chip icon={<TrendingUp />} label={`+${trend}%`} size="small" color="success" sx={{ mt: 1 }} />
                        )}
                    </Box>
                    <Box sx={{ backgroundColor: color, borderRadius: '50%', p: 1, display: 'flex' }}>
                        <Icon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    // Memoized calculation for top hotels based on booking counts
    const topHotels = React.useMemo(() => {
        const hotelCounts = {};
        // Iterate through bookings to count occurrences of each hotel
        bookings.forEach(booking => {
            const name = booking.hotelName || `Hotel ${booking.hotelId}`; // Use hotelName if available, otherwise fallback
            hotelCounts[name] = (hotelCounts[name] || 0) + 1;
        });
        // Convert the counts object to an array of [name, count] pairs, sort by count descending, and take the top 5
        return Object.entries(hotelCounts)
            .sort(([,a], [,b]) => b - a) // Sort by booking count in descending order
            .slice(0, 5) // Get only the top 5 hotels
            .map(([name, count]) => ({ name, bookings: count })); // Map to an array of objects
    }, [bookings]); // Recalculate only when 'bookings' data changes

    // Memoized calculation for recent bookings
    const recentBookings = React.useMemo(() => 
        bookings
            .filter(b => b.createdAt) // Ensure booking has a createdAt timestamp
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date in descending order (most recent first)
            .slice(0, 8), // Get only the 8 most recent bookings
        [bookings] // Recalculate only when 'bookings' data changes
    );

    // Main component render
    return (
        <Box>
            {/* Header section with title and refresh button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Analytics Dashboard</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="textSecondary">
                        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
                    </Typography>
                    <Tooltip title="Refresh Analytics">
                        <IconButton onClick={() => dispatch(refreshData())}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Grid for displaying key metric cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Users"
                        value={analytics.totalUsers}
                        icon={People}
                        color="#3f51b5" // Primary color for users
                        subtitle={`${analytics.adminUsers} Admins, ${analytics.regularUsers} Users`}
                        trend={analytics.userGrowthRate}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Bookings"
                        value={analytics.totalBookings}
                        icon={BookOnline}
                        color="#4caf50" // Success color for bookings
                        subtitle={`${analytics.confirmedBookings} Confirmed`}
                        trend={analytics.monthlyGrowth}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Revenue"
                        value={`₹${analytics.totalRevenue.toLocaleString()}`} // Format revenue with Indian Rupee symbol
                        icon={AttachMoney}
                        color="#ff9800" // Warning color for revenue
                        subtitle="This month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Occupancy Rate"
                        value={`${analytics.occupancyRate}%`}
                        icon={Hotel}
                        color="#9c27b0" // Purple color for hotels/occupancy
                        subtitle={`${hotels.length} Hotels active`}
                    />
                </Grid>
            </Grid>

            {/* Grid for Booking Status and Top Hotels sections */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Booking Status</Typography>
                            {/* Confirmed Bookings Progress Bar */}
                            <Box mb={2}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">Confirmed</Typography>
                                    <Typography variant="body2">{analytics.confirmedBookings}</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={analytics.totalBookings > 0 ? (analytics.confirmedBookings / analytics.totalBookings) * 100 : 0}
                                    sx={{ height: 8, borderRadius: 4 }}
                                    color="success"
                                />
                            </Box>
                            {/* Pending Bookings Progress Bar */}
                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">Pending</Typography>
                                    <Typography variant="body2">{analytics.pendingBookings}</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={analytics.totalBookings > 0 ? (analytics.pendingBookings / analytics.totalBookings) * 100 : 0}
                                    sx={{ height: 8, borderRadius: 4 }}
                                    color="warning"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Top Hotels</Typography>
                            {/* List of top hotels by bookings */}
                            {topHotels.map((hotel, index) => (
                                <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Chip label={index + 1} size="small" color={index === 0 ? "primary" : "default"} />
                                        <Typography variant="body2">{hotel.name}</Typography>
                                    </Box>
                                    <Typography variant="body2">{hotel.bookings} bookings</Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Bookings Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Recent Bookings</Typography>
                    <TableContainer component={Paper}> {/* Use Paper for elevation and styling */}
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Hotel</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>{booking.id}</TableCell>
                                        <TableCell>{booking.hotelName || `Hotel ${booking.hotelId}`}</TableCell>
                                        <TableCell>{booking.userId}</TableCell>
                                        <TableCell>
                                            {new Date(booking.createdAt).toLocaleDateString()} {/* Format date */}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={booking.status || 'confirmed'} // Default to 'confirmed' if status is missing
                                                size="small"
                                                color={booking.status === 'confirmed' || !booking.status ? 'success' : 'warning'} // Color based on status
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminAnalytics;
