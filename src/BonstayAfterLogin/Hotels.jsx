import { useNavigate } from 'react-router-dom';
import {
    Container,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardActions,
    Grid,
    Box,
    Chip,
    Rating,
    Divider
} from '@mui/material';
import {
    LocationOn,
    Phone,
    Star,
    Hotel as HotelIcon,
    Wifi,
    Pool,
    Restaurant
} from '@mui/icons-material';
import { useHotels } from '../hooks/useSWRData';

const Hotels = () => {
    const navigate = useNavigate();
    const { data: hotels, error, isLoading } = useHotels();

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
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
                    <Typography variant="h5">Loading Amazing Hotels...</Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Container sx={{ mt: 4 }}>
                    <Alert severity="error" sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                        Error loading hotels: {error.message}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                py: 4
            }}
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
                    <Typography variant="h3" gutterBottom sx={{
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                        mb: 2
                    }}>
                        🏨 Discover Amazing Hotels
                    </Typography>
                    <Typography variant="h6" sx={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                        maxWidth: 600,
                        mx: 'auto'
                    }}>
                        Book your perfect stay from our collection of premium hotels worldwide
                    </Typography>
                </Box>

                {hotels && hotels.length > 0 ? (
                    <Grid container spacing={3}>
                        {hotels.map((hotel) => (
                            <Grid item xs={12} md={6} lg={4} key={hotel.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.98)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* Hotel Header */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h5" component="h2" gutterBottom>
                                                {hotel.hotelName}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                                                <LocationOn color="action" fontSize="small" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {hotel.city}, {hotel.state}
                                                </Typography>
                                                <Chip
                                                    label={hotel.category || '4-Star'}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>

                                            {/* Rating */}
                                            {hotel.rating && (
                                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                                    <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                                                    <Typography variant="body2">
                                                        {hotel.rating} ({hotel.totalReviews || 0} reviews)
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Description */}
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {hotel.description?.substring(0, 120)}...
                                        </Typography>

                                        {/* Price Range */}
                                        {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Starting from
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    ₹{Math.min(...hotel.roomTypes.map(room => room.pricePerNight))}
                                                    <Typography component="span" variant="body2"> / night</Typography>
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Key Amenities */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Key Amenities:
                                            </Typography>
                                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                {hotel.amenities?.slice(0, 4).map((amenity, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={amenity}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                ))}
                                                {hotel.amenities?.length > 4 && (
                                                    <Chip
                                                        label={`+${hotel.amenities.length - 4} more`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Contact Info */}
                                        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                                            <Phone fontSize="small" color="action" />
                                            <Typography variant="body2">{hotel.phoneNo}</Typography>
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    onClick={() => navigate(`/bookroom/${hotel.id}/${hotel.hotelName}`)}
                                                    sx={{ mb: 1 }}
                                                >
                                                    Book Now
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onClick={() => navigate(`/review/${hotel.id}`)}
                                                >
                                                    Add Review
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onClick={() => navigate(`/viewReview/${hotel.id}`)}
                                                >
                                                    View Reviews
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box textAlign="center" py={8}>
                        <HotelIcon sx={{ fontSize: 64, color: 'white', mb: 2 }} />
                        <Typography variant="h5" gutterBottom sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            No hotels available
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            Please check back later for available hotels.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Hotels;
