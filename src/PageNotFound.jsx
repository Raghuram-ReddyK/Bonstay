import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container, Paper, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import HotelIcon from '@mui/icons-material/Hotel';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageNotFound = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.3,
                }
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={12}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        animation: `${fadeIn} 0.8s ease-out`,
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >

                    {/* Hotel Icon with Animation */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                            animation: `${float} 3s ease-in-out infinite`,
                        }}
                    >
                        <HotelIcon
                            sx={{
                                fontSize: { xs: 80, md: 120 },
                                color: '#667eea',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                            }}
                        />
                    </Box>

                    {/* 404 Text */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '4rem', md: '6rem' },
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        404
                    </Typography>

                    {/* Main Message */}
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            color: '#333',
                            fontWeight: 500,
                            fontSize: { xs: '1.5rem', md: '2rem' }
                        }}
                    >
                        Oops! Room Not Found
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            color: '#666',
                            maxWidth: 500,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        The page you're looking for seems to have checked out.
                        Let's get you back to comfort at Bonstay!
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate("/")}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                            }}
                        >
                            Back to Home
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate(-1)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                    borderColor: '#5a6fd8',
                                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                            }}
                        >
                            Go Back
                        </Button>
                    </Box>

                    {/* Help Text */}
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 4,
                            color: '#888',
                            fontSize: '0.9rem'
                        }}
                    >
                        Need help? Contact our support team for assistance with your booking.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default PageNotFound;
