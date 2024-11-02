import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Alert,
    CircularProgress,
} from '@mui/material';

const View = () => {
    const [userId, setUserId] = useState('');
    const [userDetails, setUserDetails] = useState({ id: '', name: '', email: '' });
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setUserId(event.target.value);
        setDeleteMessage(''); // Clear any previous delete messages on user ID change
    };

    const viewUser = async () => {
        setIsLoading(true); // Set loading state to true before API call
        try {
            const response = await axios.get(`http://localhost:4000/users/${userId}`);
            await new Promise((resolve) => setTimeout(resolve, 5000))
            setUserDetails(response.data);
            setDeleteMessage('');
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            setDeleteMessage('User ID not found.');
            console.error(error);
        } finally {
            setIsLoading(false); // Set loading state to false after response or error
        }
    };

    const handleDelete = async () => {
        setIsLoading(true); // Set loading state to true before API call
        try {
            await axios.delete(`http://localhost:4000/users/${userId}`);
            setUserDetails({ id: '', name: '', email: '' });
            setUserId('');
            setDeleteMessage('User deleted successfully');
        } catch (error) {
            setDeleteMessage('Error deleting user. Please try again later.');
            console.error(error);
        } finally {
            setIsLoading(false); // Set loading state to false after response or error
        }
    };

    useEffect(() => {
        setDeleteMessage(''); // Clear any leftover delete messages on component mount
    }, []); // Empty dependency array ensures this runs only once on component mount

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} className='view'>
            <Card sx={{ maxWidth: 400 }}>
                <CardHeader title="View User" />
                <CardContent>
                    <TextField
                        id="outlined-basic"
                        label="User ID"
                        variant="outlined"
                        value={userId}
                        onChange={handleChange}
                        error={!!deleteMessage} // Set error state for user ID field if there's a delete message
                        helperText={deleteMessage} // Display delete message as helper text for user ID field
                    />
                    <Button variant="contained" color="primary" onClick={viewUser} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="secondary" /> : 'View User'}
                    </Button>
                    {userDetails.id && ( // Conditionally render user details only if ID exists
                        <>
                            <Typography variant="h6" gutterBottom>
                                User Details
                            </Typography>
                            <Typography variant="body1">
                                id: {userDetails.id}
                            </Typography>
                            <Typography variant="body2">
                                Name: {userDetails.name}
                            </Typography>
                            <Typography variant="body1">
                                Address: {userDetails.address}
                            </Typography>
                            <Typography variant="body1">
                                PhoneNo: {userDetails.phoneNo}
                            </Typography>
                            <Typography variant="body1">
                                Email: {userDetails.email}
                            </Typography>
                            <Typography variant="body1">
                                Password: {userDetails.password}
                            </Typography>
                            <CardActions>
                                <Button variant="contained" color="error" onClick={handleDelete} disabled={isLoading}>
                                    {isLoading ? <CircularProgress size={24} color="secondary" /> : 'Delete User'}
                                </Button>
                            </CardActions>
                        </>
                    )}
                    {deleteMessage && <Alert severity={deleteMessage.includes('deleted') ? 'success' : 'error'}>{deleteMessage}</Alert>}
                </CardContent>
            </Card>
        </div>
    );
};

export default View;