import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    CircularProgress, 
    Box, 
    Card, 
    CardContent, 
    Grid, 
    Button,
    Chip,
    Avatar,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { 
    Hotel as HotelIcon,
    BookOnline as BookIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Star as StarIcon,
    Support as SupportIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { getApiUrl } from '../config/apiConfig';

const DashBoard = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userId = sessionStorage.getItem('id');
                if (userId) {
                    const response = await axios.get(getApiUrl(`/users/${userId}`)); 
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setUser(response.data);
                } else {
                    console.log("user not found in session storage");
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const services = [
        { icon: <BookIcon />, title: 'Easy Booking', description: 'Book your stay in just a few clicks' },
        { icon: <SupportIcon />, title: 'Quick Cancellation', description: 'Cancel bookings hassle-free' },
        { icon: <PhoneIcon />, title: '24/7 Customer Service', description: 'Round-the-clock support for all your needs' },
        { icon: <StarIcon />, title: 'Best Price Guaranteed', description: 'Get the best deals on all bookings' }
    ];

    return (
        <Box className='dashboard'>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress size={60} sx={{ color: 'white' }} />
                    </Box>
                ) : (
                    <>
                        {/* Welcome Section */}
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                mb: 4, 
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar 
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        mr: 3,
                                        bgcolor: 'primary.main',
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" component="h1" color="primary" gutterBottom>
                                        Welcome back, {user?.name || 'User'}!
                                    </Typography>
                                    <Chip 
                                        label="Premium Member" 
                                        color="primary" 
                                        variant="outlined"
                                        sx={{ fontSize: '0.9rem', px: 1 }}
                                    />
                                </Box>
                            </Box>
                            
                            <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                "Bonstay always provides you an amazing and pleasant stay with your friends and family at reasonable prices."
                            </Typography>
                        </Paper>

                        {/* Services Grid */}
                        <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
                            Our Premium Services
                        </Typography>
                        
                        <Grid container spacing={3} mb={4}>
                            {services.map((service, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card 
                                        sx={{ 
                                            height: '100%',
                                            background: 'rgba(255,255,255,0.9)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                            <Box 
                                                sx={{ 
                                                    color: 'primary.main', 
                                                    mb: 2,
                                                    '& svg': { fontSize: '3rem' }
                                                }}
                                            >
                                                {service.icon}
                                            </Box>
                                            <Typography variant="h6" component="h3" gutterBottom color="primary">
                                                {service.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {service.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* About Section */}
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3
                            }}
                        >
                            <Typography variant="h5" component="h2" color="primary" gutterBottom>
                                Why Choose Bonstay?
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                We provide well-designed spaces with modern amenities that ensure your comfort and satisfaction. 
                                Our efficient booking system allows you to reserve a room faster and easier than ever before.
                            </Typography>
                            
                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={12} md={6}>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <HotelIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Luxury Accommodations" 
                                                secondary="Premium rooms with modern facilities"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <SecurityIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Secure Booking" 
                                                secondary="Safe and encrypted payment processing"
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <StarIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="5-Star Experience" 
                                                secondary="Exceptional service and hospitality"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <LocationIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Prime Locations" 
                                                secondary="Strategic locations across major cities"
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Contact Section */}
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4,
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 3
                            }}
                        >
                            <Typography variant="h5" component="h2" color="primary" gutterBottom>
                                Get in Touch
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <EmailIcon color="primary" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                queries@bonstay.com
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <PhoneIcon color="primary" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                +91 9191919191
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <LocationIcon color="primary" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                90/1A, Kochi, Kerala
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box textAlign="center" mt={4}>
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    color="primary"
                                    sx={{ 
                                        px: 4, 
                                        py: 1.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Start Your Booking Journey
                                </Button>
                            </Box>
                        </Paper>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default DashBoard;
