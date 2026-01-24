import { useState } from 'react';
import adminCodeService from '../services/adminCodeService';

export const useRegistrationValidation = () => {
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

    // Function to validate admin code with email
    const validateAdminCodeWithEmail = async (adminCode, email) => {
        try {
            console.log('Validating admin code:', adminCode, 'for email:', email);

            // Fetch admin code requests to check if the code belongs to this email
            const response = await adminCodeService.getAdminCodeRequests();
            const adminRequests = response.data.data;

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
                    providedEmail: email,
                    emailMatch,
                    requestCode: request.adminCode,
                    providedCode: adminCode,
                    codeMatch,
                    status: request.status,
                    statusApproved,
                    codeUsed: request.codeUsed,
                    notUsed
                });

                return emailMatch && codeMatch && statusApproved && notUsed;
            });

            console.log('Valid request found:', validRequest);
            if (validRequest) {
                console.log('Admin code validated successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error validating admin code:', error);
            return false;
        }
    };

    // Function to mark admin code as used
    const markAdminCodeAsUsed = async (adminCode, email, userId) => {
        try {
            // Update admin-code-requests to mark code as used
            const response = await adminCodeService.getAdminCodeRequests();
            const adminRequests = response.data.data;

            const requestToUpdate = adminRequests.find(request =>
                request.adminCode === adminCode &&
                request.email === email &&
                request.status === 'approved'
            );

            if (requestToUpdate) {
                await adminCodeService.updateAdminCodeRequest(requestToUpdate.id, {
                    codeUsed: true,
                    codeUsedDate: new Date().toISOString(),
                    registeredUserId: userId
                });
            }

            // Also update admin-codes table using the use API
            await adminCodeService.useAdminCode(adminCode, userId);
        } catch (error) {
            console.error('Error marking admin code as used:', error);
        }
    };

    // Validate each input field and set the formErrors state
    const validateField = async (name, value, state) => {
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
            if (value && state.email) {
                console.log('Validating admin code field:', value, 'with email:', state.email);
                // Validate admin code with email
                const isValidCode = await validateAdminCodeWithEmail(value, state.email);
                console.log('Validation result:', isValidCode);
                if (!isValidCode) {
                    error = 'Invalid admin code for this email address or code already used';
                }
            } else if (value && !state.email) {
                error = 'Please enter email address first';
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

    // Validate the entire form before submission
    const validateForm = async (state) => {
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

        // Validate admin specific fields
        if (state.userType === 'admin') {
            if (!state.adminCode) {
                errors.adminCode = 'Admin code is required';
            } else {
                console.log('Final validation - admin code:', state.adminCode, 'email:', state.email);
                // Validate admin code with email
                const isValidCode = await validateAdminCodeWithEmail(state.adminCode, state.email);
                console.log('Final validation result:', isValidCode);
                if (!isValidCode) {
                    errors.adminCode = 'Invalid admin code for this email address or code already used';
                }
            }
            if (!state.department || state.department.length < 2) {
                errors.department = 'Department is required';
            }
        }

        // Validate normal user specific fields
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

        // Form is valid if there are no error messages
        return Object.keys(errors).length === 0;
    };

    return {
        formErrors,
        setFormErrors,
        validateField,
        validateForm,
        validateAdminCodeWithEmail,
        markAdminCodeAsUsed
    };
};