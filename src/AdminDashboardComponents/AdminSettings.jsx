import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Typography, Card, CardContent, Grid, Switch, FormControlLabel,
    TextField, Button, Divider, Alert, Chip, IconButton, Tooltip,
    Select, MenuItem, FormControl, InputLabel, Slider, LinearProgress,
    List, ListItem, ListItemText, ListItemIcon, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Badge, // Added Badge
    Avatar, Stepper, Step, StepLabel, CircularProgress // Added Avatar, Stepper, Step, StepLabel, CircularProgress
} from '@mui/material'; // Importing Material-UI components for building the UI
import {
    Security, Notifications, Storage, Speed, Wifi, Refresh,
    Save, Settings, Email, Sms, Warning, Info, CheckCircle,
    Cloud, Shield, Key, Lock, Visibility, Dashboard, // Added Dashboard
    Timeline, TrendingUp, Memory, NetworkCheck // Added Timeline, TrendingUp, Memory, NetworkCheck
} from '@mui/icons-material'; // Importing Material-UI icons

// Importing Redux actions from the adminSlice
import { updateSystemSettings, refreshData } from '../Slices/adminSlice';

/**
 * AdminSettings Component
 * This component provides an interface for administrators to configure various system settings,
 * including general system options, security parameters, notification preferences,
 * performance tunings, and real-time system metrics. It integrates with Redux for state management.
 */
