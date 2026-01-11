import { Typography, Box, Paper, Fade, LinearProgress } from '@mui/material';
import { CheckCircle, Error, Info } from '@mui/icons-material';

const RegistrationStatus = ({ error, success, registeredId }) => {
    if (!error && !success) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle sx={{ fontSize: 28 }} />;
            case 'error':
                return <Error sx={{ fontSize: 28 }} />;
            default:
                return <Info sx={{ fontSize: 28 }} />;
        }
    };

    const getGradient = (type) => {
        switch (type) {
            case 'success':
                return 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';
            case 'error':
                return 'linear-gradient(135deg, #f44336 0%, #c62828 100%)';
            default:
                return 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)';
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            {error && (
                <Fade in={true} timeout={500}>
                    <Paper
                        elevation={6}
                        sx={{
                            mb: 2,
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: getGradient('error'),
                            color: 'white',
                            position: 'relative'
                        }}
                    >
                        <Box sx={{
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getIcon('error')}
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    Registration Failed
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        opacity: 0.95,
                                        lineHeight: 1.5
                                    }}
                                >
                                    {error}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            )}

            {success && registeredId && (
                <Fade in={true} timeout={500}>
                    <Paper
                        elevation={6}
                        sx={{
                            mb: 2,
                            borderRadius: 3,
                            overflow: 'hidden',
                            background: getGradient('success'),
                            color: 'white',
                            position: 'relative'
                        }}
                    >
                        <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                                height: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        />

                        <Box sx={{
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getIcon('success')}
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    Registration Successful! 🎉
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        opacity: 0.95,
                                        lineHeight: 1.5,
                                        mb: 1
                                    }}
                                >
                                    Welcome to Bonstay! Your user ID is: <strong>{registeredId}</strong>
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.8,
                                        fontStyle: 'italic'
                                    }}
                                >
                                    You can now access all premium features and start booking amazing stays!
                                </Typography>
                            </Box>
                        </Box>

                        {/* Decorative elements */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 100,
                            height: 100,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            transform: 'translate(30px, -30px)'
                        }} />
                    </Paper>
                </Fade>
            )}
        </Box>
    );
};

export default RegistrationStatus;
