// ContactUs.js
import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const ContactUs = ({ userEmail }) => {
    const handleContactUs = () => {
        const senderEmail = userEmail; // Sender email is the logged-in user's email
        const receiverEmail = 'rrrkarnati2000@example.com'; // Fixed receiver email
        const subject = encodeURIComponent('Contact Us');
        const body = encodeURIComponent(`Hello, I would like to contact you regarding...\n\nSender Email: ${senderEmail}`);
        
        // Open Gmail compose window
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}&su=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank'); // Open in a new tab
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography>
                You can contact to +91 - 9505908380
            </Typography>
            <Typography variant="body1">You can reach us via email:</Typography>
            <Button variant="outlined" onClick={handleContactUs}>
                Contact Us
            </Button>
        </Box>
    );
};

export default ContactUs;
