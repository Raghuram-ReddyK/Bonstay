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
import { getApiUrl } from '../../config/apiConfig';

const ForgotPasswordDialog = ({ open, onClose }) => {
    const [forgotPasswordUserId, setForgotPasswordUserId] = useState('');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');

    const handleSubmit = async () => {
        if (!forgotPasswordUserId || !forgotPasswordEmail) {
            setForgotPasswordError('Please enter both UserID and Email');
            return;
        }
        setForgotPasswordError('');
        setForgotPasswordSuccess('');

        try {
            await axios.post(getApiUrl('/forgot-password'), {
                userId: forgotPasswordUserId,
                email: forgotPasswordEmail,
            });

            setForgotPasswordSuccess('A password reset link has been sent to your email address.');
        } catch (error) {
            console.error(error);
            setForgotPasswordError('Failed to send password reset email.');
        }
    };

    const handleClose = () => {
        setForgotPasswordUserId('');
        setForgotPasswordEmail('');
        setForgotPasswordError('');
        setForgotPasswordSuccess('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
                <TextField
                    label="Enter your UserID"
                    margin="normal"
                    fullWidth
                    value={forgotPasswordUserId}
                    onChange={(e) => setForgotPasswordUserId(e.target.value)}
                    error={Boolean(forgotPasswordError)}
                    helperText={forgotPasswordError || ''}
                />
                <TextField
                    label="Enter your Email"
                    margin="normal"
                    fullWidth
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    error={Boolean(forgotPasswordError)}
                    helperText={forgotPasswordError || ''}
                />
                {forgotPasswordSuccess && <Alert severity="success">{forgotPasswordSuccess}</Alert>}
                {forgotPasswordError && <Alert severity="error">{forgotPasswordError}</Alert>}
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
