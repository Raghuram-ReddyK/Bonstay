import { Grid, Typography, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const BrandingPanel = () => {
    const features = [
        'Premium Hotels Worldwide', 
        '24/7 Customer Support', 
        'Best Price Guarantee', 
        'Secure Booking System'
    ];

    return (
        <Grid 
            item 
            xs={12} 
            md={7} 
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                p: 4
            }}
        >
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                Bonstay
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Your premium hotel booking experience starts here
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                {features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle />
                        <Typography>{feature}</Typography>
                    </Box>
                ))}
            </Box>
        </Grid>
    );
};

export default BrandingPanel;
