import { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Alert,
    CircularProgress,
} from '@mui/material';
import { getApiUrl } from '../config/apiConfig';

const View = ({ handleLogout, userId: loggedInUserId }) => {
    const [userId, setUserId] = useState('');
    const [userDetails, setUserDetails] = useState({ id: '', name: '', email: '' });
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setUserId(event.target.value);
        setDeleteMessage(''); // Clear any previous delete messages on user ID change
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Create a delay function using Promise

    const viewUser = async () => {
        if (userId !== loggedInUserId) {
            setDeleteMessage('Access Denied: You can only view your own details');
            return;
        }

        setIsLoading(true); // Set loading state to true before API call
        try {
            await delay(5000); // Introduce a 5-second delay
            const response = await axios.get(getApiUrl(`/users/${userId}`));
            setUserDetails(response.data);
            setDeleteMessage('');
        } catch (error) {
            setDeleteMessage('User ID not found.');
            console.error(error);
        } finally {
            setIsLoading(false); // Set loading state to false after response or error
        }
    };

    const deleteUser = async () => {
        setIsLoading(true);
        try {
            await delay(5000); // Introduce a 5-second delay
            await axios.delete(getApiUrl(`/users/${userId}`));
            setDeleteMessage('User deleted successfully.');
            handleLogout(); // Automatically log out after successful deletion
        } catch (error) {
            setDeleteMessage('Error deleting user.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} className='view'>
            <Card sx={{ maxWidth: 400 }}>
                <CardHeader title="View User Details" />
                <CardContent>
                    <TextField
                        id="outlined-basic"
                        label=" Enter your User ID"
                        variant="outlined"
                        value={userId}
                        onChange={handleChange}
                        error={!!deleteMessage} // Set error state for user ID field if there's a delete message
                        helperText={deleteMessage || `Enter your User Id (${loggedInUserId}) to view your details`} // Display delete message as helper text for user ID field
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={viewUser} disabled={isLoading} fullWidth sx={{ mb: 2 }}>
                        {isLoading ? <CircularProgress size={24} color="secondary" /> : 'View User'}
                    </Button>
                    {userDetails.id && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                User Details
                            </Typography>
                            <Typography variant="body1">id: {userDetails.id}</Typography>
                            <Typography variant="body2">Name: {userDetails.name}</Typography>
                            <Typography variant="body1">Country: {userDetails.country}</Typography>
                            <Typography variant="body1">Address: {userDetails.address}</Typography>
                            <Typography variant="body1">PhoneNo: {userDetails.phoneNo}</Typography>
                            <Typography variant="body1">Email: {userDetails.email}</Typography>
                            {/* <Typography variant="body1">Password: {userDetails.password}</Typography> */}
                            <Button variant="contained" color="secondary" onClick={deleteUser} disabled={isLoading}>
                                {isLoading ? <CircularProgress size={24} color="secondary" /> : 'Delete User'}
                            </Button>
                        </>
                    )}
                    {deleteMessage && <Alert severity={deleteMessage.includes('deleted') ? 'success' : 'error'}>{deleteMessage}</Alert>}
                </CardContent>
            </Card>
        </div>
    );
};

export default View;
