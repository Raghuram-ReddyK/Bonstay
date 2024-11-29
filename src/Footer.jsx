import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const Footer = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  const handleNavigation = (path) => {
    navigate(path);  // Programmatically navigate to the provided path
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        padding: '20px',  // Increased padding for better spacing
        backgroundColor: '#2c3e50',  // Custom background color (dark blue-gray)
        color: 'white',  // Text color contrast
        position: 'relative',
        bottom: 0,
        width: '100%',
        marginTop: 'auto',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" color="inherit">
        &copy; 2018 - {new Date().getFullYear()} Bonstay Hotel. All rights reserved. <br />
        Bonstay® is a registered trademark. <br />
        {/* Using Button to navigate to Privacy Policy and Terms & Conditions */}
        <Button
          variant="text"
          color="inherit"
          onClick={() => handleNavigation('/privacy-policy')}  // Navigation to Privacy Policy page
        >
          Privacy Policy
        </Button>
        {' | '}
        <Button
          variant="text"
          color="inherit"
          onClick={() => handleNavigation('/terms-conditions')}  // Navigation to Terms & Conditions page
        >
          Terms & Conditions
        </Button>
      </Typography>
    </Box>
  );
};

export default Footer;
