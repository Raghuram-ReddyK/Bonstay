import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './Slices/registerSlice'; // Import the Redux action
import { Button, TextField, Typography, Link as MuiLink, Container, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import CountrySelect from './CountrySelect';

const RegistrationPage = () => {
    const [state, setState] = useState({
        name: '',
        address: '',
        country: '',
        phoneNo: '',
        email: '',
        password: '',
        userType: 'user',
        adminCode: '',
        department: '',
        dateOfBirth: '',
        gender: '',
        occupation: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        address: '',
        country: '',
        phoneNo: '',
        email: '',
        password: '',
        adminCode: '',
        department: '',
        dateOfBirth: '',
        gender: '',
        occupation: '',
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

        if (name === 'adminCode' && state.userType === 'admin') {
            if (value !== 'ADMIN2024') {
                error = 'Invalid admin code';
            }
        }

        if (name === 'department' && state.userType === 'admin') {
            if (value.length < 2) {
                error = 'Department must be at least 2 characters';
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

        if (!state.name || state.name.length < 5) {
            errors.name = 'Name must be at least 5 characters';
        }

        if (!state.phoneNo || state.phoneNo.length !== 10) {
            errors.phoneNo = 'Phone number must be exactly 10 digits and only contain numbers';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!state.email || !emailRegex.test(state.email)) {
            errors.email = 'Invalid email format';
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{4,100}$/;
        if (!state.password || !passwordRegex.test(state.password)) {
            errors.password = 'Password must be between 4 and 100 characters, include at least one Uppercase, one lowercase, one number, and one special character';
        }

        if (state.userType === 'admin') {
            if (!state.adminCode || state.adminCode !== 'ADMIN2024') {
                errors.adminCode = 'Valid admin code is required'
            }
            if (!state.userType === 'user') {
                if (!state.department || state.department.length < 2) {
                    errors.department = 'Department is required'
                }
            }
        }

        if (state.userType === 'user') {
            if (!state.dateOfBirth) {
                errors.dateOfBirth = 'Date of birth is required';
            }
            if (!state.gender) {
                errors.errors = 'Gender is required'
            }
            if (!state.occupation) {
                errors.occupation = 'Occupation is required'
            }
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
        <Container className="container">
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>

                <FormControl fullWidth margin='normal'>
                    <InputLabel sx={{ color: 'white' }}> Login As </InputLabel>
                    <Select
                        name='userType'
                        value={state.userType}
                        onChange={handleChange}
                        label="User Type"
                    >
                        <MenuItem value="user"> Normal User </MenuItem>
                        <MenuItem value="admin"> Administrator </MenuItem>
                    </Select>
                </FormControl>

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
                <CountrySelect
                    onChange={handleChange}
                    value={state.country}
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

                {/* Admin specific Fields*/}
                {state.userType === 'admin' && (
                    <>
                        <TextField
                            name='adminCode'
                            label="Admin Code"
                            onChange={handleChange}
                            error={!!formErrors.adminCode}
                            helperText={formErrors.adminCode || "Enter the admin verification code"}
                            type='password'
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            name='department'
                            label="Department"
                            onChange={handleChange}
                            error={!!formErrors.department}
                            helperText={formErrors.department}
                            fullWidth
                            margin='normal'
                        />
                    </>
                )}

                {/* Normal user specific Fields*/}
                {state.userType === 'user' && (
                    <>
                        <TextField
                            name='dateOfBirth'
                            label="Date of Birth"
                            type='date'
                            value={state.dateOfBirth}
                            onChange={handleChange}
                            error={!!formErrors.dateOfBirth}
                            helperText={formErrors.dateOfBirth}
                            fullWidth
                            margin='normal'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth margin='normal' error={!!formErrors.gender}>
                            <InputLabel> Gender </InputLabel>
                            <Select
                                name='gender'
                                value={state.gender}
                                onChange={handleChange}
                                label="Gender"
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="others">Others</MenuItem>
                            </Select>
                            {formErrors.gender && <FormHelperText>{formErrors.gender}</FormHelperText>}
                        </FormControl>
                        <TextField
                            name='occupation'
                            label="Occupation"
                            value={state.occupation}
                            onChange={handleChange}
                            error={!!formErrors.occupation}
                            helperText={formErrors.occupation}
                            fullWidth
                            margin='normal'
                        />
                    </>
                )}
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
                <MuiLink href="/Login" underline="hover" color='white' sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} >
                    Already have an account? Login here.
                </MuiLink>
            </form>
        </Container>
    );
};

export default RegistrationPage;
