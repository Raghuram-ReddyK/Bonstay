import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './Slices/registerSlice'
import {
    Button,
    TextField,
    Typography,
    Link as MuiLink,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    Paper,
    Divider,
    Alert
} from '@mui/material';

import RegistrationFormSections from './RegistrationFormSection';

const RegistrationPage = () => {
    // STATE MANAGEMENT
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
        occupation: ''
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
        occupation: ''
    });

    const [registeredId, setRegisteredId] = useState(null);

    const dispatch = useDispatch();

    const { loading, success, error } = useSelector((state) => state.user);

    // VALIDATION FUNCTIONS
    const validateField = (name, value) => {
        let error = '';

        if (name === 'name') {
            if (value.length < 5) {
                error = 'Name must be at least 5 characters';
            }
        }

        if (name === 'phoneNo') {
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
            if (!value) {
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

    const validateForm = () => {
        const errors = {};

        if (!state.name || state.name.length < 5) {
            errors.name = 'Name must be at least 5 characters';
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!state.phoneNo || !phoneRegex.test(state.phoneNo)) {
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
            if (!state.adminCode) {
                errors.adminCode = 'Admin code is required';
            }
            if (!state.department || state.department.length < 2) {
                errors.department = 'Department is required';
            }
        }

        if (state.userType === 'user') {
            if (!state.dateOfBirth) {
                errors.dateOfBirth = 'Date of birth is required';
            }
            if (!state.gender) {
                errors.gender = 'Gender is required';
            }
            if (!state.occupation) {
                errors.occupation = 'Occupation is required';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validate basic Info step

    const validateBasicInfo = () => {
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

        setFormErrors(errors);
        return Object.keys(errors).length;
    };


    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'phoneNo' && !/^[0-9]*$/.test(value)) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                phoneNo: 'Phone number can only contain numbers'
            }));
            return;
        }

        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));

        validateField(name, value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const response = await dispatch(registerUser(state)).unwrap();
                setRegisteredId(response.id);

                setState({
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
                    occupation: ''
                });

                setFormErrors({
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
                    occupation: ''
                });
            } catch (err) {
                console.error('Error while registering:', err);
            }
        } else {
            const firstErrorField = document.querySelector('.Mui-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const formSections = RegistrationFormSections({
        state,
        formErrors,
        error,
        handleChange
    });

    const renderStatusDisplay = () => (
        <Box sx={{ mb: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && registeredId && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Successfully registered! Your user ID is: {registeredId}
                </Alert>
            )}
        </Box>
    );

    const renderFormActions = () => (
        <Box sx={{ textAlign: 'center' }}>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                size="large"
                sx={{
                    mb: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: 200
                }}
            >
                {loading ? 'Creating Account...' : 'Create My Account'}
            </Button>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Already a member?
                </Typography>
                <MuiLink href="/login" underline="hover" color="primary.main" fontWeight="bold">
                    Sign In to Your Account
                </MuiLink>
            </Box>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 3, minHeight: '100vh' }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100% !important',
                    backgroundColor: 'transparent !important'
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        color="primary"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                        }}
                    >
                        Create Your Account
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                        Join Bonstay - Your trusted hotel booking platform
                    </Typography>
                </Box>

                {renderStatusDisplay()}

                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
                        <Box sx={{ flex: 1, backgroundColor: '#ffffff', p: { xs: 3, md: 4 } }}>
                            {formSections.renderBasicInfoSection()}
                        </Box>
                        <Box sx={{ flex: 1, backgroundColor: '#f9fafc', p: { xs: 3, md: 4 } }}>
                            {formSections.renderRoleDetailsSection()}
                        </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e2e8f0', p: { xs: 3, md: 4 } }}>
                        {renderFormActions()}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegistrationPage;
