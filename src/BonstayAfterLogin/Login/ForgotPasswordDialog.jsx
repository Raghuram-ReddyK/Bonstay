import { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Alert
} from '@mui/material';
import axios from 'axios';
import { getBackendApiUrl } from '../../config/apiConfig';

const ForgotPasswordDialog = ({ open, onClose }) => {
    const [identifier, setIdentifier] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (!identifier) {
            setError('Please enter your email address');
            return;
        }
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(getBackendApiUrl('/users/forgot-password'), {
                identifier: identifier,
            });

            if (response.data.success) {
                setSuccess(response.data.message || 'Password reset email sent successfully. Please check your email.');
            } else {
                setError('Failed to send password reset email.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError(error.response?.data?.message || 'Failed to send password reset email. Please try again.');
        }
    };

    const handleClose = () => {
        setIdentifier('');
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
                <TextField
                    label="Enter your Email"
                    margin="normal"
                    fullWidth
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    error={Boolean(error)}
                    helperText={error || ''}
                />
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordDialog;
