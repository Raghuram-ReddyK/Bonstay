import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const PageNotFound = () => {
    const navigate = useNavigate();
    
    return (
        <Box 
            sx={{ 
                backgroundImage: 'url(https://media.gettyimages.com/id/1451783304/vector/404-page.jpg?b=1&s=170667a&w=0&k=20&c=Id_qleimXb29S11I7hriGlK8SeeDbkmyLvFXrYBaUPI=)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh', 
                textAlign: 'center',
                color:'blue' 
            }}
        >
            <Typography variant="h1" color="red">
                Page Not Found 404
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }} color='red'>
                Please go back to
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate("/")}
            >
                Click to Home
            </Button>
        </Box>
    );
};

export default PageNotFound;
