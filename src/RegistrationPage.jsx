import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './Slices/registerSlice'
import {
    Button,
    Typography,
    Link as MuiLink,
    Container,
    Box,
    Paper,
    Divider,
    Alert
} from '@mui/material';

import RegistrationFormSections from './RegistrationFormSection';
import { getApiUrl } from './config/apiConfig';

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

    // Redux integration
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.user);

    // Validate Function

    // Function to validate admin code with email
    const validateAdminCodeWithEmail = async (adminCode, email) => {
        try {
            console.log('Validating admin code:', adminCode, 'for email:', email);

            // First, check if this email is already registered
            const usersResponse = await fetch(getApiUrl(`/users`));
            const users = await usersResponse.json();
            const existingUser = users.find(user =>
                user.email && email && user.email.toLowerCase().trim() === email.toLowerCase().trim()
            );

            if (existingUser) {
                console.log('Email already registered:', email);
                return false; // Email already exists, can't use admin code again
            }

            // Fetch admin code requests to check if the code belongs to this email
            const response = await fetch(getApiUrl(`/admin-code-requests`));
            const adminRequests = await response.json();

            console.log('All admin requests:', adminRequests);

            // Find the request with this admin code and email (case-insensitive email comparison)
            const validRequest = adminRequests.find(request => {
                const emailMatch = request.email && email &&
                    request.email.toLowerCase().trim() === email.toLowerCase().trim();
                const codeMatch = request.adminCode === adminCode;
                const statusApproved = request.status === 'approved';
                const notUsed = !request.codeUsed;

                console.log('Checking request:', {
                    requestId: request.id,
                    requestEmail: request.email,
                    requestCode: request.adminCode,
                    providedCode: adminCode,
                    providedEmail: email,
                    emailMatch,
                    codeMatch,
                    status: request.status,
                    statusApproved,
                    notUsed,
                    codeUsed: request.codeUsed,
                });

                return emailMatch && codeMatch && statusApproved && notUsed;
            });

            console.log('Valid request found:', validRequest);
            return validRequest !== undefined;

        } catch (error) {
            console.error('Error validating admin code:', error);
            return false;
        }
    };

    // Function to mark admin code as used
    const markAdminCodeAsUsed = async (adminCode, email, userId) => {
        try {
            // update admin-code-requests to mark code as used
            const requestsResponse = await fetch(getApiUrl(`/admin-code-requests`));
            const adminRequests = await requestsResponse.json();

            const requestToUpdate = adminRequests.find(request =>
                request.adminCode === adminCode &&
                request.email === email &&
                request.status === 'approved'
            );

            if (requestToUpdate) {
                await fetch(getApiUrl(`/admin-code-requests/${requestToUpdate.id}`), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        codeUsed: true,
                        codeUsedDate: new Date().toISOString(),
                        registeredUserId: userId,
                    }),
                });
            }

            // Also update admin-codes table if it exists
            const codesResponse = await fetch(getApiUrl('/admin-codes'));
            const adminCodes = await codesResponse.json();

            const codeToUpdate = adminCodes.find(code => code.code === adminCode);

            if (codeToUpdate) {
                await fetch(getApiUrl(`/admin-codes/${codeToUpdate.id}`), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isUsed: true,
                        usedAt: new Date().toISOString(),
                        usedBy: email,
                    }),
                });
            }

        } catch (error) {
            console.error('Error marking admin code as used:', error);
        }
    };


    // VALIDATION FUNCTIONS
    const validateField = async (name, value) => {
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
            } else {
                // check for duplicate email
                try {
                    const response = await fetch(getApiUrl`/users`);
                    const users = await response.json();
                    const emailExists = users.some(user =>
                        user.email && value &&
                        user.email.toLowerCase().trim() === value.toLowerCase().trim()
                    );
                    if (emailExists) {
                        error = 'Email already is already registered. Please use a different email';
                    }
                } catch (error) {
                    console.error('Error checking email duplication', error);
                }
            }
        }

        if (name === 'password') {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{4,100}$/;
            if (!passwordRegex.test(value)) {
                error = 'Password must be between 4 and 100 characters, include at least one Uppercase, one lowercase, one number, and one special character';
            }
        }

        if (name === 'adminCode' && state.userType === 'admin') {
            if (value && state.email) {
                // validate admin code with email
                const isValidCode = await validateAdminCodeWithEmail(value, state.email);
                console.log('isValidCode: ', isValidCode);
                if (!isValidCode) {
                    error = "Invalid admin code for this email address or code already used";
                }
            }
            else if (value && !state.email) {
                error = "Please enter email address first";
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

    const validateForm = async () => {
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
        } else {
            // check for duplicate email
            try {
                const response = await fetch(getApiUrl(`/users`));
                const users = await response.json();
                const emailExists = users.some(user =>
                    user.email && state.email &&
                    user.email.toLowerCase().trim() === state.email.toLowerCase().trim()
                );
                if (emailExists) {
                    errors.email = 'Email already is already registered. Please use a different email';
                }
            } catch (error) {
                console.error('Error checking email duplication', error);
            }
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{4,100}$/;
        if (!state.password || !passwordRegex.test(state.password)) {
            errors.password = 'Password must be between 4 and 100 characters, include at least one Uppercase, one lowercase, one number, and one special character';
        }

        if (state.userType === 'admin') {
            if (!state.adminCode) {
                errors.adminCode = 'Admin code is required';
            } else {
                console.log("Final Validation - admin code:", state.adminCode, "email", state.email);
                const isValidCode = await validateAdminCodeWithEmail(state.adminCode, state.email);
                console.log('isValidCode: ', isValidCode);
                if (!isValidCode) {
                    errors.adminCode = 'Invalid admin code for this email address or code already used';
                }
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



    const handleChange = async (event) => {
        const { name, value } = event.target;

        if (name === 'phoneNo' && !/^[0-9]*$/.test(value)) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                phoneNo: 'Phone number can only contain numbers'
            }));
            return;
        }

        // Update state first
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'adminCode' && value && state.email) {
            // Use a small delay to ensure state is updated
            setTimeout(async () => {
                await validateField(name, value);
            }, 50);
        } else if (name === 'email' && state.userType === 'admin' && state.adminCode) {
            // Re-validate admin code when email changes
            setTimeout(async () => {
                await validateField('adminCode', state.adminCode);
            }, 50);
        } else {
            // Regular validation for other fields
            await validateField(name, value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (await validateForm()) {
            try {
                const response = await dispatch(registerUser(state)).unwrap();
                setRegisteredId(response.id);

                // if admin registration, mark the admin code as used
                if (state.userType === 'admin' && state.adminCode) {
                    await markAdminCodeAsUsed(state.adminCode, state.email, response.id)
                }

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
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, minHeight: { xs: 'auto', lg: '600px' } }}>
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
