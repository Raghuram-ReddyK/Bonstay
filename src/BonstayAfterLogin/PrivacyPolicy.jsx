// PrivacyPolicy.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Privacy Policy
            </Typography>
            <Typography paragraph>
                At Bonstay, we value your privacy and are committed to protecting your personal information. This privacy policy outlines how we collect, use, disclose, and safeguard your information when you visit our hotel and use our services.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Information We Collect
            </Typography>
            <Typography paragraph>
                We may collect personal information that you provide directly to us when you:
                <ul>
                    <li>Make a reservation</li>
                    <li>Check-in at our hotel</li>
                    <li>Sign up for our newsletter</li>
                    <li>Contact us for inquiries or feedback</li>
                </ul>
                This information may include your name, email address, phone number, and payment details.
            </Typography>
            <Typography variant="h6" gutterBottom>
                How We Use Your Information
            </Typography>
            <Typography paragraph>
                We use your information for the following purposes:
                <ul>
                    <li>To process your reservations and provide our services</li>
                    <li>To communicate with you regarding your stay and any inquiries</li>
                    <li>To improve our services and enhance your experience</li>
                    <li>To send promotional materials, if you have opted to receive them</li>
                </ul>
            </Typography>
            <Typography variant="h6" gutterBottom>
                Sharing Your Information
            </Typography>
            <Typography paragraph>
                We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Data Security
            </Typography>
            <Typography paragraph>
                We implement a variety of security measures to maintain the safety of your personal information. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Your Rights
            </Typography>
            <Typography paragraph>
                You have the right to access, correct, or delete your personal information. If you would like to exercise any of these rights, please contact us using the information provided below.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Changes to This Privacy Policy
            </Typography>
            <Typography paragraph>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on our website. You are advised to review this privacy policy periodically for any changes.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Contact Us
            </Typography>
            <Typography paragraph>
                If you have any questions about this privacy policy or our data practices, please contact us at:
                <br />
                [Hotel Name - Bonstay] <br />
                [Hotel Address - Hyderabad] <br />
                [Phone Number - 9808679768] <br />
                [Email Address - info@bonstay.com]
            </Typography>
        </Box>
    );
};

export default PrivacyPolicy;
