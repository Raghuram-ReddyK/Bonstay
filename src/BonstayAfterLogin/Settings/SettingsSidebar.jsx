import React from 'react';
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Person,
    Security,
    Notifications,
    Palette,
    HelpOutline,
    ContactSupport,
    Policy,
    Gavel,
    AdminPanelSettings
} from '@mui/icons-material';

const SettingsSidebar = ({ selectedOption, setSelectedOption, userType }) => {
    const menuItems = [
        {
            id: 'profile',
            icon: Person,
            primary: 'Profile Information',
            secondary: 'Update your personal details'
        },
        {
            id: 'security',
            icon: Security,
            primary: 'Security',
            secondary: 'Password and account security'
        },
        {
            id: 'notifications',
            icon: Notifications,
            primary: 'Notifications',
            secondary: 'Manage your notification preferences'
        },
        {
            id: 'preferences',
            icon: Palette,
            primary: 'Preferences',
            secondary: 'Theme and language settings'
        }
    ];

    const helpItems = [
        {
            id: 'contactUs',
            icon: ContactSupport,
            primary: 'Contact Us',
            secondary: 'Get help and support'
        },
        {
            id: 'faqs',
            icon: HelpOutline,
            primary: 'FAQs',
            secondary: 'Frequently asked questions'
        },
        {
            id: 'terms',
            icon: Gavel,
            primary: 'Terms & Conditions',
            secondary: 'Our terms of service'
        },
        {
            id: 'privacy',
            icon: Policy,
            primary: 'Privacy Policy',
            secondary: 'How we protect your data'
        }
    ];

    return (
        <List sx={{ p: 0 }}>
            {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                    <ListItemButton
                        key={item.id}
                        selected={selectedOption === item.id}
                        onClick={() => setSelectedOption(item.id)}
                        sx={{ py: 2 }}
                    >
                        <ListItemIcon>
                            <IconComponent color={selectedOption === item.id ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.primary}
                            secondary={item.secondary}
                        />
                    </ListItemButton>
                );
            })}

            <Divider sx={{ my: 1 }} />

            {userType === 'admin' && (
                <ListItemButton
                    selected={selectedOption === 'adminSettings'}
                    onClick={() => setSelectedOption('adminSettings')}
                    sx={{ py: 2 }}
                >
                    <ListItemIcon>
                        <AdminPanelSettings color={selectedOption === 'adminSettings' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Admin Settings"
                        secondary="Administrative controls"
                    />
                </ListItemButton>
            )}

            {helpItems.map((item) => {
                const IconComponent = item.icon;
                return (
                    <ListItemButton
                        key={item.id}
                        selected={selectedOption === item.id}
                        onClick={() => setSelectedOption(item.id)}
                        sx={{ py: 2 }}
                    >
                        <ListItemIcon>
                            <IconComponent color={selectedOption === item.id ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.primary}
                            secondary={item.secondary}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    );
};

export default SettingsSidebar;
