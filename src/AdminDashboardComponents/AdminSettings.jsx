import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Typography, Card, CardContent, Grid, Switch, FormControlLabel,
    TextField, Button, Alert, Chip, IconButton, Tooltip,
    Select, MenuItem, FormControl, InputLabel, Slider, LinearProgress,
} from '@mui/material';
import {
    Security, Notifications, Speed, Refresh,
    Save, Settings
    } from '@mui/icons-material';

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
     * @returns {{status: string, color: string}} An object containing the health status and its corresponding Material-UI color.
     */
    const getSystemHealth = () => {
        // If systemMonitoring data is not available, return 'unknown' status
        if (!systemMonitoring) return { status: 'unknown', color: 'grey' };
        
        const { cpuUsage, memoryUsage, diskUsage } = systemMonitoring;
        // Calculate average usage of key system resources
        const avgUsage = (cpuUsage + memoryUsage + diskUsage) / 3;
        
        // Determine overall health status based on average usage
        if (avgUsage < 50) return { status: 'Excellent', color: 'success' }; // Green for excellent health
        if (avgUsage < 70) return { status: 'Good', color: 'warning' }; // Orange for good (but potentially needing attention)
        return { status: 'Needs Attention', color: 'error' }; // Red for critical health
    };

    // Get the current system health status and color
    const systemHealth = getSystemHealth();

    // Main component render
    return (
        <Box sx={{ maxHeight: '500px', overflowY: 'auto', p: 2 }}> {/* Main container with scrollable content */}
            {/* Header section with title, system health chip, and refresh button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Admin Settings</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                    <Chip 
                        label={`System: ${systemHealth.status}`} // Display overall system health status
                        color={systemHealth.color} // Chip color based on health status
                        size="small" 
                    />
                    <Tooltip title="Refresh System Data">
                        <IconButton size="small" onClick={() => dispatch(refreshData())}>
                            <Refresh /> {/* Refresh icon */}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

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

                {/* Real-time System Metrics Section */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Real-time System Metrics</Typography>
                            {/* Conditionally render metrics if systemMonitoring data is available */}
                            {systemMonitoring ? (
                                <Grid container spacing={2}>
                                    {/* CPU Usage Progress Bar */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">CPU Usage</Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={systemMonitoring.cpuUsage} 
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="caption">{systemMonitoring.cpuUsage}%</Typography>
                                        </Box>
                                    </Grid>
                                    {/* Memory Usage Progress Bar */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">Memory Usage</Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={systemMonitoring.memoryUsage} 
                                                color="secondary"
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="caption">{systemMonitoring.memoryUsage}%</Typography>
                                        </Box>
                                    </Grid>
                                    {/* Disk Usage Progress Bar */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">Disk Usage</Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={systemMonitoring.diskUsage} 
                                                color="warning"
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="caption">{systemMonitoring.diskUsage}%</Typography>
                                        </Box>
                                    </Grid>
                                    {/* Network Latency Display */}
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">Network Latency</Typography>
                                            <Typography variant="h6" color="primary">
                                                {systemMonitoring.networkLatency}ms
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography color="textSecondary">Loading system metrics...</Typography>
                            )}
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
