import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';  // Importing MailIcon

const ContactUs = ({ userInfo }) => {
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleContactUs = () => {
        const senderEmail = userInfo.email; // Sender email is the logged-in user's email
        const receiverEmail = 'rrrinfo@bonstay.com'; // Fixed receiver email
        const subject = encodeURIComponent('Contact Us');
        const mob = userInfo.phoneNo;
        const body = encodeURIComponent(`
            Hello, I would like to contact you regarding...

            Sender Email: ${senderEmail}

            

            Thanks & Regards,
            ${userInfo.name || 'User'}
            Mobile Number: ${mob}
        `);

        // Open Gmail compose window
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}&su=${subject}&body=${body}`;

        // Set loading state and open mailto link after 5 seconds
        setLoading(true);
        setTimeout(() => {
            window.open(mailtoLink, '_blank'); // Open in a new tab
            setLoading(false); // Reset loading state
        }, 5000); // 5 seconds
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography>
                You can contact us at +91 - 9505908380
            </Typography>
            <Typography variant="body1">You can reach us via email by clicking below:</Typography>
            <Button
                variant="outlined"
                onClick={handleContactUs}
                disabled={loading}
                startIcon={<MailIcon />}  // Adding the MailIcon inside the button
            >
                {loading ? <CircularProgress size={30} /> : 'Contact Us'}
            </Button>
        </Box>
    );
};

export default ContactUs;
