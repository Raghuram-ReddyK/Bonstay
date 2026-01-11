import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Typography, Card, CardContent, Grid, Switch, FormControlLabel,
    TextField, Button, Alert, Chip, IconButton, Tooltip,
    Select, MenuItem, FormControl, InputLabel, Slider, LinearProgress,
    Badge,
    Avatar, CircularProgress, Stack,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
    Security, Notifications, Storage, Speed, Refresh,
    Save, Settings, Dashboard,
    Timeline, Memory, NetworkCheck, Person,
    Language, Palette, ExpandMore, AdminPanelSettings
} from '@mui/icons-material';
import { updateSystemSettings, refreshData, updateAdminPreference } from '../Slices/adminSlice';
import { setTheme } from '../Slices/themeSlice';

const AdminSettings = () => {
    const dispatch = useDispatch();
    const { notificationSettings, systemMonitoring, loading, lastUpdated, adminPreferences } = useSelector(state => state.admin);
    const colorScheme = useSelector((state) => state.theme.colorScheme);

    const [settings, setSettings] = useState({
        // System Settings
        systemMaintenance: false,
        autoBackup: true,
        backupFrequency: 'daily',
        maxLoginAttempts: 5,
        sessionTimeout: 30,

        // Security Settings
        twoFactorAuth: true,
        passwordExpiry: 90,
        ipWhitelist: '',
        encryptionLevel: 'AES256',
        securityLogging: true,

        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        securityAlerts: true,
        bookingAlerts: true,
        systemAlerts: true,

        // Performance Settings
        cacheEnabled: true,
        compressionEnabled: true,
        loadBalancing: true,
        maxConcurrentUsers: 100,

        // Database Settings
        connectionPoolSize: 20,
        queryTimeout: 30,
        autoOptimize: true,

        // API Settings
        rateLimit: 1000,
        apiTimeout: 15,
        corsEnabled: true
    });

    const [saveStatus, setSaveStatus] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [refreshInterval, setRefreshInterval] = useState(null);

    // Real-time clock update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-refresh system data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(refreshData());
        }, 5000);
        setRefreshInterval(interval);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [dispatch]);

    useEffect(() => {
        if (notificationSettings) {
            setSettings(prev => ({
                ...prev,
                ...notificationSettings
            }));
        }
    }, [notificationSettings]);

    const handleSettingChange = (_category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handlePreferenceChange = (preference, value) => {
        dispatch(updateAdminPreference({ [preference]: value }))
    };

    const handleThemeChange = (newTheme) => {
        dispatch(setTheme(newTheme));
        handlePreferenceChange('theme', newTheme);
    };

    const themeOptions = [
        { value: 'default', label: 'Default (Dark)', color: '#121212' },
        { value: 'blue', label: 'Blue', color: '#1976d2' },
        { value: 'red', label: 'Yellow', color: '#f57c00' },
        { value: 'green', label: 'Green', color: '#388e3c' },
        { value: 'light', label: 'Light', color: '#ffffff' }
    ];

    const handleSaveSettings = async () => {
        try {
            setSaveStatus('saving');
            await dispatch(updateSystemSettings(settings));
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const getSystemHealth = () => {
        if (!systemMonitoring) return { status: 'unknown', color: 'grey', score: 0 };

        const { cpuUsage, memoryUsage, diskUsage, networkLatency } = systemMonitoring;
        const avgUsage = (cpuUsage + memoryUsage + diskUsage) / 3;

        if (avgUsage < 30) return { status: 'Excellent', color: 'success', score: 95 };
        if (avgUsage < 50) return { status: 'Very Good', color: 'info', score: 85 };
        if (avgUsage < 70) return { status: 'Good', color: 'warning', score: 70 };
        return { status: 'Needs Attention', color: 'error', score: 45 };
    };

    const formatUptime = () => {
        if (!systemMonitoring?.uptime) return 'N/A';
        const hours = Math.floor(systemMonitoring.uptime / 3600);
        const minutes = Math.floor((systemMonitoring.uptime % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const systemHealth = getSystemHealth();
    return (
        <Box sx={{ maxHeight: '600px', overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
            {/* Enhanced Header with Real-time Dashboard */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                    <Dashboard />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Admin Control Center</Typography>
                                    <Typography variant="caption">
                                        {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box textAlign="center">
                                <Typography variant="h4" fontWeight="bold">{systemHealth.score}%</Typography>
                                <Typography variant="body2">System Health Score</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={systemHealth.score}
                                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Chip
                                    label={`Status: ${systemHealth.status}`}
                                    color={systemHealth.color}
                                    size="small"
                                    sx={{ color: 'white', fontWeight: 'bold' }}
                                />
                                <Chip
                                    label={`Uptime: ${formatUptime()}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{ color: 'white', borderColor: 'white' }}
                                />
                                <Tooltip title="Auto-refresh every 5 seconds">
                                    <IconButton
                                        size="small"
                                        onClick={() => dispatch(refreshData())}
                                        sx={{ color: 'white', alignSelf: 'flex-start' }}
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Real-time System Metrics */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                        <Timeline color="primary" />
                        Live System Metrics
                        <Badge badgeContent="LIVE" color="error" sx={{ ml: 1 }} />
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#e3f2fd" borderRadius={2}>
                                <Memory color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{systemMonitoring?.cpuUsage || 0}%</Typography>
                                <Typography variant="caption">CPU Usage</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={systemMonitoring?.cpuUsage || 0}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#f3e5f5" borderRadius={2}>
                                <Storage color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{systemMonitoring?.memoryUsage || 0}%</Typography>
                                <Typography variant="caption">Memory</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={systemMonitoring?.memoryUsage || 0}
                                    color="secondary"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#fff3e0" borderRadius={2}>
                                <Storage sx={{ color: '#ff9800', fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{systemMonitoring?.diskUsage || 0}%</Typography>
                                <Typography variant="caption">Disk Space</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={systemMonitoring?.diskUsage || 0}
                                    sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' } }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box textAlign="center" p={2} bgcolor="#e8f5e8" borderRadius={2}>
                                <NetworkCheck sx={{ color: '#4caf50', fontSize: 40, mb: 1 }} />
                                <Typography variant="h6">{systemMonitoring?.networkLatency || 0}ms</Typography>
                                <Typography variant="caption">Network Latency</Typography>
                                <Box display="flex" justifyContent="center" mt={1}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={Math.max(0, 100 - (systemMonitoring?.networkLatency || 0))}
                                        size={30}
                                        sx={{ color: '#4caf50' }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {saveStatus && (
                <Alert
                    severity={saveStatus === 'success' ? 'success' : saveStatus === 'error' ? 'error' : 'info'}
                    sx={{ mb: 2 }}
                >
                    {saveStatus === 'saving' && 'Saving settings...'}
                    {saveStatus === 'success' && 'Settings saved successfully!'}
                    {saveStatus === 'error' && 'Error saving settings. Please try again.'}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* System Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Settings color="primary" />
                                <Typography variant="h6">System Settings</Typography>
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.systemMaintenance}
                                        onChange={(e) => handleSettingChange('system', 'systemMaintenance', e.target.checked)}
                                    />
                                }
                                label="Maintenance Mode"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.autoBackup}
                                        onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                                    />
                                }
                                label="Auto Backup"
                            />

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

                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>Session Timeout (minutes)</Typography>
                                <Slider
                                    value={settings.sessionTimeout}
                                    onChange={(e, value) => handleSettingChange('system', 'sessionTimeout', value)}
                                    min={5}
                                    max={120}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Security Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Security color="error" />
                                <Typography variant="h6">Security Settings</Typography>
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.twoFactorAuth}
                                        onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                                    />
                                }
                                label="Two-Factor Authentication"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.securityLogging}
                                        onChange={(e) => handleSettingChange('security', 'securityLogging', e.target.checked)}
                                    />
                                }
                                label="Security Logging"
                            />

                            <TextField
                                fullWidth
                                label="Max Login Attempts"
                                type="number"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                sx={{ mt: 2 }}
                            />

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

                {/* Notification Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Notifications color="info" />
                                <Typography variant="h6">Notification Settings</Typography>
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                    />
                                }
                                label="Email Notifications"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.smsNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                                    />
                                }
                                label="SMS Notifications"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.securityAlerts}
                                        onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                                    />
                                }
                                label="Security Alerts"
                            />

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

                {/* Performance Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Speed color="success" />
                                <Typography variant="h6">Performance Settings</Typography>
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.cacheEnabled}
                                        onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                                    />
                                }
                                label="Enable Caching"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.compressionEnabled}
                                        onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
                                    />
                                }
                                label="Enable Compression"
                            />

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

                {/* Real-time System Metrics */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Real-time System Metrics</Typography>
                            {systemMonitoring ? (
                                <Grid container spacing={2}>
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
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">Network Latency</Typography>
                                            <Typography variant="h6" color="primary" >
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
            {/* Admin Preferences Section */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <AdminPanelSettings color="primary" />
                        <Typography variant="h6">Admin Preferences</Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Theme & Display Preferences */}
                        <Grid item xs={12} md={6}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Palette color="primary" />
                                        <Typography variant="subtitle1">Theme & Display</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Choose your preferred admin theme
                                            </Typography>
                                            <Box display="flex" flexWrap="wrap" gap={1}>
                                                {themeOptions.map((theme) => (
                                                    <Button
                                                        key={theme.value}
                                                        variant={colorScheme === theme.value ? 'contained' : 'outlined'}
                                                        onClick={() => handleThemeChange(theme.value)}
                                                        size="small"
                                                        sx={{
                                                            minWidth: '80px',
                                                            position: 'relative',
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                left: 6,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.color,
                                                                border: theme.value === 'light' ? '1px solid #ccc' : 'none'
                                                            },
                                                            pl: 2.5
                                                        }}
                                                    >
                                                        {theme.label.split(' ')[0]}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Box>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Dashboard Layout</InputLabel>
                                            <Select
                                                value={adminPreferences.dashboardLayout}
                                                label="Dashboard Layout"
                                                onChange={(e) => handlePreferenceChange('dashboardLayout', e.target.value)}
                                            >
                                                <MenuItem value="grid">Grid View</MenuItem>
                                                <MenuItem value="list">List View</MenuItem>
                                                <MenuItem value="compact">Compact View</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Chart Type</InputLabel>
                                            <Select
                                                value={adminPreferences.chartType}
                                                label="Chart Type"
                                                onChange={(e) => handlePreferenceChange('chartType', e.target.value)}
                                            >
                                                <MenuItem value="line">Line Charts</MenuItem>
                                                <MenuItem value="bar">Bar Charts</MenuItem>
                                                <MenuItem value="area">Area Charts</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.compactView}
                                                    onChange={(e) => handlePreferenceChange('compactView', e.target.checked)}
                                                />
                                            }
                                            label="Compact View Mode"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.showRealTimeMetrics}
                                                    onChange={(e) => handlePreferenceChange('showRealTimeMetrics', e.target.checked)}
                                                />
                                            }
                                            label="Show Real-time Metrics"
                                        />
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* Notification & Alert Preferences */}
                        <Grid item xs={12} md={6}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Notifications color="primary" />
                                        <Typography variant="subtitle1">Notifications & Alerts</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.desktopNotifications}
                                                    onChange={(e) => handlePreferenceChange('desktopNotifications', e.target.checked)}
                                                />
                                            }
                                            label="Desktop Notifications"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.soundAlerts}
                                                    onChange={(e) => handlePreferenceChange('soundAlerts', e.target.checked)}
                                                />
                                            }
                                            label="Sound Alerts"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.criticalAlertsOnly}
                                                    onChange={(e) => handlePreferenceChange('criticalAlertsOnly', e.target.checked)}
                                                />
                                            }
                                            label="Critical Alerts Only"
                                        />

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Email Digest</InputLabel>
                                            <Select
                                                value={adminPreferences.emailDigest}
                                                label="Email Digest"
                                                onChange={(e) => handlePreferenceChange('emailDigest', e.target.value)}
                                            >
                                                <MenuItem value="none">No Digest</MenuItem>
                                                <MenuItem value="daily">Daily Digest</MenuItem>
                                                <MenuItem value="weekly">Weekly Digest</MenuItem>
                                                <MenuItem value="monthly">Monthly Digest</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Box>
                                            <Typography gutterBottom>Auto-refresh Interval (seconds)</Typography>
                                            <Slider
                                                value={adminPreferences.refreshInterval}
                                                onChange={(e, value) => handlePreferenceChange('refreshInterval', value)}
                                                min={1}
                                                max={60}
                                                step={1}
                                                valueLabelDisplay="auto"
                                                marks={[
                                                    { value: 5, label: '5s' },
                                                    { value: 15, label: '15s' },
                                                    { value: 30, label: '30s' },
                                                    { value: 60, label: '60s' }
                                                ]}
                                            />
                                        </Box>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* Accessibility & Advanced Preferences */}
                        <Grid item xs={12} md={6}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person color="primary" />
                                        <Typography variant="subtitle1">Accessibility & Advanced</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Font Size</InputLabel>
                                            <Select
                                                value={adminPreferences.fontSize}
                                                label="Font Size"
                                                onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                                            >
                                                <MenuItem value="small">Small</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="large">Large</MenuItem>
                                                <MenuItem value="xlarge">Extra Large</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.highContrast}
                                                    onChange={(e) => handlePreferenceChange('highContrast', e.target.checked)}
                                                />
                                            }
                                            label="High Contrast Mode"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.reducedMotion}
                                                    onChange={(e) => handlePreferenceChange('reducedMotion', e.target.checked)}
                                                />
                                            }
                                            label="Reduced Motion"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.advancedMode}
                                                    onChange={(e) => handlePreferenceChange('advancedMode', e.target.checked)}
                                                />
                                            }
                                            label="Advanced Mode"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.showSystemLogs}
                                                    onChange={(e) => handlePreferenceChange('showSystemLogs', e.target.checked)}
                                                />
                                            }
                                            label="Show System Logs"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={adminPreferences.autoSaveSettings}
                                                    onChange={(e) => handlePreferenceChange('autoSaveSettings', e.target.checked)}
                                                />
                                            }
                                            label="Auto-save Settings"
                                        />
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* Language & Regional Preferences */}
                        <Grid item xs={12} md={6}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Language color="primary" />
                                        <Typography variant="subtitle1">Language & Regional</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Language</InputLabel>
                                            <Select
                                                value={adminPreferences.language}
                                                label="Language"
                                                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                            >
                                                <MenuItem value="en">🇺🇸 English</MenuItem>
                                                <MenuItem value="hi">🇮🇳 Hindi (हिंदी)</MenuItem>
                                                <MenuItem value="es">🇪🇸 Spanish (Español)</MenuItem>
                                                <MenuItem value="fr">🇫🇷 French (Français)</MenuItem>
                                                <MenuItem value="de">🇩🇪 German (Deutsch)</MenuItem>
                                                <MenuItem value="ja">🇯🇵 Japanese (日本語)</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Timezone</InputLabel>
                                            <Select
                                                value={adminPreferences.timezone}
                                                label="Timezone"
                                                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                            >
                                                <MenuItem value="UTC">UTC</MenuItem>
                                                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                                                <MenuItem value="America/Chicago">Central Time</MenuItem>
                                                <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                                                <MenuItem value="Europe/London">London</MenuItem>
                                                <MenuItem value="Asia/Kolkata">India Standard Time</MenuItem>
                                                <MenuItem value="Asia/Tokyo">Japan Standard Time</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Date Format</InputLabel>
                                            <Select
                                                value={adminPreferences.dateFormat}
                                                label="Date Format"
                                                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                                            >
                                                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                                                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                                                <MenuItem value="DD-MMM-YYYY">DD-MMM-YYYY</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Time Format</InputLabel>
                                            <Select
                                                value={adminPreferences.timeFormat}
                                                label="Time Format"
                                                onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                                            >
                                                <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                                                <MenuItem value="24h">24-hour</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>

                    {/* Current Preferences Summary */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>Current Preferences Summary:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            <Chip
                                label={`Theme: ${themeOptions.find(t => t.value === colorScheme)?.label || 'Default'}`}
                                size="small"
                                color="primary"
                            />
                            <Chip
                                label={`Layout: ${adminPreferences.dashboardLayout}`}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Language: ${adminPreferences.language.toUpperCase()}`}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Notifications: ${adminPreferences.desktopNotifications ? 'On' : 'Off'}`}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Auto-refresh: ${adminPreferences.refreshInterval}s`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    disabled={loading || saveStatus === 'saving'}
                    size="large"
                >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save All Settings'}
                </Button>
            </Box>
        </Box>
    );
};

export default AdminSettings;
