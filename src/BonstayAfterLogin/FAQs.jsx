
import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQs = () => {
    const faqList = [
        {
            question: "What are the check-in and check-out times?",
            answer: "Check-in is at 3:00 PM, and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request."
        },
        {
            question: "Is breakfast included in the room rate?",
            answer: "Yes, a complimentary breakfast is included for all guests."
        },
        {
            question: "Do you offer free Wi-Fi?",
            answer: "Yes, we provide free Wi-Fi throughout the hotel."
        },
        {
            question: "Is parking available?",
            answer: "Yes, we offer free parking for all guests. Valet parking is also available for an additional fee."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Cancellations must be made 48 hours prior to check-in to avoid any cancellation fees."
        },
        {
            question: "Do you allow pets?",
            answer: "Pets are not allowed in the hotel, with the exception of service animals."
        },
        {
            question: "What amenities do you offer?",
            answer: "We offer a fitness center, swimming pool, business center, and meeting rooms."
        },
        {
            question: "How can I make a reservation?",
            answer: "You can make a reservation through our website or by calling our front desk."
        },
    ];

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Frequently Asked Questions
            </Typography>
            {faqList.map((faq, index) => (
                <Accordion key={index} sx={{ marginBottom: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default FAQs;
