import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Terms and Conditions
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to Bonstay Hotel. These terms and conditions govern your use of our website and services.
        By using our services, you agree to comply with these terms. If you do not agree with these terms, 
        please refrain from using our website.
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Typography variant="h6" gutterBottom>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        These terms and conditions govern your use of Bonstay Hotel's website and services. By accessing 
        or using our services, you agree to comply with the terms outlined here. If you disagree with any 
        of these terms, please do not use our services.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Reservations
      </Typography>
      <Typography variant="body1" paragraph>
        - **Booking Process**: To reserve a room, users must fill out the booking form with correct information. 
        All bookings are subject to availability and confirmation by Bonstay Hotel.
        <br />
        - **Payment**: Full or partial payment may be required at the time of booking. The payment details provided 
        will be processed securely.
        <br />
        - **Cancellations and Modifications**: Cancellations and modifications can be made according to the cancellation 
        policy specified at the time of booking. Late cancellations or no-shows may incur charges.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Check-in and Check-out
      </Typography>
      <Typography variant="body1" paragraph>
        - **Check-in Time**: Standard check-in time is 3:00 PM. Early check-in may be available upon request, subject 
        to room availability.
        <br />
        - **Check-out Time**: Standard check-out time is 11:00 AM. Late check-out may be arranged subject to room 
        availability and additional charges.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Hotel Policies
      </Typography>
      <Typography variant="body1" paragraph>
        - **Age Requirements**: Guests must be at least 18 years old to make a booking. Minors must be accompanied by 
        an adult.
        <br />
        - **Identification**: Valid government-issued photo identification is required at check-in.
        <br />
        - **Pets**: Pets are not allowed unless explicitly stated in the booking confirmation.
        <br />
        - **Smoking**: Smoking is prohibited inside the hotel rooms and public areas. Designated smoking areas are available.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Guest Behavior
      </Typography>
      <Typography variant="body1" paragraph>
        - **Conduct**: All guests must behave in a manner that does not disrupt the comfort or safety of other guests. 
        Bonstay Hotel reserves the right to refuse service or evict guests for inappropriate behavior without refund.
        <br />
        - **Damages**: Guests are responsible for any damages to hotel property during their stay. Charges may be applied 
        to the provided payment method if damages are found.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Privacy and Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        - **Personal Data**: By using our services, you consent to the collection and use of your personal information 
        as described in our Privacy Policy.
        <br />
        - **Payment Information**: We use secure payment gateways for processing transactions and protect your payment 
        information.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Liability
      </Typography>
      <Typography variant="body1" paragraph>
        - **Limitation of Liability**: Bonstay Hotel is not liable for any personal injury, property damage, loss, or 
        theft that occurs on the premises, except where required by law.
        <br />
        - **Force Majeure**: Bonstay Hotel will not be held responsible for failure to perform under these terms due to 
        causes beyond our control, such as natural disasters, strikes, or government actions.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Third-Party Links
      </Typography>
      <Typography variant="body1" paragraph>
        Our website may contain links to third-party websites for convenience or additional services. We are not 
        responsible for the content or privacy practices of these third-party websites.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Modifications
      </Typography>
      <Typography variant="body1" paragraph>
        Bonstay Hotel reserves the right to modify or update these terms at any time without prior notice. Any changes 
        will be posted on our website with the updated date.
      </Typography>

      <Typography variant="h6" gutterBottom>
        10. Governing Law
      </Typography>
      <Typography variant="body1" paragraph>
        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where 
        Bonstay Hotel operates.
      </Typography>

      <Typography variant="h6" gutterBottom>
        11. Contact Information
      </Typography>
      <Typography variant="body1" paragraph>
        For questions regarding these Terms and Conditions or any other inquiries, please contact us at:
        <br />
        <strong>Bonstay Hotel</strong>
        <br />
        Email: <a href="mailto:support@bonstay.com">support@bonstay.com</a>
        <br />
        Phone: +123 456 7890
      </Typography>

    </Box>
  );
};

export default TermsAndConditions;
