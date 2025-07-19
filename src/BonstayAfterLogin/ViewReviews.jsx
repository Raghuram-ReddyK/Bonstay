import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelReviews, markReviewHelpful } from '../Slices/reviewSlice';
import {
    Container,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Box,
    Rating,
    Chip,
    Avatar,
    Grid,
    Divider,
    Paper,
    Stack
} from '@mui/material';
import {
    useNavigate
} from 'react-router-dom';
import {
    Person,
    ThumbUp,
    Verified,
    LocationOn,
    Phone,
    Star,
    RateReview
} from '@mui/icons-material';

const ViewReviews = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const {
        hotel,
        reviews,
        loading,
        error
    } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (hotelId) {
            dispatch(fetchHotelReviews(hotelId));
        }
    }, [hotelId, dispatch]);

    // Handle marking review as helpful
    const handleMarkHelpful = (reviewId) => {
        dispatch(markReviewHelpful({ hotelId, reviewId }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRatingText = (rating) => {
        if (rating === 5) return 'Excellent';
        if (rating === 4) return 'Very Good';
        if (rating === 3) return 'Good';
        if (rating === 2) return 'Fair';
        return 'Poor';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'success';
        if (rating >= 3.5) return 'primary';
        if (rating >= 2.5) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!hotel) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">Hotel not found.</Alert>
            </Container>
        );
    }

    const avgRating = hotel.rating || 0;
    const totalReviews = hotel.totalReviews || reviews.length;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Hotel Header */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" gutterBottom color="primary">
                                {hotel.hotelName}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                <LocationOn color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                    {hotel.city}, {hotel.state}
                                </Typography>
                                <Chip label={hotel.category} size="small" color="primary" variant="outlined" />
                            </Box>

                            {/* Overall Rating Summary */}
                            <Paper elevation={2} sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            {avgRating.toFixed(1)}
                                        </Typography>
                                        <Rating value={avgRating} precision={0.1} readOnly sx={{ color: 'white' }} />
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {getRatingText(avgRating)} • {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                    <RateReview sx={{ fontSize: 40, opacity: 0.8 }} />
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">{hotel.phoneNo}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Star />}
                                onClick={() => navigate(`/review/${hotelId}`)}
                                size="large"
                            >
                                Write a Review
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Reviews Section */}
            <Typography variant="h5" gutterBottom>
                Guest Reviews ({totalReviews})
            </Typography>

            {reviews.length > 0 ? (
                <Stack spacing={3}>
                    {reviews.map((review, index) => (
                        <Card key={review.id || index} elevation={2}>
                            <CardContent>
                                {/* Review Header */}
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <Person />
                                        </Avatar>
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {review.userName || 'Anonymous'}
                                                </Typography>
                                                {review.verified && (
                                                    <Chip
                                                        icon={<Verified />}
                                                        label="Verified Stay"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {review.date ? formatDate(review.date) : 'No date provided'}
                                            </Typography>
                                            {review.roomType && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Stayed in: {review.roomType}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Rating */}
                                    <Box textAlign="right">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Rating value={review.rating || 0} readOnly size="small" />
                                            <Chip
                                                label={getRatingText(review.rating || 0)}
                                                size="small"
                                                color={getRatingColor(review.rating || 0)}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Review Content */}
                                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                    {review.comment || review}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {/* Review Footer */}
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Button
                                        variant="text"
                                        startIcon={<ThumbUp />}
                                        size="small"
                                        onClick={() => handleMarkHelpful(review.id)}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Helpful ({review.helpful || 0})
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        Review #{index + 1}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Card sx={{ textAlign: 'center', py: 6 }}>
                    <CardContent>
                        <RateReview sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Reviews Yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Be the first to share your experience at this hotel!
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Star />}
                            onClick={() => navigate(`/review/${hotelId}`)}
                        >
                            Write the First Review
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Back Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/hotels')}
                    size="large"
                >
                    Back to Hotels
                </Button>
            </Box>
        </Container>
    );
};

export default ViewReviews;
