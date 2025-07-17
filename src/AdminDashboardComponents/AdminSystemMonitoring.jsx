import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Card, CardContent, Grid, Typography, Chip, LinearProgress,
    Alert, IconButton, Tooltip, List, ListItem, ListItemText,
    ListItemIcon, Divider
} from '@mui/material'; 
import {
    Computer, Storage, Wifi, Speed, Refresh, CheckCircle,
    Warning, Error, Memory, Security
} from '@mui/icons-material';

// Importing Redux actions from the adminSlice
import { fetchAdminData, refreshData } from '../Slices/adminSlice';

/**
 * AdminSystemMonitoring Component
 * This component displays real-time system monitoring data for an admin dashboard.
 * It fetches system health, service statuses, and security alerts from the Redux store
 * and updates them periodically.
 */
const AdminSystemMonitoring = () => {
    // useDispatch hook to get the dispatch function for dispatching actions
    const dispatch = useDispatch();

    // useSelector hook to extract specific data from the Redux store's 'admin' slice
    // We need systemMonitoring data, loading state, and the lastUpdated timestamp.
    const { systemMonitoring, loading, lastUpdated } = useSelector(state => state.admin);

    // useEffect hook to handle initial data fetching and periodic refreshing
    useEffect(() => {
        // Fetch admin data (which includes systemMonitoring) only if systemMonitoring is empty or not yet loaded
        // This ensures data is fetched on initial component mount if not already present.
        if (!systemMonitoring || Object.keys(systemMonitoring).length === 0) {
            dispatch(fetchAdminData());
        }
        // Set up an interval to refresh all admin data (including system monitoring) every 15 seconds
        const interval = setInterval(() => dispatch(refreshData()), 15000);
        // Cleanup function: Clear the interval when the component unmounts or dependencies change
        return () => clearInterval(interval);
    }, [dispatch, systemMonitoring]); // Dependencies: dispatch (stable) and systemMonitoring (to re-run if it becomes populated)

    /**
     * Helper function to determine the Material-UI color based on a status string.
     * @param {string} status - The status string (e.g., 'healthy', 'warning', 'critical', 'online', 'offline').
     * @returns {string} The corresponding Material-UI color ('success', 'warning', 'error', 'default').
     */
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
            case 'online':
            case 'connected':
                return 'success'; // Green for good status
            case 'warning':
            case 'moderate':
                return 'warning'; // Orange for caution/warning
            case 'error':
            case 'critical':
            case 'offline':
                return 'error'; // Red for critical issues
            default:
                return 'default'; // Default color for unknown status
        }
    };

    /**
     * Helper function to get the appropriate Material-UI icon based on a status string.
     * @param {string} status - The status string.
     * @returns {React.ElementType} The Material-UI icon component.
     */
    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
            case 'online':
            case 'connected':
                return CheckCircle; // Checkmark for healthy/online
            case 'warning':
            case 'moderate':
                return Warning; // Warning icon for caution
            case 'error':
            case 'critical':
            case 'offline':
                return Error; // Error icon for critical/offline
            default:
                return Computer; // Default icon
        }
    };

    /**
     * SystemMetricCard Sub-component
     * A reusable component to display a single system metric with its value, status, icon, and progress bar.
     * @param {Object} props - Component props
     * @param {string} props.title - The title of the metric (e.g., "CPU Usage")
     * @param {string} props.value - The value of the metric (e.g., "75%")
     * @param {string} props.status - The health status of the metric (e.g., "warning")
     * @param {React.ElementType} props.icon - The Material-UI icon component for the metric
     * @param {string} props.color - A primary color for the icon and value text
     * @param {string} [props.details] - Optional additional details text
     */
    const SystemMetricCard = ({ title, value, status, icon: Icon, color, details }) => (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Icon sx={{ color, fontSize: 24 }} /> {/* Icon with specified color and size */}
                        <Typography variant="h6">{title}</Typography>
                    </Box>
                    <Chip label={status} color={getStatusColor(status)} size="small" /> {/* Status chip with dynamic color */}
                </Box>
                <Typography variant="h4" color={color} fontWeight="bold" mb={1}>
                    {value}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={parseFloat(value) || 0} // Parse value to float for progress bar, default to 0 if invalid
                    color={getStatusColor(status)} // Progress bar color based on status
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                {details && (
                    <Typography variant="body2" color="textSecondary">
                        {details}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    // Display a loading message if systemMonitoring data is not yet available
    if (!systemMonitoring || Object.keys(systemMonitoring).length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography>Loading system monitoring data...</Typography>
            </Box>
        );
    }

    // Main component render
    return (
        <Box>
            {/* Header section with title and refresh button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">System Monitoring</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="textSecondary">
                        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
                    </Typography>
                    <Tooltip title="Refresh System Status">
                        <IconButton onClick={() => dispatch(refreshData())}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Overall System Health Alert (displayed only if not 'healthy') */}
            {systemMonitoring.overallHealth !== 'healthy' && (
                <Alert severity={systemMonitoring.overallHealth === 'warning' ? 'warning' : 'error'} sx={{ mb: 3 }}>
                    System health: {systemMonitoring.overallHealth}. Please check individual components.
                </Alert>
            )}

            {/* Grid for displaying core system metric cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <SystemMetricCard
                        title="CPU Usage"
                        value={`${systemMonitoring.cpuUsage}%`}
                        status={systemMonitoring.cpuStatus}
                        icon={Speed}
                        color="#3f51b5" // Blue color for CPU
                        details="8 cores available"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SystemMetricCard
                        title="Memory"
                        value={`${systemMonitoring.memoryUsage}%`}
                        status={systemMonitoring.memoryStatus}
                        icon={Memory}
                        color="#4caf50" // Green color for Memory
                        details="16GB total"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SystemMetricCard
                        title="Storage"
                        value={`${systemMonitoring.diskUsage}%`}
                        status={systemMonitoring.diskStatus}
                        icon={Storage}
                        color="#ff9800" // Orange color for Storage
                        details="500GB available"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SystemMetricCard
                        title="Network"
                        value={`${systemMonitoring.networkLatency}ms`}
                        status={systemMonitoring.networkStatus}
                        icon={Wifi}
                        color="#9c27b0" // Purple color for Network
                        details="Response time"
                    />
                </Grid>
            </Grid>

            {/* Grid for Service Status and Security Alerts sections */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Service Status</Typography>
                            <List dense>
                                {systemMonitoring.services && systemMonitoring.services.map((service, index) => {
                                    const StatusIcon = getStatusIcon(service.status); // Dynamically get icon based on service status
                                    return (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <StatusIcon color={getStatusColor(service.status)} /> {/* Icon with dynamic color */}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={service.name}
                                                    secondary={`Status: ${service.status} | Uptime: ${service.uptime}`}
                                                />
                                            </ListItem>
                                            {/* Add a divider between list items, but not after the last one */}
                                            {index < systemMonitoring.services.length - 1 && <Divider />}
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Security Alerts</Typography>
                            <List dense>
                                {systemMonitoring.securityAlerts && systemMonitoring.securityAlerts.map((alert, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemIcon>
                                                {/* Security icon with color based on alert severity */}
                                                <Security color={alert.severity === 'high' ? 'error' : 'warning'} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={alert.message}
                                                secondary={`Severity: ${alert.severity} | ${new Date(alert.timestamp).toLocaleString()}`}
                                            />
                                        </ListItem>
                                        {/* Add a divider between list items, but not after the last one */}
                                        {index < systemMonitoring.securityAlerts.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminSystemMonitoring;
