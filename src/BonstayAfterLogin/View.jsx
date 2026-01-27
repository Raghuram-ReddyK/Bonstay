import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Typography,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Container,
    Grid,
    Avatar,
    Box,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tab,
    Tabs
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    LocationOn,
    Delete,
    Security,
    Hotel,
    RateReview,
    AccountCircle,
    Settings,
    ExitToApp,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { getApiUrl, getBackendApiUrl } from '../config/apiConfig';

const View = ({ handleLogout, userId: loggedInUserId }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, [loggedInUserId]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch user details
            const userResponse = await axios.get(getBackendApiUrl(`/users/${loggedInUserId}`));
            console.log('userResponse: ', userResponse);
            const userData = userResponse.data.data || userResponse.data;
            setUserDetails(userData);

            // Fetch user bookings
            const bookingsResponse = await axios.get(getApiUrl('/bookings'));
            const bookingsData = bookingsResponse.data.data || bookingsResponse.data;
            const userBookings = bookingsData.filter(booking => booking.userId === loggedInUserId);

            // Fetch user reviews from all hotels
            const hotelsResponse = await axios.get(getApiUrl('/hotels'));
            const hotelsData = hotelsResponse.data.data || hotelsResponse.data;
            const hotelsMap = {};
            hotelsData.forEach(hotel => {
                hotelsMap[hotel.id] = hotel.hotelName;
            });

            // Enhance bookings with hotel names
            const enhancedBookings = userBookings.map(booking => ({
                ...booking,
                hotelName: hotelsMap[booking.hotelId] || booking.hotelName || 'Unknown Hotel'
            }));

            setBookings(enhancedBookings);

            const userReviews = [];
            hotelsData.forEach(hotel => {
                if (hotel.reviews) {
                    const hotelUserReviews = hotel.reviews
                        .filter(review => review.userId === loggedInUserId)
                        .map(review => ({ ...review, hotelName: hotel.hotelName, hotelId: hotel.id }));
                    userReviews.push(...hotelUserReviews);
                }
            });
            setReviews(userReviews);

        } catch (err) {
            console.error('Error loading user data:', err);
            setError('Failed to load user data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setDeleting(true);
            await axios.delete(getBackendApiUrl(`/users/${loggedInUserId}`));

            // Also delete user's bookings
            bookings.forEach(async (booking) => {
                await axios.delete(getApiUrl(`/bookings/${booking.id}`));
            });

            alert('Account deleted successfully. You will be logged out.');
            handleLogout();
        } catch (err) {
            console.error('Error deleting account:', err);
            setError('Failed to delete account. Please try again.');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'completed': return 'info';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <CircularProgress sx={{ color: 'white', mb: 2 }} size={60} />
                    <Typography variant="h5">Loading your profile...</Typography>
                </Box>
            </Box>
        );
    }

    if (error || !userDetails) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                        {error || 'User not found.'}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                py: 4
            }}
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Profile Header */}
                <Paper elevation={12} sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4
                }}>

                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    fontSize: '3rem'
                                }}
                            >
                                {userDetails.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h4" color="white" gutterBottom>
                                {userDetails.name}
                            </Typography>
                            <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                                Member since {formatDate(userDetails.createdAt || '2024-01-01')} - Last login: {formatDate(userDetails.lastLogin || new Date().toISOString())}
                            </Typography>
                            <Box display="flex" gap={1} mt={2}>
                                <Chip
                                    label={`${bookings.length} Bookings`}
                                    size="small"
                                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                                />
                                <Chip
                                    label={`${reviews.length} Reviews`}
                                    size="small"
                                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box display="flex" gap={1}>
                                <IconButton
                                    color="inherit"
                                    sx={{ color: 'white' }}
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    sx={{ color: 'white' }}
                                    onClick={handleLogout}
                                >
                                    <ExitToApp />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabs Navigation */}
                <Paper elevation={6} sx={{
                    mb: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2
                }}>

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        <Tab icon={<AccountCircle />} label="Personal Info" />
                        <Tab icon={<Hotel />} label={`Bookings (${bookings.length})`} />
                        <Tab icon={<RateReview />} label={`Reviews (${reviews.length})`} />
                        <Tab icon={<Settings />} label="Account Settings" />
                    </Tabs>
                </Paper>

                {/* Tab Content */}
                {activeTab === 0 && (
                    <Card elevation={6} sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>

                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom color="primary">
                                Personal Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon><Person color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="Full Name"
                                                secondary={userDetails.name}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Email color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="Email Address"
                                                secondary={userDetails.email}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><Phone color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="Phone Number"
                                                secondary={userDetails.phoneNo || 'Not provided'}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon><LocationOn color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="Country"
                                                secondary={userDetails.country || 'Not provided'}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><LocationOn color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="Address"
                                                secondary={userDetails.address || 'Not provided'}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><AccountCircle color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="User ID"
                                                secondary={userDetails.userId}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 1 && (
                    <Card elevation={6} sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom color="primary">
                                My Bookings
                            </Typography>
                            {bookings.length === 0 ? (
                                <Alert severity="info">No bookings found. Start exploring hotels to make your first booking!</Alert>
                            ) : (
                                <Grid container spacing={3}>
                                    {bookings.map((booking, index) => (
                                        <Grid item xs={12} key={booking.id || index}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} md={8}>
                                                            <Typography variant="h6" gutterBottom>
                                                                {booking.hotelName || 'Hotel Name Not Available'}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Booking ID: {booking.id}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Check-in: {formatDate(booking.checkIn || booking.startDate || booking.checkInDate)} |
                                                                Check-out: {formatDate(booking.checkOut || booking.endDate || booking.checkOutDate)}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Room Type: {booking.roomTypeName || booking.roomType || booking.typeOfRoom || 'N/A'} |
                                                                Guests: {booking.guests || booking.noOfPersons || 'N/A'}
                                                            </Typography>
                                                            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                                                Total: ₹{(booking.totalAmount || booking.totalPrice || 0).toLocaleString()}
                                                            </Typography>
                                                            {booking.nights && (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Duration: {booking.nights} night{booking.nights > 1 ? 's' : ''}
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                                                            <Chip
                                                                label={
                                                                    booking.bookingStatus === 'cancelled' ||
                                                                        booking.status === 'cancelled' ||
                                                                        booking.cancelledAt ||
                                                                        booking.cancelledBy
                                                                        ? 'Cancelled'
                                                                        : booking.bookingStatus || booking.status || 'Confirmed'
                                                                }
                                                                color={
                                                                    booking.bookingStatus === 'cancelled' ||
                                                                        booking.status === 'cancelled' ||
                                                                        booking.cancelledAt ||
                                                                        booking.cancelledBy
                                                                        ? 'error'
                                                                        : getStatusColor(booking.bookingStatus || booking.status)
                                                                }
                                                                sx={{ mb: 1 }}
                                                            />
                                                            <Typography variant="body2" color="text.secondary">
                                                                Booked on {formatDate(booking.bookingDate || booking.createdAt)}
                                                            </Typography>
                                                            {(booking.cancelledAt || booking.cancelledBy) && (
                                                                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                                                                    Cancelled {booking.cancelledBy === 'admin' ? 'by Admin' : 'by User'}
                                                                    {booking.cancelledAt && (
                                                                        <>
                                                                            <br />
                                                                            on {formatDate(booking.cancelledAt)}
                                                                        </>
                                                                    )}
                                                                </Typography>
                                                            )}
                                                            {booking.cancellationReason && (
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                                    Reason: {booking.cancellationReason}
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>

                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                )}

                {activeTab === 2 && (
                    <Card elevation={6} sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom color="primary">
                                My Reviews
                            </Typography>
                            {reviews.length === 0 ? (
                                <Alert severity="info">No reviews yet. Share your experience after your stays!</Alert>
                            ) : (
                                <Grid container spacing={3}>
                                    {reviews.map((review, index) => (
                                        <Grid item xs={12} key={review.id || index}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                                <Typography variant="h6">
                                                                    {review.hotelName}
                                                                </Typography>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Typography variant="body2">{review.rating}</Typography>
                                                                    <Box display="flex">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Typography
                                                                                key={i}
                                                                                color={i < review.rating ? 'warning.main' : 'grey.300'}
                                                                            >
                                                                                ★
                                                                            </Typography>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                            <Typography variant="body1" paragraph>
                                                                {review.comment}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Reviewed on {formatDate(review.date)} • {review.helpful || 0} found helpful
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                )}

                {activeTab === 3 && (
                    <Card elevation={6} sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom color="primary">
                                Account Settings
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Account Information
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon><Security color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary="Password"
                                                secondary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="body2">
                                                            {showPassword ? userDetails.password : '••••••••'}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom color="error">
                                        Danger Zone
                                    </Typography>
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        Deleting your account is permanent and cannot be undone.
                                    </Alert>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => setDeleteDialogOpen(true)}
                                        fullWidth
                                    >
                                        Delete Account
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogContent>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            This action cannot be undone!
                        </Alert>
                        <Typography>
                            Are you sure you want to delete your account? This will permanently remove:
                        </Typography>
                        <ul>
                            <li>Your profile information</li>
                            <li>All your bookings ({bookings.length})</li>
                            <li>All your reviews ({reviews.length})</li>
                            <li>Account preferences and settings</li>
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteAccount}
                            color="error"
                            variant="contained"
                            disabled={deleting}
                            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
                        >
                            {deleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default View;
