import React from 'react';
import { Box, Typography } from '@mui/material';

const TermsAndConditions = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Terms and Conditions
            </Typography>
            <Typography variant="h6" gutterBottom>
                1. Reservation Policy
            </Typography>
            <Typography paragraph>
                All reservations must be guaranteed with a valid credit card. A deposit may be required during special events or peak seasons.
            </Typography>
            <Typography variant="h6" gutterBottom>
                2. Cancellation Policy
            </Typography>
            <Typography paragraph>
                Cancellations must be made 48 hours before check-in to avoid a cancellation fee. Special events may require a longer notice.
            </Typography>
            <Typography variant="h6" gutterBottom>
                3. Check-In and Check-Out
            </Typography>
            <Typography paragraph>
                Check-in time is 3:00 PM, and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request.
            </Typography>
            <Typography variant="h6" gutterBottom>
                4. Guest Responsibility
            </Typography>
            <Typography paragraph>
                Guests are responsible for any damage or loss caused to the property during their stay. A damage deposit may be required.
            </Typography>
            <Typography variant="h6" gutterBottom>
                5. No Smoking Policy
            </Typography>
            <Typography paragraph>
                Smoking is not allowed in any of the hotel rooms or common areas. A cleaning fee will be charged for violations.
            </Typography>
            <Typography variant="h6" gutterBottom>
                6. Privacy Policy
            </Typography>
            <Typography paragraph>
                We respect your privacy. Your personal information will only be used for reservation purposes and will not be shared with third parties.
            </Typography>
            <Typography variant="h6" gutterBottom>
                7. Changes to Terms
            </Typography>
            <Typography paragraph>
                We reserve the right to modify these terms and conditions at any time. Guests will be notified of any significant changes.
            </Typography>
            <Typography variant="h6" gutterBottom>
                8. Contact Information
            </Typography>
            <Typography paragraph>
                For any questions or concerns regarding these terms and conditions, please contact us at info@bonstay.com or call us at +1 (555) 123-4567.
            </Typography>
        </Box>
    );
};

export default TermsAndConditions;
