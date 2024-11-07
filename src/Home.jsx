import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat'; // AI Chat Icon
import Chatbot from './Chatbot';

const Home = () => {
  const [chatVisible, setChatVisible] = useState(false); // State to toggle chatbot visibility

  const handleChatClick = () => {
    setChatVisible(true); // Show the chatbot when the chat icon is clicked
  };

  const handleCloseChat = () => {
    setChatVisible(false); // Close the chatbot
  };

  return (
    <Box className="home" style={{ padding: '20px' }}>
      <Typography variant="body1">
        Bonstay always provides you an amazing and pleasant stay<br />
        with your friends and family at reasonable prices.<br />
        We provide well-designed space with modern amenities.<br />
        You can reserve a room faster with our efficient Bonstay app
      </Typography>

      {/* Main Button */}
      <Button variant="contained" color="primary" component={Link} to="/Login" sx={{ marginTop: 3 }}>
        Click here to login
      </Button>

      {/* Contact Icons Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 3
        }}
      >
        <Typography>If you need anything, contact us using the options...</Typography>

        {/* Mail Icon - Open Gmail in the browser with pre-filled email */}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bonstay.com&su=Contact%20Bonstay&body=Hello%20Bonstay,%20I%20would%20like%20to%20..."
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '10px' }}
        >
          <MailIcon color="primary" sx={{ fontSize: 40 }} />
        </a>

        {/* Call Icon - Redirects to calling functionality */}
        <a href="tel:+91 9000000999" style={{ marginRight: '10px' }}>
          <CallIcon color="primary" sx={{ fontSize: 40 }} />
        </a>

        {/* AI Chat Icon - Opens Chatbot */}
        <div
          style={{
            cursor: 'pointer',
            marginLeft: '10px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleChatClick}
        >
          <ChatIcon sx={{ fontSize: 25, color: 'white' }} />
        </div>
      </Box>

      {/* Render Chatbot when chatVisible is true */}
      {chatVisible && <Chatbot onClose={handleCloseChat} />}
    </Box>
  );
};

export default Home;
