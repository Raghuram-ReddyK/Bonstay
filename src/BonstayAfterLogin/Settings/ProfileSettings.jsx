import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Grid,
    Alert
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';

const ProfileSettings = ({
    userInfo,
    email,
    setEmail,
    phoneNo,
    setPhoneNumber,
    address,
    setAddress,
    saveSuccess
}) => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Profile Information
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                You can edit your email, phone number, and address. Other fields are read-only.
            </Typography>
            {saveSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Profile updated successfully!
                </Alert>
            )}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={userInfo?.name || ''}
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                    />
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                    />
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        value={phoneNo}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        helperText="Enter 10-digit phone number"
                        InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="User ID"
                        variant="outlined"
                        fullWidth
                        value={userInfo?.id || ''}
                        disabled
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="User Type"
                        variant="outlined"
                        fullWidth
                        value={userInfo?.userType === 'admin' ? 'Administrator' : 'Normal User'}
                        disabled
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Country"
                        variant="outlined"
                        fullWidth
                        value={userInfo?.country || ''}
                        disabled
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        InputProps={{
                            startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                        }}
                    />
                </Grid>

                {/* Additional Information Section */}
                {(userInfo?.dateOfBirth || userInfo?.gender || userInfo?.occupation || userInfo?.department) && (
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3, mb: 2 }}>
                            Additional Information
                        </Typography>
                        <Grid container spacing={3}>
                            {userInfo?.dateOfBirth && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Date of Birth"
                                        variant="outlined"
                                        fullWidth
                                        value={userInfo.dateOfBirth}
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            )}
                            {userInfo?.gender && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Gender"
                                        variant="outlined"
                                        fullWidth
                                        value={userInfo.gender}
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            )}
                            {userInfo?.occupation && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Occupation"
                                        variant="outlined"
                                        fullWidth
                                        value={userInfo.occupation}
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            )}
                            {userInfo?.department && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Department"
                                        variant="outlined"
                                        fullWidth
                                        value={userInfo.department}
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )}

            </Grid>
        </Box>
    );
};

export default ProfileSettings;
