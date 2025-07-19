import React from 'react';
import { Box } from '@mui/material';
import ContactUs from '../ContactUs';
import TermsAndConditions from '../TermsAndConditions';
import FAQs from '../FAQs';
import PrivacyPolicy from '../PrivacyPolicy';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import PreferencesSettings from './PreferencesSettings';

const SettingsContent = ({
    selectedOption,
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
    theme,
    setTheme,
    language,
    setLanguage
}) => {
    switch (selectedOption) {
        case 'profile':
            return (
                <ProfileSettings
                    userInfo={userInfo}
                    email={email}
                    setEmail={setEmail}
                    phoneNo={phoneNo}
                    setPhoneNumber={setPhoneNumber}
                    address={address}
                    setAddress={setAddress}
                    saveSuccess={saveSuccess}
                />
            );

        case 'security':
            return (
                <SecuritySettings
                    userInfo={userInfo}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            );

        case 'notifications':
            return (
                <NotificationSettings
                    notifications={notifications}
                    setNotifications={setNotifications}
                />
            );

        case 'preferences':
            return (
                <PreferencesSettings
                    theme={theme}
                    setTheme={setTheme}
                    language={language}
                    setLanguage={setLanguage}
                />
            );

        case 'contactUs':
            return (
                <Box sx={{ p: 3 }}>
                    {userInfo && <ContactUs userInfo={userInfo} />}
                </Box>
            );

        case 'faqs':
            return (
                <Box sx={{ p: 3, maxHeight: '400px', overflowY: 'auto' }}>
                    <FAQs />
                </Box>
            );

        case 'terms':
            return (
                <Box sx={{ p: 3, maxHeight: '400px', overflowY: 'auto' }}>
                    <TermsAndConditions />
                </Box>
            );

        case 'privacy':
            return (
                <Box sx={{ p: 3, maxHeight: '400px', overflowY: 'auto' }}>
                    <PrivacyPolicy />
                </Box>
            );

        default:
            return null;
    }
};

export default SettingsContent;
