import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './Slices/registerSlice';
import { Container, Box } from '@mui/material';
import { useRegistrationValidation } from './hooks/useRegistrationValidation';
import RegistrationHeader from './Registration/RegistrationHeader';
import RegistrationStatus from './Registration/RegistrationStatus';
import RegistrationForm from './Registration/RegistrationForm';
import RegistrationActions from './Registration/RegistrationActions';

const RegistrationPage = () => {
    // ==================== STATE MANAGEMENT ====================
    const [state, setState] = useState({
        name: '',
        address: '',
        country: '',
        phoneNo: '',
        email: '',
        password: '',
        userType: 'user', // Default to normal user
        // Admin specific fields
        adminCode: '',
        department: '',
        // Normal user specific fields
        dateOfBirth: '',
        gender: '',
        occupation: ''
    });

    const [registeredId, setRegisteredId] = useState(null);

    // ==================== HOOKS ====================
    const dispatch = useDispatch();
    const { loading, success, error, message } = useSelector((state) => state.user);
    const {
        formErrors,
        setFormErrors,
        validateField,
        validateForm,
        markAdminCodeAsUsed
    } = useRegistrationValidation();

    // ==================== EVENT HANDLERS ====================
    const handleChange = async (event) => {
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

        // Update state first
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // For admin code validation, we need to use the updated email from current state
        if (name === 'adminCode' && value && state.email) {
            // Use a small delay to ensure state is updated
            setTimeout(async () => {
                await validateField(name, value, state);
            }, 50);
        } else if (name === 'email' && state.userType === 'admin' && state.adminCode) {
            // Re-validate admin code when email changes
            setTimeout(async () => {
                await validateField('adminCode', state.adminCode, state);
            }, 50);
        } else {
            // Regular validation for other fields
            await validateField(name, value, state);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the form is valid before submitting
        if (await validateForm(state)) {
            // Prepare the data to send - include all fields as the backend requires them
            const userData = { ...state };

            // Dispatch the registerUser action with form data
            try {
                const response = await dispatch(registerUser(userData)).unwrap();
                console.log('Registered successfully with user ID:', response.id);
                setRegisteredId(response.id); // Set the registered user ID

                // If admin registration, mark the admin code as used
                if (state.userType === 'admin' && state.adminCode) {
                    await markAdminCodeAsUsed(state.adminCode, state.email, response.id);
                }

                // Clear the form after successful registration
                setState({
                    name: '',
                    address: '',
                    country: '',
                    phoneNo: '',
                    email: '',
                    password: '',
                    userType: 'user', // Reset to default
                    // Admin specific fields
                    adminCode: '',
                    department: '',
                    // Normal user specific fields
                    dateOfBirth: '',
                    gender: '',
                    occupation: ''
                });

                // Clear form errors
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
            // Scroll to the first error for better user experience
            const firstErrorField = document.querySelector('.Mui-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // ==================== MAIN RENDER ====================
    return (
        <Container maxWidth="lg" sx={{ py: 3, minHeight: '100vh' }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    /* Override any global form styles from App.css */
                    maxWidth: 'none !important',
                    width: '100% !important',
                    backgroundColor: 'transparent !important',
                    padding: '0 !important',
                    borderRadius: '0 !important',
                    position: 'static !important',
                    zIndex: 'auto !important'
                }}
            >
                {/* Form Header */}
                <RegistrationHeader />

                {/* Status Display */}
                <RegistrationStatus
                    error={error}
                    success={success}
                    message={message}
                    registeredId={registeredId}
                />

                {/* Main Form Container */}
                <RegistrationForm
                    state={state}
                    formErrors={formErrors}
                    error={error}
                    handleChange={handleChange}
                />

                {/* Form Actions */}
                <Box sx={{
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e2e8f0',
                    p: { xs: 3, md: 4 },
                    borderRadius: '0 0 8px 8px',
                    '& .MuiButton-root': {
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#2563eb'
                        },
                        '&:disabled': {
                            backgroundColor: '#9ca3af',
                            color: '#ffffff'
                        }
                    }
                }}>
                    <RegistrationActions
                        loading={loading}
                        onSubmit={handleSubmit}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default RegistrationPage;
