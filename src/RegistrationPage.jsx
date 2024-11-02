
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './Slices/registerSlice'; // Import the Redux action
import { Button, TextField, Typography, Link as MuiLink } from '@mui/material';

const RegistrationPage = () => {
    const [state, setState] = useState({
        name: '',
        address: '',
        phoneNo: '',
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        address: '',
        phoneNo: '',
        email: '',
        password: ''
    });

    const [registeredId, setRegisteredId] = useState(null); // To store the newly created user ID

    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.user); // Redux state

    // Validate each input field and set the formErrors state
    const validateField = (name, value) => {
        let error = '';

        if (name === 'name') {
            if (value.length < 5) {
                error = 'Name must be at least 5 characters';
            }
        }

        if (name === 'phoneNo') {
            // Check if the phone number contains only digits and is 10 digits long
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) {
                error = 'Phone number must be exactly 10 digits and only contain numbers';
            }
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Invalid email format';
            }
        }

        if (name === 'password') {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{4,100}$/;
            if (!passwordRegex.test(value)) {
                error = 'Password must be between 4 and 100 characters, include at least one Uppercase, one lowercase, one number, and one special character';
            }
        }

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    // Handle change for each input field
    const handleChange = (event) => {
        const { name, value } = event.target;

        // Allow only numeric input in the phone number field
        if (name === 'phoneNo') {
            if (!/^[0-9]*$/.test(value)) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    phoneNo: 'Phone number can only contain numbers'
                }));
                return; // Do not update the state if the value is not numeric
            }
        }

        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));

        validateField(name, value);
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const errors = {};

        if (!state.name || state.name.length < 3) {
            errors.name = 'Name must be at least 5 characters';
        }

        if (!state.phoneNo || state.phoneNo.length !== 10) {
            errors.phoneNo = 'Phone number must be exactly 10 digits and only contain numbers';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!state.email || !emailRegex.test(state.email)) {
            errors.email = 'Invalid email format';
        }

        if (!state.password || state.password.length < 4 || state.password.length > 100) {
            errors.password = 'Password must be between 4 and 100 characters, include at least one Uppercase, one lowercase, one number, and one special character';
        }

        setFormErrors(errors);

        // Form is valid if there are no error messages
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the form is valid before submitting
        if (validateForm()) {
            // Dispatch the registerUser action with form data
            try {
                const response = await dispatch(registerUser(state)).unwrap();
                console.log('Registered successfully with user ID:', response.id);
                setRegisteredId(response.id); // Set the registered user ID
            } catch (err) {
                console.error('Error while registering:', err);
            }
        } else {
            // Scroll to the first error for better user experience
            const firstErrorField = document.querySelector('.Mui-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="container">
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="name"
                    label="Name"
                    value={state.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="address"
                    label="Address"
                    value={state.address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="phoneNo"
                    label="Phone No"
                    value={state.phoneNo}
                    onChange={handleChange}
                    error={!!formErrors.phoneNo}
                    helperText={formErrors.phoneNo}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="email"
                    label="Email"
                    value={state.email}
                    onChange={handleChange}
                    error={!!formErrors.email || (error && error === 'Email is already registered')}
                    helperText={formErrors.email || (error && error === 'Email is already registered' ? error : '')} // Display the error from Redux
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="password"
                    label="Password"
                    value={state.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    type="password"
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </Button>
                {error && <Typography color="error">{error}</Typography>}
                {success && registeredId && (
                    <Typography color="primary">
                        Successfully registered! Your user ID is: {registeredId}
                    </Typography>
                )}
            </form>
            <MuiLink href="/login" underline="true" color='white' sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                Already have an account? Login here.
            </MuiLink>
        </div>
    );
};

export default RegistrationPage;