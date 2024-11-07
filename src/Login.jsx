import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Container,
    FormControlLabel,
    Checkbox,
    Link as MuiLink,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

const Login = ({ setIsLoggedIn, setUserId }) => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false); // State to track Privacy checkbox
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Forgot password related states
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotPasswordUserId, setForgotPasswordUserId] = useState('');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!acceptPrivacy) {
            setError('Please read and accept the privacy policy before logging in.');
            return; // Prevent login if privacy policy is not accepted
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/users/${id}`);
            const userData = response.data;

            if (userData && userData.password === password) {
                sessionStorage.setItem('id', userData.id);
                setIsLoggedIn(true);
                setUserId(userData.id); // Set the userId in the state immediately
                setSuccess('Login successful!');
                navigate(`/dashboard/${userData.id}`); // Correct navigation
            } else {
                setError('Invalid Username/Password');
            }
        } catch (error) {
            console.error(error);
            setError('Error while logging in.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async () => {
        if (!forgotPasswordUserId || !forgotPasswordEmail) {
            setForgotPasswordError('Please enter both UserID and Email');
            return;
        }
        setForgotPasswordError('');
        setForgotPasswordSuccess('');

        try {
            // Call the API to request password reset email with UserID and Email
            await axios.post('http://localhost:4000/forgot-password', {
                userId: forgotPasswordUserId,
                email: forgotPasswordEmail,
            });

            setForgotPasswordSuccess('A password reset link has been sent to your email address.');
        } catch (error) {
            console.error(error);
            setForgotPasswordError('Failed to send password reset email.');
        }
    };

    return (
        <Container maxWidth="md" className="login-container">
            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="login-form">
                <Typography variant="h4" gutterBottom color="white">
                    Login Form
                </Typography>
                {isLoading && <CircularProgress sx={{ mx: 'auto', mb: 2 }} />}
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField
                    label="UserID"
                    margin="normal"
                    required
                    fullWidth
                    name="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    error={Boolean(error)}
                    helperText={error === 'Invalid Username/Password' ? 'UserID or password is incorrect.' : ''}
                    sx={{ color: 'white' }}
                />
                <TextField
                    label="Password"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={Boolean(error)}
                    helperText={error === 'Invalid Username/Password' ? 'UserID or password is incorrect.' : ''}
                    sx={{ color: 'white' }}
                />
                <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                    label="Remember me"
                    sx={{ color: 'white' }}
                />

                {/* Privacy Policy Checkbox */}
                <FormControlLabel
                    control={<Checkbox checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />}
                    label={
                        <span>
                            I have read and agree to the{' '}
                            <MuiLink href="/privacy-policy" underline="true" color="white">
                                Privacy Policy
                            </MuiLink>
                        </span>
                    }
                    sx={{ color: 'white' }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Login
                </Button>
                <MuiLink href="/Register" underline="hover" color="white" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    Don't have an account? Sign Up
                </MuiLink>

                {/* Forgot Password Link */}
                <MuiLink
                    onClick={() => setForgotPasswordOpen(true)}
                    underline="hover"
                    color="white"
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                >
                    Forgot Password?
                </MuiLink>
            </form>

            {/* Forgot Password Dialog */}
            <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
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
                    <Button onClick={() => setForgotPasswordOpen(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleForgotPasswordSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login;
