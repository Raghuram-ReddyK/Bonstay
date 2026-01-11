import { Typography, Box, Paper, Avatar } from '@mui/material';
import { Hotel, PersonAdd } from '@mui/icons-material';

const RegistrationHeader = () => {
    return (
        <Paper elevation={3} sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            py: 6,
            px: 4,
            mb: 4,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>)',
                opacity: 0.3
            }
        }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                    <Hotel sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h3" component="h1" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    Join Bonstay
                </Typography>
                
                <Typography variant="h5" sx={{ 
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    opacity: 0.95,
                    fontWeight: 400,
                    mb: 2
                }}>
                    Create your account for premium hotel experiences
                </Typography>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: 1,
                    mt: 2
                }}>
                    <PersonAdd sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ 
                        opacity: 0.9,
                        fontSize: '0.95rem'
                    }}>
                        Quick & Easy Registration Process
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default RegistrationHeader;
