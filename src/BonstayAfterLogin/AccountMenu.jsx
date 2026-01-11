import * as React from 'react';
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    PersonAdd,
    Settings,
    Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';
import SettingsDialog from './Settings/SettingsDialog';
import UserInfoDialog from './Settings/UserInfoDialog';

const AccountMenu = ({ handleLogout }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userInfo, setUserInfo] = React.useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [dialogSize, setDialogSize] = React.useState({ width: 400, height: 'auto' });

    // Profile settings state
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phoneNo, setPhoneNumber] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('profile');
    const [userType, setUserType] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [saveSuccess, setSaveSuccess] = React.useState(false);

    // Other settings state
    const [showPassword, setShowPassword] = React.useState(false);
    const [notifications, setNotifications] = React.useState({
        email: true,
        sms: false,
        push: true
    });
    const [language, setLanguage] = React.useState('en');

    const open = Boolean(anchorEl);

    // Event handlers
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = () => {
        fetchUserInfo();
        setDialogOpen(true);
        handleCloseMenu();
    };

    const handleOpenSettings = () => {
        if (userType === 'admin') {
            const userId = sessionStorage.getItem('id');
            navigate(`/admin-settings/${userId}`);
            handleCloseMenu();
        } else {
            fetchUserInfo();
            setSettingsOpen(true);
            setSelectedOption('profile');
            handleCloseMenu();
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleCloseSettings = () => {
        setSettingsOpen(false);
    };

    // Initialize user type
    React.useEffect(() => {
        const storedUserType = sessionStorage.getItem('userType');
        setUserType(storedUserType);
    }, []);

    // Fetch user information
    const fetchUserInfo = async () => {
        try {
            const userId = sessionStorage.getItem('id');
            const storedUserType = sessionStorage.getItem('userType');
            setUserType(storedUserType);
            const response = await axios.get(getApiUrl(`/users/${userId}`));
            setUserInfo(response.data);
            setEmail(response.data.email);
            setAddress(response.data.address);
            setPhoneNumber(response.data.phoneNo);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    // Dialog resize handlers
    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleResize = (e) => {
        const newWidth = e.clientX - e.target.getBoundingClientRect().left;
        setDialogSize((prevSize) => ({
            ...prevSize,
            width: Math.max(newWidth, 200),
        }));
    };

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phone) => {
        const re = /^[0-9]{10}$/;
        return re.test(phone);
    };

    // Save settings
    const handleSaveSettings = async () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!address.trim()) {
            alert('Address cannot be empty.');
            return;
        }
        if (!validatePhoneNumber(phoneNo)) {
            alert('Please enter a valid phone number (10 digits).');
            return;
        }

        setLoading(true);
        setSaveSuccess(false);

        try {
            const userId = sessionStorage.getItem('id');
            // Preserve all existing user data and only update the editable fields
            const updatedUserData = {
                ...userInfo,
                address,
                email
            };

            await axios.put(getApiUrl(`/users/${userId}`), updatedUserData)

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            fetchUserInfo();
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Failed to update user information.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Account Menu */}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleOpenDialog}>
                    <Avatar /> My account
                </MenuItem>
                <Divider />
                {userType === 'admin' ? (
                    <>
                        <MenuItem onClick={handleOpenSettings}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Admin Settings
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            User Management
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem onClick={handleOpenSettings}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            Add another account
                        </MenuItem>
                    </>
                )}
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* User Info Dialog */}
            <UserInfoDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                userInfo={userInfo}
                dialogSize={dialogSize}
                onMouseDown={handleMouseDown}
            />

            {/* Settings Dialog */}
            <SettingsDialog
                open={settingsOpen}
                onClose={handleCloseSettings}
                userType={userType}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
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
                loading={loading}
                onSave={handleSaveSettings}
            />
        </React.Fragment>
    );
};

export default AccountMenu;
