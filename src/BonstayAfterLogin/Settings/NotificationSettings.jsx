import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Switch,
    FormControlLabel
} from '@mui/material';

const NotificationSettings = ({ notifications, setNotifications }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Notification Preferences
            </Typography>
            <Stack spacing={2}>
                <Card variant="outlined">
                    <CardContent>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.email}
                                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                />
                            }
                            label="Email Notifications"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Receive booking confirmations and updates via email
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.sms}
                                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                                />
                            }
                            label="SMS Notifications"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Get important updates via SMS
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifications.push}
                                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                />
                            }
                            label="Push Notifications"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Receive real-time notifications in your browser
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default NotificationSettings;
