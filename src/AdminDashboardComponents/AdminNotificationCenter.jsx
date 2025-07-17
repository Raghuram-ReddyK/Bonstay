import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Card, CardContent, Typography, List, ListItem, ListItemText,
    ListItemIcon, IconButton, Tooltip, Chip, Badge, Divider
} from '@mui/material';
import {
    Refresh, Notifications, Security, Info, Warning, Error,
    CheckCircle, MarkAsUnread
} from '@mui/icons-material';

// Importing Redux actions from the adminSlice
import { fetchAdminData, refreshData, markNotificationAsRead, markAllNotificationsAsRead } from '../Slices/adminSlice';

/**
 * AdminNotificationCenter Component
 * This component displays a list of system notifications for the admin.
 * It allows admins to view notifications, mark them as read, and refresh the list.
 * Data is fetched from the Redux store and updated periodically.
 */
const AdminNotificationCenter = () => {
    // useDispatch hook to get the dispatch function for dispatching Redux actions
    const dispatch = useDispatch();

    // useSelector hook to extract specific data from the Redux store's 'admin' slice
    // We need the 'notifications' array, 'loading' state (though not directly used in render logic here),
    // and the 'lastUpdated' timestamp.
    const { notifications, loading, lastUpdated } = useSelector(state => state.admin);

    // useEffect hook for initial data fetching and setting up periodic refresh
    useEffect(() => {
        // Fetch admin data (which includes notifications) only if the notifications array is empty or not yet loaded
        // This ensures data is fetched on initial component mount if not already present.
        if (!notifications || notifications.length === 0) {
            dispatch(fetchAdminData());
        }
        // Set up an interval to refresh all admin data (including notifications) every 30 seconds
        const interval = setInterval(() => dispatch(refreshData()), 30000);
        // Cleanup function: Clear the interval when the component unmounts or dependencies change
        return () => clearInterval(interval);
    }, [dispatch, notifications]); // Dependencies: dispatch (stable) and notifications (to re-run if it becomes populated)

    /**
     * Helper function to determine the appropriate Material-UI icon component based on the notification type.
     * @param {string} type - The type of the notification (e.g., 'security', 'warning', 'error', 'success', 'info').
     * @returns {React.ElementType} The Material-UI icon component.
     */
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'security':
                return Security; // Icon for security-related notifications
            case 'warning':
                return Warning; // Icon for warning notifications
            case 'error':
                return Error; // Icon for error notifications
            case 'success':
                return CheckCircle; // Icon for success notifications
            default:
                return Info; // Default icon for informational notifications
        }
    };

    /**
     * Helper function to get the appropriate Material-UI color for a chip/icon based on the notification type.
     * @param {string} type - The type of the notification.
     * @returns {string} The Material-UI color string ('error', 'warning', 'success', 'info').
     */
    const getNotificationColor = (type) => {
        switch (type) {
            case 'security':
                return 'error'; // Red for security alerts
            case 'warning':
                return 'warning'; // Orange for warnings
            case 'error':
                return 'error'; // Red for errors
            case 'success':
                return 'success'; // Green for success
            default:
                return 'info'; // Blue for informational messages
        }
    };

    // Calculate the number of unread notifications
    const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

    // Main component render
    return (
        <Box>
            {/* Header section with title, unread count badge, and action buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5" fontWeight="bold">Notification Center</Typography>
                    {/* Badge displaying the count of unread notifications */}
                    <Badge badgeContent={unreadCount} color="error">
                        <Notifications />
                    </Badge>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    {/* Display last updated timestamp */}
                    <Typography variant="body2" color="textSecondary">
                        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
                    </Typography>
                    {/* Button to mark all notifications as read */}
                    <Tooltip title="Mark All as Read">
                        <IconButton onClick={() => dispatch(markAllNotificationsAsRead())}>
                            <MarkAsUnread />
                        </IconButton>
                    </Tooltip>
                    {/* Button to refresh notifications data */}
                    <Tooltip title="Refresh Notifications">
                        <IconButton onClick={() => dispatch(refreshData())}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Notification List Card */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Notifications ({notifications ? notifications.length : 0})
                    </Typography>

                    {/* Conditional rendering: Show message if no notifications, otherwise show the list */}
                    {!notifications || notifications.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Typography color="textSecondary">
                                No notifications available
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {/* Map through the first 20 notifications to render them */}
                            {notifications.slice(0, 20).map((notification, index) => {
                                // Dynamically get the icon component based on notification type
                                const NotificationIcon = getNotificationIcon(notification.type);
                                return (
                                    <React.Fragment key={notification.id || index}> {/* Use unique ID or index as key */}
                                        <ListItem
                                            button // Makes the list item clickable
                                            onClick={() => dispatch(markNotificationAsRead(notification.id))} // Mark as read on click
                                            sx={{
                                                // Style based on whether the notification is read or not
                                                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                                                borderRadius: 1,
                                                mb: 1
                                            }}
                                        >
                                            <ListItemIcon>
                                                {/* Display the notification icon with dynamic color */}
                                                <NotificationIcon color={getNotificationColor(notification.type)} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={notification.read ? 'normal' : 'bold'} // Bold text if unread
                                                        >
                                                            {notification.title || 'Notification'} {/* Notification title */}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Chip
                                                                label={notification.type}
                                                                size="small"
                                                                color={getNotificationColor(notification.type)} // Chip color based on type
                                                                variant="outlined"
                                                            />
                                                            {!notification.read && ( // Display 'New' chip if unread
                                                                <Chip label="New" size="small" color="primary" />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {notification.message} {/* Notification message */}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {new Date(notification.timestamp).toLocaleString()} {/* Formatted timestamp */}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {/* Add a divider between list items, but not after the last one */}
                                        {index < notifications.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminNotificationCenter;
