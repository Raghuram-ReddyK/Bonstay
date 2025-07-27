import React from 'react';
import { Box, Breadcrumbs, Typography, Chip, useTheme } from '@mui/material';
import { NavigateNext, Home, Hotel, BookOnline, AccountCircle, Dashboard, AdminPanelSettings } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const CustomBreadcrumbs = ({ currentPage, customBreadcrumbs = null }) => {
    const location = useLocation();
    const theme = useTheme();
    
    // Get user type from session storage
    const userType = sessionStorage.getItem('userType');
    const userId = sessionStorage.getItem('id');
    
    // Default breadcrumb mapping
    const breadcrumbMap = {
        '/': { label: 'Home', icon: <Home />, color: '#2196f3' },
        [`/dashboard/${userId}`]: { label: 'Dashboard', icon: <Dashboard />, color: '#4caf50' },
        [`/admin-dashboard/${userId}`]: { label: 'Admin Dashboard', icon: <AdminPanelSettings />, color: '#ff9800' },
        '/hotels': { label: 'Hotels', icon: <Hotel />, color: '#e91e63' },
        '/bookings': { label: 'My Bookings', icon: <BookOnline />, color: '#9c27b0' },
        '/view': { label: 'Profile', icon: <AccountCircle />, color: '#00bcd4' }
    };
    
    // Use custom breadcrumbs if provided, otherwise generate from current route
    const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(location.pathname, breadcrumbMap, userType, userId);
    
    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
        >
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" sx={{ color: '#666' }} />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-ol': {
                        alignItems: 'center'
                    }
                }}
            >
                {breadcrumbs.map((breadcrumb, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {breadcrumb.icon && (
                            <Box sx={{ 
                                color: breadcrumb.color || theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {breadcrumb.icon}
                            </Box>
                        )}
                        {breadcrumb.link && index < breadcrumbs.length - 1 ? (
                            <Typography
                                component={Link}
                                to={breadcrumb.link}
                                sx={{
                                    color: breadcrumb.color || theme.palette.primary.main,
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: theme.palette.primary.dark
                                    }
                                }}
                            >
                                {breadcrumb.label}
                            </Typography>
                        ) : (
                            <Chip
                                label={breadcrumb.label}
                                size="small"
                                sx={{
                                    backgroundColor: breadcrumb.color || theme.palette.primary.main,
                                    color: 'white',
                                    fontWeight: 600,
                                    '& .MuiChip-label': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Breadcrumbs>
            
            {/* Current Page Title */}
            {currentPage && (
                <Box sx={{ mt: 1 }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#333',
                            fontWeight: 600,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}
                    >
                        {currentPage}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

// Helper function to generate breadcrumbs from pathname
const generateBreadcrumbs = (pathname, breadcrumbMap, userType, userId) => {
    const breadcrumbs = [];
    
    // Always start with home if not on home page
    if (pathname !== '/') {
        breadcrumbs.push({
            label: 'Home',
            icon: <Home />,
            link: '/',
            color: '#2196f3'
        });
    }
    
    // Add dashboard link if not on dashboard
    const dashboardPath = userType === 'admin' ? `/admin-dashboard/${userId}` : `/dashboard/${userId}`;
    if (pathname !== dashboardPath && pathname !== '/') {
        breadcrumbs.push({
            label: userType === 'admin' ? 'Admin Dashboard' : 'Dashboard',
            icon: userType === 'admin' ? <AdminPanelSettings /> : <Dashboard />,
            link: dashboardPath,
            color: userType === 'admin' ? '#ff9800' : '#4caf50'
        });
    }
    
    // Add current page
    const currentPageInfo = getCurrentPageInfo(pathname, userType);
    if (currentPageInfo) {
        breadcrumbs.push(currentPageInfo);
    }
    
    return breadcrumbs;
};

// Helper function to get current page info
const getCurrentPageInfo = (pathname, userType) => {
    if (pathname.includes('/dashboard') || pathname.includes('/admin-dashboard')) {
        return {
            label: userType === 'admin' ? 'Admin Dashboard' : 'Dashboard',
            icon: userType === 'admin' ? <AdminPanelSettings /> : <Dashboard />,
            color: userType === 'admin' ? '#ff9800' : '#4caf50'
        };
    }
    
    if (pathname.includes('/hotels')) {
        return {
            label: 'Hotels',
            icon: <Hotel />,
            color: '#e91e63'
        };
    }
    
    if (pathname.includes('/bookings')) {
        return {
            label: 'My Bookings',
            icon: <BookOnline />,
            color: '#9c27b0'
        };
    }
    
    if (pathname.includes('/view')) {
        return {
            label: 'Profile',
            icon: <AccountCircle />,
            color: '#00bcd4'
        };
    }
    
    if (pathname.includes('/bookroom')) {
        return {
            label: 'Book a Room',
            icon: <BookOnline />,
            color: '#ff5722'
        };
    }
    
    return {
        label: 'Page',
        icon: <Home />,
        color: '#757575'
    };
};

export default CustomBreadcrumbs;