const AdminSettings = () => {
    // useDispatch hook to get the dispatch function for dispatching Redux actions
    const dispatch = useDispatch();

    // useSelector hook to extract specific data from the Redux store's 'admin' slice
    // We need notificationSettings (to initialize some form fields), systemMonitoring (for real-time metrics),
    // loading state (to disable buttons during save), and lastUpdated timestamp (for display).
    const { notificationSettings, systemMonitoring, loading, lastUpdated } = useSelector(state => state.admin);
    
    // useState hook to manage the local state of the settings form.
    // This state holds all the configurable parameters.
    const [settings, setSettings] = useState({
        // System Settings
        systemMaintenance: false, // Boolean for maintenance mode toggle
        autoBackup: true,         // Boolean for automatic backup toggle
        backupFrequency: 'daily', // String for backup frequency selection
        maxLoginAttempts: 5,      // Number for maximum login attempts
        sessionTimeout: 30,       // Number for user session timeout in minutes (slider)
        
        // Security Settings
        twoFactorAuth: true,      // Boolean for 2FA toggle
        passwordExpiry: 90,       // Number for password expiry days
        ipWhitelist: '',          // String for IP whitelist (text field)
        encryptionLevel: 'AES256',// String for encryption level selection
        securityLogging: true,    // Boolean for security logging toggle
        
        // Notification Settings (these will be synced with Redux state)
        emailNotifications: true,
        smsNotifications: false,
        securityAlerts: true,
        bookingAlerts: true,
        systemAlerts: true, // Additional notification type
        
        // Performance Settings
        cacheEnabled: true,       // Boolean for caching toggle
        compressionEnabled: true, // Boolean for compression toggle
        loadBalancing: true,      // Boolean for load balancing toggle (mocked, not interactive)
        maxConcurrentUsers: 100,  // Number for max concurrent users (slider)
        
        // Database Settings (mocked, not interactive)
        connectionPoolSize: 20,
        queryTimeout: 30,
        autoOptimize: true,
        
        // API Settings (mocked, not interactive)
        rateLimit: 1000,          // Number for API rate limit (slider)
        apiTimeout: 15,
        corsEnabled: true
    });

    // useState hook to manage the status of the save operation (null, 'saving', 'success', 'error')
    const [saveStatus, setSaveStatus] = useState(null);
    // State to hold the current time, used for the real-time clock display in the header.
    const [currentTime, setCurrentTime] = useState(new Date());
    // State to store the interval ID for the auto-refresh, allowing it to be cleared.
    const [refreshInterval, setRefreshInterval] = useState(null);

    // useEffect hook for real-time clock update.
    // Sets up an interval to update `currentTime` every second.
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        // Cleanup function: Clear the interval when the component unmounts.
        return () => clearInterval(timer);
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount.

    // useEffect hook for auto-refreshing system data.
    // Sets up an interval to dispatch `refreshData` action every 5 seconds.
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(refreshData());
        }, 5000); // Refresh every 5 seconds
        setRefreshInterval(interval); // Store the interval ID

        // Cleanup function: Clear the interval when the component unmounts or dependencies change.
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [dispatch]); // Dependency: dispatch (stable)

    // useEffect hook to synchronize notification settings from Redux state to local component state
    useEffect(() => {
        if (notificationSettings) {
            setSettings(prev => ({
                ...prev, // Keep existing settings
                ...notificationSettings // Override with values from Redux notificationSettings
            }));
        }
    }, [notificationSettings]); // Dependency: Re-run when notificationSettings from Redux changes

    /**
     * Handles changes to any setting in the form.
     * It updates the local `settings` state.
     * @param {string} category - The category of the setting (e.g., 'system', 'security').
     * @param {string} setting - The name of the setting field (e.g., 'systemMaintenance', 'maxLoginAttempts').
     * @param {any} value - The new value for the setting.
     */
    const handleSettingChange = (category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value // Dynamically update the specific setting field
        }));
    };

    /**
     * Handles the saving of all settings.
     * It dispatches the `updateSystemSettings` async thunk and manages the save status.
     */
    const handleSaveSettings = async () => {
        try {
            setSaveStatus('saving'); // Set status to 'saving'
            // Dispatch the Redux async thunk to update settings.
            // This will likely make an API call (mocked in adminSlice).
            await dispatch(updateSystemSettings(settings));
            setSaveStatus('success'); // Set status to 'success' on successful dispatch
            setTimeout(() => setSaveStatus(null), 3000); // Clear status after 3 seconds
        } catch (error) {
            setSaveStatus('error'); // Set status to 'error' on failure
            setTimeout(() => setSaveStatus(null), 3000); // Clear status after 3 seconds
        }
    };

    /**
     * Calculates the overall system health status based on real-time monitoring data.
     * It also assigns a numerical score for health.
     * @returns {{status: string, color: string, score: number}} An object containing the health status, its corresponding Material-UI color, and a score.
     */
    const getSystemHealth = () => {
        // If systemMonitoring data is not available, return 'unknown' status and score 0
        if (!systemMonitoring) return { status: 'unknown', color: 'grey', score: 0 };
        
        const { cpuUsage, memoryUsage, diskUsage, networkLatency } = systemMonitoring;
        // Calculate average usage of key system resources
        const avgUsage = (cpuUsage + memoryUsage + diskUsage) / 3;
        
        // Determine overall health status and score based on average usage
        if (avgUsage < 30) return { status: 'Excellent', color: 'success', score: 95 }; // Green for excellent health
        if (avgUsage < 50) return { status: 'Very Good', color: 'info', score: 85 }; // Blue for very good health
        if (avgUsage < 70) return { status: 'Good', color: 'warning', score: 70 }; // Orange for good (but potentially needing attention)
        return { status: 'Needs Attention', color: 'error', score: 45 }; // Red for critical health
    };

    /**
     * Formats the system uptime from seconds into a human-readable string (e.g., "2h 30m").
     * @returns {string} Formatted uptime string or 'N/A'.
     */
    const formatUptime = () => {
        if (!systemMonitoring?.uptime) return 'N/A'; // Return 'N/A' if uptime data is missing
        const hours = Math.floor(systemMonitoring.uptime / 3600); // Calculate hours
        const minutes = Math.floor((systemMonitoring.uptime % 3600) / 60); // Calculate remaining minutes
        return `${hours}h ${minutes}m`; // Return formatted string
    };

    // Get the current system health status, color, and score
    const systemHealth = getSystemHealth();

    // Main component render
    return (
        <Box sx={{ maxHeight: '600px', overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}> {/* Main container with scrollable content and light background */}
            {/* Enhanced Header with Real-time Dashboard Overview */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                    <Dashboard /> {/* Dashboard icon */}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Admin Control Center</Typography>
                                    <Typography variant="caption">
                                        {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()} {/* Display current time and date */}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box textAlign="center">
                                <Typography variant="h4" fontWeight="bold">{systemHealth.score}%</Typography> {/* Display system health score */}
                                <Typography variant="body2">System Health Score</Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={systemHealth.score} 
                                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} // Progress bar for health score
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Chip 
                                    label={`Status: ${systemHealth.status}`} // Display overall system health status
                                    color={systemHealth.color} 
                                    size="small"
                                    sx={{ color: 'white', fontWeight: 'bold' }} // White text for chip
                                />
                                <Chip 
                                    label={`Uptime: ${formatUptime()}`} // Display system uptime
                                    variant="outlined" 
                                    size="small"
                                    sx={{ color: 'white', borderColor: 'white' }} // Outlined chip with white border/text
                                />
                                <Tooltip title="Auto-refresh every 5 seconds">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => dispatch(refreshData())} // Manual refresh button
                                        sx={{ color: 'white', alignSelf: 'flex-start' }}
                                    >
                                        <Refresh /> {/* Refresh icon */}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Real-time System Metrics Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                        <Timeline color="primary" /> {/* Icon for Live System Metrics */}
                        Live System Metrics
                        <Badge badgeContent="LIVE" color="error" sx={{ ml: 1 }} /> {/* "LIVE" badge */}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* CPU Usage Metric */}
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#e3f2fd" borderRadius={2}> {/* Light blue background */}
                                <Memory color="primary" sx={{ fontSize: 40, mb: 1 }} /> {/* Memory icon */}
                                <Typography variant="h6">{systemMonitoring?.cpuUsage || 0}%</Typography> {/* CPU usage percentage */}
                                <Typography variant="caption">CPU Usage</Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={systemMonitoring?.cpuUsage || 0} 
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                        {/* Memory Usage Metric */}
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#f3e5f5" borderRadius={2}> {/* Light purple background */}
                                <Storage color="secondary" sx={{ fontSize: 40, mb: 1 }} /> {/* Storage icon */}
                                <Typography variant="h6">{systemMonitoring?.memoryUsage || 0}%</Typography> {/* Memory usage percentage */}
                                <Typography variant="caption">Memory</Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={systemMonitoring?.memoryUsage || 0} 
                                    color="secondary"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                        {/* Disk Space Usage Metric */}
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#fff3e0" borderRadius={2}> {/* Light orange background */}
                                <Storage sx={{ color: '#ff9800', fontSize: 40, mb: 1 }} /> {/* Storage icon (custom color) */}
                                <Typography variant="h6">{systemMonitoring?.diskUsage || 0}%</Typography> {/* Disk usage percentage */}
                                <Typography variant="caption">Disk Space</Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={systemMonitoring?.diskUsage || 0} 
                                    sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' } }} // Custom color for progress bar
                                />
                            </Box>
                        </Grid>
                        {/* Network Latency Metric */}
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#e8f5e8" borderRadius={2}> {/* Light green background */}
                                <NetworkCheck sx={{ color: '#4caf50', fontSize: 40, mb: 1 }} /> {/* NetworkCheck icon (custom color) */}
                                <Typography variant="h6">{systemMonitoring?.networkLatency || 0}ms</Typography> {/* Network latency in ms */}
                                <Typography variant="caption">Network Latency</Typography>
                                <Box display="flex" justifyContent="center" mt={1}>
                                    <CircularProgress 
                                        variant="determinate" 
                                        // Value for circular progress: 100 minus latency (higher latency = lower progress)
                                        value={Math.max(0, 100 - (systemMonitoring?.networkLatency || 0))} 
                                        size={30}
                                        sx={{ color: '#4caf50' }} // Custom color for circular progress
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Save Status Alert */}
            {saveStatus && ( // Display alert only when saveStatus is not null
                <Alert 
                    severity={saveStatus === 'success' ? 'success' : saveStatus === 'error' ? 'error' : 'info'} // Alert severity based on save status
                    sx={{ mb: 2 }}
                >
                    {saveStatus === 'saving' && 'Saving settings...'}
                    {saveStatus === 'success' && 'Settings saved successfully!'}
                    {saveStatus === 'error' && 'Error saving settings. Please try again.'}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* System Settings Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Settings color="primary" /> {/* Icon for System Settings */}
                                <Typography variant="h6">System Settings</Typography>
                            </Box>
                            
                            {/* Maintenance Mode Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.systemMaintenance}
                                        onChange={(e) => handleSettingChange('system', 'systemMaintenance', e.target.checked)}
                                    />
                                }
                                label="Maintenance Mode"
                            />
                            
                            {/* Auto Backup Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.autoBackup}
                                        onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                                    />
                                }
                                label="Auto Backup"
                            />

                            {/* Backup Frequency Select */}
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Backup Frequency</InputLabel>
                                <Select
                                    value={settings.backupFrequency}
                                    label="Backup Frequency"
                                    onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                                >
                                    <MenuItem value="hourly">Hourly</MenuItem>
                                    <MenuItem value="daily">Daily</MenuItem>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Session Timeout Slider */}
                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>Session Timeout (minutes)</Typography>
                                <Slider
                                    value={settings.sessionTimeout}
                                    onChange={(e, value) => handleSettingChange('system', 'sessionTimeout', value)}
                                    min={5}
                                    max={120}
                                    valueLabelDisplay="auto" // Displays the current value when sliding
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Security Settings Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Security color="error" /> {/* Icon for Security Settings */}
                                <Typography variant="h6">Security Settings</Typography>
                            </Box>
                            
                            {/* Two-Factor Authentication Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.twoFactorAuth}
                                        onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                                    />
                                }
                                label="Two-Factor Authentication"
                            />
                            
                            {/* Security Logging Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.securityLogging}
                                        onChange={(e) => handleSettingChange('security', 'securityLogging', e.target.checked)}
                                    />
                                }
                                label="Security Logging"
                            />

                            {/* Max Login Attempts Text Field */}
                            <TextField
                                fullWidth
                                label="Max Login Attempts"
                                type="number"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                sx={{ mt: 2 }}
                            />

                            {/* Encryption Level Select */}
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Encryption Level</InputLabel>
                                <Select
                                    value={settings.encryptionLevel}
                                    label="Encryption Level"
                                    onChange={(e) => handleSettingChange('security', 'encryptionLevel', e.target.value)}
                                >
                                    <MenuItem value="AES128">AES 128-bit</MenuItem>
                                    <MenuItem value="AES256">AES 256-bit</MenuItem>
                                    <MenuItem value="RSA2048">RSA 2048-bit</MenuItem>
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Notification Settings Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Notifications color="info" /> {/* Icon for Notification Settings */}
                                <Typography variant="h6">Notification Settings</Typography>
                            </Box>
                            
                            {/* Email Notifications Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                    />
                                }
                                label="Email Notifications"
                            />
                            
                            {/* SMS Notifications Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.smsNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                                    />
                                }
                                label="SMS Notifications"
                            />

                            {/* Security Alerts Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.securityAlerts}
                                        onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                                    />
                                }
                                label="Security Alerts"
                            />

                            {/* Booking Alerts Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.bookingAlerts}
                                        onChange={(e) => handleSettingChange('notifications', 'bookingAlerts', e.target.checked)}
                                    />
                                }
                                label="Booking Alerts"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Settings Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Speed color="success" /> {/* Icon for Performance Settings */}
                                <Typography variant="h6">Performance Settings</Typography>
                            </Box>
                            
                            {/* Enable Caching Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.cacheEnabled}
                                        onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                                    />
                                }
                                label="Enable Caching"
                            />
                            
                            {/* Enable Compression Switch */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.compressionEnabled}
                                        onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
                                    />
                                }
                                label="Enable Compression"
                            />

                            {/* Max Concurrent Users Slider */}
                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>Max Concurrent Users</Typography>
                                <Slider
                                    value={settings.maxConcurrentUsers}
                                    onChange={(e, value) => handleSettingChange('performance', 'maxConcurrentUsers', value)}
                                    min={50}
                                    max={500}
                                    step={25}
                                    valueLabelDisplay="auto"
                                />
                            </Box>

                            {/* API Rate Limit Slider */}
                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>API Rate Limit (requests/minute)</Typography>
                                <Slider
                                    value={settings.rateLimit}
                                    onChange={(e, value) => handleSettingChange('api', 'rateLimit', value)}
                                    min={100}
                                    max={5000}
                                    step={100}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<Save />} // Save icon
                    onClick={handleSaveSettings} // Call save handler on click
                    disabled={loading || saveStatus === 'saving'} // Disable button when loading or saving
                    size="large"
                >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save All Settings'} {/* Dynamic button text */}
                </Button>
            </Box>
        </Box>
    );
};

export default AdminSettings;
