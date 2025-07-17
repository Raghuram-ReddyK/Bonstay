import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Card, CardContent, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
    Tooltip, TextField, MenuItem, Select, FormControl, InputLabel,
    Pagination
} from '@mui/material';
import {
    Refresh, Search, Person, Hotel, Security,
    Login, Edit, Warning
} from '@mui/icons-material';

// Importing Redux actions from the adminSlice
import { fetchAdminData, refreshData } from '../Slices/adminSlice';

/**
 * AdminActivityLogs Component
 * This component displays a table of recent activity logs from the system.
 * It includes features for filtering logs by type, searching by text, and pagination.
 * Data is fetched from the Redux store and refreshed periodically.
 */
const AdminActivityLogs = () => {
    // useDispatch hook to get the dispatch function for dispatching Redux actions
    const dispatch = useDispatch();

    // useSelector hook to extract data from the Redux store's 'admin' slice
    // We need activityLogs, loading state (though not directly used in render logic here), and lastUpdated timestamp.
    const { activityLogs, loading, lastUpdated } = useSelector(state => state.admin);

    // useState hooks for managing component-specific state
    const [filteredLogs, setFilteredLogs] = useState([]); // State to hold logs after applying filters and search
    const [filterType, setFilterType] = useState('all'); // State for the selected log type filter (e.g., 'all', 'user_login')
    const [searchTerm, setSearchTerm] = useState(''); // State for the search term entered by the user
    const [page, setPage] = useState(1); // State for the current page number in pagination
    const logsPerPage = 10; // Constant defining how many logs to display per page

    // useEffect hook for initial data fetching and setting up periodic refresh
    useEffect(() => {
        // Fetch admin data (which includes activityLogs) only if activityLogs is empty or not yet loaded
        // This ensures data is fetched on initial component mount if not already present.
        if (!activityLogs || activityLogs.length === 0) {
            dispatch(fetchAdminData());
        }
        // Set up an interval to refresh all admin data (including activity logs) every 30 seconds
        const interval = setInterval(() => dispatch(refreshData()), 30000);
        // Cleanup function: Clear the interval when the component unmounts or dependencies change
        return () => clearInterval(interval);
    }, [dispatch, activityLogs]); // Dependencies: dispatch (stable) and activityLogs (to re-run if it becomes populated)

    // useEffect hook to apply filters and search whenever activityLogs, filterType, or searchTerm changes
    useEffect(() => {
        let filtered = activityLogs || []; // Start with all logs, or an empty array if logs are null/undefined

        // Apply type filter if a specific type is selected (not 'all')
        if (filterType !== 'all') {
            filtered = filtered.filter(log => log.type === filterType);
        }

        // Apply search term filter if a search term is provided
        if (searchTerm) {
            filtered = filtered.filter(log =>
                // Check if description or user name includes the search term (case-insensitive)
                log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.user.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredLogs(filtered); // Update the state with the filtered logs
        setPage(1); // Reset to the first page whenever filters or search terms change
    }, [activityLogs, filterType, searchTerm]); // Dependencies: activityLogs, filterType, searchTerm

    /**
     * Helper function to get the appropriate Material-UI icon component based on the log type.
     * @param {string} type - The type of the activity log (e.g., 'user_login', 'booking_created').
     * @returns {React.ElementType} The Material-UI icon component.
     */
    const getActionIcon = (type) => {
        switch (type) {
            case 'user_login':
            case 'user_logout':
                return Login; // Icon for login/logout activities
            case 'booking_created':
            case 'booking_modified':
                return Hotel; // Icon for booking-related activities
            case 'user_created':
            case 'user_updated':
                return Person; // Icon for user management activities
            case 'security_alert':
                return Security; // Icon for security alerts
            case 'system_error':
                return Warning; // Icon for system errors
            default:
                return Edit; // Default icon for other or unknown types
        }
    };

    /**
     * Helper function to get the appropriate Material-UI color for a chip/icon based on the log type.
     * @param {string} type - The type of the activity log.
     * @returns {string} The Material-UI color string ('success', 'info', 'error', 'warning', 'default').
     */
    const getActionColor = (type) => {
        switch (type) {
            case 'user_login':
            case 'booking_created':
            case 'user_created':
                return 'success'; // Green for creation/positive actions
            case 'user_logout':
            case 'booking_cancelled':
                return 'info'; // Blue for informational actions
            case 'security_alert':
            case 'system_error':
                return 'error'; // Red for critical/error actions
            case 'booking_modified':
            case 'user_updated':
                return 'warning'; // Orange for modification/warning actions
            default:
                return 'default'; // Default color for other types
        }
    };

    /**
     * Helper function to format a timestamp string into a more readable local date and time string.
     * @param {string} timestamp - The ISO string timestamp.
     * @returns {string} Formatted date and time string.
     */
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate logs for the current page based on pagination state
    const paginatedLogs = filteredLogs.slice((page - 1) * logsPerPage, page * logsPerPage);
    // Calculate total number of pages needed for pagination
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    // Main component render
    return (
        <Box>
            {/* Header section with title and refresh button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Activity Logs</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="textSecondary">
                        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
                    </Typography>
                    <Tooltip title="Refresh Logs">
                        <IconButton onClick={() => dispatch(refreshData())}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Filter and Search controls */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    placeholder="Search logs..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term state on input change
                    InputProps={{
                        startAdornment: <Search color="action" sx={{ mr: 1 }} /> // Search icon as adornment
                    }}
                    sx={{ minWidth: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter by Type</InputLabel>
                    <Select
                        value={filterType}
                        label="Filter by Type"
                        onChange={(e) => setFilterType(e.target.value)} // Update filter type state on selection change
                    >
                        <MenuItem value="all">All Activities</MenuItem>
                        <MenuItem value="user_login">User Login</MenuItem>
                        <MenuItem value="booking_created">Bookings</MenuItem>
                        <MenuItem value="user_created">User Management</MenuItem>
                        <MenuItem value="security_alert">Security</MenuItem>
                        <MenuItem value="system_error">Errors</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Activity Logs Table */}
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Recent Activity</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {filteredLogs.length} activities found
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} variant="outlined"> {/* Table container with Paper styling */}
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>IP Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Map through paginatedLogs to render each log entry */}
                                {paginatedLogs.map((log, index) => {
                                    const ActionIcon = getActionIcon(log.type); // Get dynamic icon for the log type
                                    return (
                                        <TableRow key={index} hover> {/* Use index as key, consider unique IDs if available */}
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {formatTimestamp(log.timestamp)} {/* Formatted timestamp */}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <ActionIcon fontSize="small" color={getActionColor(log.type)} /> {/* Icon with dynamic color */}
                                                    <Chip
                                                        label={log.type.replace('_', ' ')} // Format type string for display
                                                        size="small"
                                                        color={getActionColor(log.type)} // Chip color based on log type
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {log.user}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {log.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="textSecondary">
                                                    {log.ipAddress}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination control, displayed only if there's more than one page */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Pagination
                                count={totalPages} // Total number of pages
                                page={page} // Current active page
                                onChange={(e, value) => setPage(value)} // Handle page change
                                color="primary"
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminActivityLogs;
