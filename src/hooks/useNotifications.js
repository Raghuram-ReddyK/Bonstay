import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const useNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const location = useLocation();

    // Function to show page-specific notifications
    const showPageNotification = useCallback(() => {
        let newMessage = "";
        switch (location.pathname) {
            case "/hotels":
            case `/hotels/${userId}`:
                newMessage = "Hotels retrieved successfully!";
                break;
            case "/bookings":
            case `/bookings/${userId}`:
                newMessage = "Bookings retrieved successfully!";
                break;
            case "/bookroom":
            case `/bookroom/${userId}`:
                newMessage = "Booking information loaded!";
                break;
            case "/dashboard":
            case `/dashboard/${userId}`:
                newMessage = "Dashboard information loaded!";
                break;
            case "/admin-dashboard":
            case `/admin-dashboard/${userId}`:
                newMessage = "Admin Dashboard loaded!";
                break;
            case "/view":
            case `/view/${userId}`:
                newMessage = "View information loaded!";
                break;
            default:
                break;
        }
        if (newMessage) {
            addNotification(newMessage);
        }
    }, [location.pathname, userId]);

    // Add a new notification to the list
    const addNotification = (message) => {
        const newNotification = {
            id: Date.now(),
            message,
            read: false,
        };
        setNotifications((prev) => [...prev, newNotification]);
        setUnreadNotifications((prev) => prev + 1);
    };

    // Mark a notification as read
    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
        );
        setUnreadNotifications((prev) => prev - 1);
    };

    // Remove a notification from the list
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        setUnreadNotifications((prev) => prev - 1);
    };

    // Remove all notifications
    const removeAllNotifications = () => {
        setNotifications([]);
        setUnreadNotifications(0);
    };

    // Toggle the notification dialog open/close
    const toggleDialog = () => {
        setDialogOpen(!dialogOpen);
    };

    // Trigger notification when route changes
    useEffect(() => {
        showPageNotification();
    }, [showPageNotification]);

    return {
        notifications,
        unreadNotifications,
        dialogOpen,
        addNotification,
        markAsRead,
        removeNotification,
        removeAllNotifications,
        toggleDialog,
    };
};

export default useNotifications;
