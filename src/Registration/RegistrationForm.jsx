import { Paper, Box, Card, CardContent, Typography, Chip, Avatar, Stepper, Step, StepLabel, Fade, LinearProgress } from '@mui/material';
import { Person, Security, CheckCircle, PersonAdd, Business, ContactMail } from '@mui/icons-material';
import { useState } from 'react';
import RegistrationFormSections from '../RegistrationFormSection';

const RegistrationForm = ({ state, formErrors, error, handleChange }) => {
    const [activeSection, setActiveSection] = useState(0);

    const formSections = RegistrationFormSections({
        state,
        formErrors,
        error,
        handleChange
    });

    const sections = [
        {
            label: 'Account Type',
            icon: <PersonAdd />,
            description: 'Choose your account type',
            completed: state.userType !== ''
        },
        {
            label: 'Personal Info',
            icon: <ContactMail />,
            description: 'Basic information',
            completed: state.name && state.email && state.password && state.phoneNo
        },
        {
            label: 'Additional Details',
            icon: <Business />,
            description: 'Complete your profile',
            completed: state.userType === 'admin' ? (state.adminCode && state.department) : (state.dateOfBirth && state.gender && state.occupation)
        }
    ];

    const getProgress = () => {
        const completed = sections.filter(section => section.completed).length;
        return (completed / sections.length) * 100;
    };

    return (
        <Box sx={{ mb: 4 }}>
            {/* Progress Indicator */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Registration Progress
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={getProgress()}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                            }
                        }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {Math.round(getProgress())}% Complete
                    </Typography>
                </Box>

                <Stepper activeStep={activeSection} sx={{ mb: 2 }}>
                    {sections.map((section, index) => (
                        <Step key={section.label}>
                            <StepLabel
                                icon={
                                    <Avatar sx={{
                                        width: 32,
                                        height: 32,
                                        backgroundColor: section.completed ? '#4caf50' : index <= activeSection ? '#667eea' : '#e0e0e0',
                                        color: 'white'
                                    }}>
                                        {section.completed ? <CheckCircle sx={{ fontSize: 20 }} /> : section.icon}
                                    </Avatar>
                                }
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {section.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {section.description}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {/* Account Type Selection */}
            <Paper elevation={3} sx={{
                borderRadius: 3,
                overflow: 'hidden',
                mb: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: '#2d3748',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <PersonAdd sx={{ color: '#667eea' }} />
                        Choose Your Account Type
                    </Typography>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3,
                        mb: 4
                    }}>
                        {[
                            {
                                type: 'user',
                                icon: <Person sx={{ fontSize: 48, color: '#667eea' }} />,
                                title: 'Regular User',
                                description: 'Book hotels and manage your reservations',
                                features: ['Hotel Booking', 'Reservation Management', 'Booking History', 'Customer Support'],
                                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            },
                            {
                                type: 'admin',
                                icon: <Security sx={{ fontSize: 48, color: '#e53e3e' }} />,
                                title: 'Administrator',
                                description: 'Manage hotel operations and user accounts',
                                features: ['Hotel Management', 'User Management', 'Analytics Dashboard', 'Admin Tools'],
                                gradient: 'linear-gradient(135deg, #e53e3e 0%, #fd5c63 100%)'
                            }
                        ].map((option) => (
                            <Card
                                key={option.type}
                                onClick={() => {
                                    const syntheticEvent = {
                                        target: { name: 'userType', value: option.type }
                                    };
                                    handleChange(syntheticEvent);
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    border: state.userType === option.type ? '3px solid #667eea' : '2px solid #e2e8f0',
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    transform: state.userType === option.type ? 'translateY(-4px)' : 'none',
                                    boxShadow: state.userType === option.type ?
                                        '0 8px 25px rgba(102, 126, 234, 0.25)' :
                                        '0 2px 8px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                                    },
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {state.userType === option.type && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        background: option.gradient,
                                        color: 'white',
                                        p: 1,
                                        borderRadius: '0 0 0 20px'
                                    }}>
                                        <CheckCircle sx={{ fontSize: 20 }} />
                                    </Box>
                                )}

                                <CardContent sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                    <Box sx={{ mb: 2 }}>
                                        {option.icon}
                                    </Box>

                                    <Typography variant="h6" sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: '#2d3748'
                                    }}>
                                        {option.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {option.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                        {option.features.map((feature, idx) => (
                                            <Chip
                                                key={idx}
                                                label={feature}
                                                size="small"
                                                sx={{
                                                    background: state.userType === option.type ?
                                                        option.gradient : 'rgba(102, 126, 234, 0.1)',
                                                    color: state.userType === option.type ? 'white' : '#667eea',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Paper>

            {/* Form Content */}
            <Fade in={true} timeout={500}>
                <Paper elevation={3} sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        minHeight: { xs: 'auto', lg: '500px' }
                    }}>
                        {/* Left Part: Basic Information */}
                        <Box sx={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            borderRight: { lg: '1px solid #e2e8f0' },
                            borderBottom: { xs: '1px solid #e2e8f0', lg: 'none' },
                            '& .MuiTextField-root': {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#ffffff',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#e2e8f0',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                        boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.1)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: '2px',
                                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#4a5568',
                                    fontWeight: 500
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#2d3748'
                                }
                            },
                            '& .MuiFormControl-root': {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#ffffff',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#e2e8f0',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                        boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.1)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: '2px',
                                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#4a5568',
                                    fontWeight: 500
                                }
                            }
                        }}>
                            <Box sx={{ p: { xs: 3, md: 4 } }}>
                                {formSections.renderBasicInfoSection()}
                            </Box>
                        </Box>

                        {/* Right Part: Role Details */}
                        <Box sx={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                            '& .MuiTextField-root': {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#ffffff',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#e2e8f0',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                        boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.1)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: '2px',
                                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#4a5568',
                                    fontWeight: 500
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: '#2d3748'
                                }
                            },
                            '& .MuiFormControl-root': {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#ffffff',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#e2e8f0',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                        boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.1)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                        borderWidth: '2px',
                                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#4a5568',
                                    fontWeight: 500
                                }
                            },
                            '& .MuiAlert-root': {
                                backgroundColor: '#ebf8ff',
                                border: '1px solid #90cdf4',
                                borderRadius: 2,
                                '& .MuiAlert-message': {
                                    color: '#2a4365'
                                }
                            }
                        }}>
                            <Box sx={{ p: { xs: 3, md: 4 } }}>
                                {formSections.renderRoleDetailsSection()}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default RegistrationForm;
