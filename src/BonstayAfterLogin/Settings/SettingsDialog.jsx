import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Settings,
    Save,
    Cancel
} from '@mui/icons-material';
import SettingsSidebar from './SettingsSidebar';
import SettingsContent from './SettingsContent';

const SettingsDialog = ({
    open,
    onClose,
    userType,
    selectedOption,
    setSelectedOption,
    userInfo,
    email,
    setEmail,
    phoneNo,
    setPhoneNumber,
    address,
    setAddress,
    saveSuccess,
    showPassword,
    setShowPassword,
    notifications,
    setNotifications,
    language,
    setLanguage,
    loading,
    onSave
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '80vh',
                    maxHeight: '800px'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <Settings />
                Account Settings
                <Chip
                    label={userType === 'admin' ? 'Administrator' : 'User'}
                    size="small"
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                />
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Sidebar Navigation */}
                    <Grid item xs={12} md={4} sx={{
                        borderRight: 1,
                        borderColor: 'divider',
                        bgcolor: 'grey.50'
                    }}>
                        <SettingsSidebar
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                            userType={userType}
                        />
                    </Grid>

                    {/* Content Area */}
                    <Grid item xs={12} md={8} sx={{ height: '100%', overflow: 'auto' }}>
                        <SettingsContent
                            selectedOption={selectedOption}
                            userInfo={userInfo}
                            email={email}
                            setEmail={setEmail}
                            phoneNo={phoneNo}
                            setPhoneNumber={setPhoneNumber}
                            address={address}
                            setAddress={setAddress}
                            saveSuccess={saveSuccess}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            notifications={notifications}
                            setNotifications={setNotifications}
                            language={language}
                            setLanguage={setLanguage}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
                {(selectedOption === 'profile') && (
                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        onClick={onSave}
                        disabled={loading}
                        sx={{ mr: 1 }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                )}
                <Button
                    onClick={onClose}
                    startIcon={<Cancel />}
                    color="inherit"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;
