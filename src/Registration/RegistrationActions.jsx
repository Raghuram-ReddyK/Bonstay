import { Button, Typography, Link as MuiLink, Box, Paper, CircularProgress } from '@mui/material';
import { PersonAdd, Login, CheckCircle } from '@mui/icons-material';

const RegistrationActions = ({ loading, onSubmit }) => {
    return (
        <Paper elevation={3} sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>)',
                opacity: 0.3
            }
        }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    onClick={onSubmit}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                    sx={{ 
                        mb: 3,
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        minWidth: 250,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                        },
                        '&:disabled': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            transform: 'none'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? 'Creating Your Account...' : 'Create My Account'}
                </Button>
                
                <Box sx={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
                    pt: 3,
                    mt: 3
                }}>
                    <Typography variant="body1" sx={{ 
                        mb: 2,
                        opacity: 0.9,
                        fontWeight: 500
                    }}>
                        Already have an account?
                    </Typography>
                    
                    <MuiLink 
                        href="/Login" 
                        underline="none"
                        sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            padding: '8px 16px',
                            borderRadius: 2,
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                            }
                        }}
                    >
                        <Login sx={{ fontSize: 20 }} />
                        Sign In Here
                    </MuiLink>
                </Box>

                {/* Features highlight */}
                <Box sx={{ 
                    mt: 4, 
                    pt: 3,
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    {[
                        'Secure Registration',
                        'Instant Access', 
                        'Premium Features'
                    ].map((feature, index) => (
                        <Box key={index} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            opacity: 0.9
                        }}>
                            <CheckCircle sx={{ fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default RegistrationActions;
