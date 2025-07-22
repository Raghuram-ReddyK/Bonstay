import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box, 
  Card, 
  Grid, 
  Container,
  Fade,
  Paper,
  Avatar,
  Rating,
  Chip
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Chatbot from './Chatbot';

const Home = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  const heroImages = [
    '/Hotel.jpg',
    '/Hotel1.jpg', 
    '/View.jpg'
  ];

  const features = [
    { icon: <WifiIcon />, title: 'Free WiFi', description: 'High-speed internet throughout the property' },
    { icon: <LocalParkingIcon />, title: 'Free Parking', description: 'Complimentary parking for all guests' },
    { icon: <PoolIcon />, title: 'Swimming Pool', description: 'Outdoor pool with city views' },
    { icon: <FitnessCenterIcon />, title: 'Fitness Center', description: '24/7 modern gym facilities' },
    { icon: <RestaurantIcon />, title: 'Restaurant', description: 'On-site dining with local cuisine' },
    { icon: <LocationOnIcon />, title: 'Prime Location', description: 'Walking distance to major attractions' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      review: 'Exceptional service and beautiful rooms. The staff went above and beyond to make our stay memorable.'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      review: 'Perfect location and amazing amenities. Will definitely book again on my next visit.'
    },
    {
      name: 'Emma Williams',
      rating: 4,
      review: 'Great value for money. Clean, comfortable, and the breakfast was fantastic.'
    }
  ];

  useEffect(() => {
    // Page loading animation
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        setFadeIn(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleChatClick = () => {
    setChatVisible(true);
  };

  const handleCloseChat = () => {
    setChatVisible(false);
  };

  return (
    <Fade in={pageLoaded} timeout={1000}>
      <Box className="home-modern">
        {/* Hero Section */}
        <Box className="hero-section" sx={{ position: 'relative', overflow: 'hidden' }}>
          <Fade in={fadeIn} timeout={1000}>
            <Box
              sx={{
                backgroundImage: `url(${heroImages[currentImageIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Floating Particles */}
              <Box className="floating-particles">
                {[...Array(10)].map((_, i) => (
                  <Box key={i} className="particle" />
                ))}
              </Box>
              
              <Container maxWidth="lg" className="hero-content">
              <Box className="welcome-section">
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 3, 
                    textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                    background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    letterSpacing: '2px'
                  }}
                >
                  Welcome to Bonstay
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    maxWidth: '800px', 
                    mx: 'auto', 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', md: '1.4rem' }
                  }}
                >
                  Experience luxury and comfort at its finest. Modern amenities, exceptional service, 
                  and unforgettable moments await you at our premium hotel.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    component={Link} 
                    to="/Login"
                    className="animated-button"
                    sx={{ 
                      px: 4, 
                      py: 2, 
                      fontSize: '1.2rem',
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      boxShadow: '0 8px 20px rgba(255, 107, 107, 0.4)',
                      borderRadius: '30px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 12px 30px rgba(255, 107, 107, 0.6)',
                        background: 'linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)'
                      }
                    }}
                  >
                    🏨 Book Your Stay
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    className="animated-button"
                    sx={{ 
                      px: 4, 
                      py: 2, 
                      fontSize: '1.2rem',
                      borderColor: 'rgba(255,255,255,0.8)',
                      color: 'white',
                      borderRadius: '30px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(255,255,255,0.3)'
                      }
                    }}
                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  >
                    ✨ Explore Features
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        </Fade>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="features">
        <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
          Premium Amenities
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            What Our Guests Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6" component="h4">
                        {testimonial.name}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.review}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Admin Access Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Staff & Admin Access
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Hotel staff and organization representatives can request admin access 
            to manage bookings, user accounts, and hotel operations.
          </Typography>
          <Button 
            variant="outlined" 
            size="large"
            component={Link} 
            to="/admin-code-request"
            sx={{ 
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Request Admin Access
          </Button>
        </Paper>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            Get in Touch
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, opacity: 0.9 }}>
            Need assistance? Our friendly team is here to help you 24/7
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Chip
              icon={<MailIcon />}
              label="info@bonstay.com"
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=info@bonstay.com&su=Contact%20Bonstay&body=Hello%20Bonstay,%20I%20would%20like%20to%20...', '_blank')}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}
            />
            <Chip
              icon={<CallIcon />}
              label="+91 9000000999"
              onClick={() => window.open('tel:+91 9000000999')}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}
            />
            <Chip
              icon={<ChatIcon />}
              label="Live Chat"
              onClick={handleChatClick}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '1rem',
                py: 3,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Floating Chat Button */}
      <Box
        onClick={handleChatClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 6px 25px rgba(0,0,0,0.4)'
          }
        }}
      >
        <ChatIcon sx={{ color: 'white', fontSize: 28 }} />
      </Box>

      {/* Render Chatbot when chatVisible is true */}
      {chatVisible && <Chatbot onClose={handleCloseChat} />}
      </Box>
    </Fade>
  );
};

export default Home;