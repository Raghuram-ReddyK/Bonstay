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
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    Error loading hotels: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom color="primary">
                Discover Amazing Hotels
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Book your perfect stay from our collection of premium hotels
            </Typography>
            
            {hotels && hotels.length > 0 ? (
                <Grid container spacing={3}>
                    {hotels.map((hotel) => (
                        <Grid item xs={12} md={6} lg={4} key={hotel.id}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
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
                    <HotelIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>No hotels available</Typography>
                    <Typography color="text.secondary">Please check back later for available hotels.</Typography>
                </Box>
            )}
        </Container>
    );
};

export default Hotels;
