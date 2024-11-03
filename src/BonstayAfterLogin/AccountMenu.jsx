import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Draggable from 'react-draggable';
import { Paper, TextField, Typography } from '@mui/material';
import ContactUs from './ContactUs'; // Import the ContactUs component
import TermsAndConditions from './TermsAndConditions';
import FAQs from './FAQs';
import PrivacyPolicy from './PrivacyPolicy';

const DraggableDialog = (props) => {
    const { onClose, ...other } = props;

    return (
        <Draggable handle="#draggable-dialog-title">
            <Paper {...other} />
        </Draggable>
    );
};

const AccountMenu = ({ handleLogout }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userInfo, setUserInfo] = React.useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [dialogSize, setDialogSize] = React.useState({ width: 400, height: 'auto' });
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phoneNo, setPhoneNumber] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('userDetails');
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const fetchUserInfo = async () => {
        try {
            const userId = sessionStorage.getItem('id');
            const response = await axios.get(`http://localhost:4000/users/${userId}`);
            setUserInfo(response.data);
            setEmail(response.data.email);
            setAddress(response.data.address);
            setPhoneNumber(response.data.phoneNo);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleOpenDialog = () => {
        fetchUserInfo();
        setDialogOpen(true);
        handleCloseMenu();
    };

    const handleOpenSettings = () => {
        fetchUserInfo();
        setSettingsOpen(true);
        setSelectedOption('userDetails');
        handleCloseMenu();
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleCloseSettings = () => {
        setSettingsOpen(false);
    };

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

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phone) => {
        const re = /^[0-9]{10}$/;
        return re.test(phone);
    };

    const handleSaveSettings = async () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!address) {
            alert('Address cannot be empty.');
            return;
        }
        if (!validatePhoneNumber(phoneNo)) {
            alert('Please enter a valid phone number (10 digits).');
            return;
        }

        try {
            const userId = sessionStorage.getItem('id');
            await axios.put(`http://localhost:4000/users/${userId}`, {
                id: userInfo.id,
                name: userInfo.name,
                address,
                phoneNo,
                email,
                password: userInfo.password
            });
            alert('User information updated successfully!');
            handleCloseSettings();
            fetchUserInfo();
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Failed to update user information.');
        }
    };

    const renderSettingsContent = () => {
        switch (selectedOption) {
            case 'userDetails':
                return (
                    <>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            fullWidth
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            value={phoneNo}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </>
                );
            case 'contactUs':
                return userInfo && <ContactUs userInfo={userInfo} />; // Pass user email to ContactUs
            case 'faqs':
                return <FAQs/>
            case 'terms':
                return <TermsAndConditions/>
            case 'privacy':
                return <PrivacyPolicy/>
            default:
                return null;
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
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* User Account Information Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                PaperComponent={DraggableDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: dialogSize.width,
                        height: dialogSize.height,
                    },
                }}
            >
                <DialogTitle id="draggable-dialog-title" sx={{ cursor: 'move', position: 'relative' }}>
                    User Account Information
                    <div
                        style={{
                            cursor: 'nwse-resize',
                            width: '20px',
                            height: '20px',
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                            backgroundColor: 'gray',
                        }}
                        onMouseDown={handleMouseDown}
                    />
                </DialogTitle>
                <DialogContent>
                    {userInfo ? (
                        <div>
                            <strong>User ID:</strong> {userInfo.id}
                            <br />
                            <strong>User Name:</strong> {userInfo.name}
                            <br />
                            <strong>Email:</strong> {userInfo.email}
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog
                open={settingsOpen}
                onClose={handleCloseSettings}
                PaperComponent={DraggableDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: dialogSize.width,
                        height: dialogSize.height,
                    },
                }}
            >
                <DialogTitle id="draggable-dialog-title" sx={{ cursor: 'move', position: 'relative' }}>
                    Settings
                    <div
                        style={{
                            cursor: 'nwse-resize',
                            width: '20px',
                            height: '20px',
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                            backgroundColor: 'gray',
                        }}
                        onMouseDown={handleMouseDown}
                    />
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <ul>
                            <li>
                                <Button variant="outlined" onClick={() => setSelectedOption('userDetails')}>
                                    User Details Edit
                                </Button>
                            </li>
                            <li>
                                <Button variant="outlined" onClick={() => setSelectedOption('faqs')}>
                                    FAQs
                                </Button>
                            </li>
                            <li>
                                <Button variant="outlined" onClick={() => setSelectedOption('terms')}>
                                    Terms & Conditions
                                </Button>
                            </li>
                            <li>
                                <Button variant="outlined" onClick={() => setSelectedOption('privacy')}>
                                    Privacy Policy
                                </Button>
                            </li>
                            <li>
                                <Button variant="outlined" onClick={() => setSelectedOption('contactUs')}>
                                    Contact Us
                                </Button>
                            </li>
                        </ul>
                    </Box>
                    {renderSettingsContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveSettings} variant="contained">Save</Button>
                    <Button onClick={handleCloseSettings}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AccountMenu;
