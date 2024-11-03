// Login.js
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
} from '@mui/material';

const Login = ({ setIsLoggedIn, setUserId }) => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
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

    return (
        <Container maxWidth="md" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }} className='login'>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <Typography variant="h4" gutterBottom>
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
                />
                <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                    label="Remember me"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Login
                </Button>
                <MuiLink href="/register" underline="true" color='white' sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    Don't have an account? Sign Up
                </MuiLink>
            </form>
        </Container>
    );
};

export default Login;
