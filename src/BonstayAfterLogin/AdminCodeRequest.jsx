import { useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import axios from 'axios';

const AdminCodeRequest = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        department: '',
        reason: '',
        organization: '',
        position: '',
    });

    const steps = ['Personal Information', 'Professional Details', 'Submit Request'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 0:
                return requestData.name && requestData.email && requestData.phoneNo;
            case 1:
                return requestData.department && requestData.organization && requestData.position;
            case 2:
                return requestData.reason;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => prev + 1);
            setError('');
        } else {
            setError('Please fill in all required fields');
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError('');
    };

    const submitRequest = async () => {
        setLoading(true);
        setError('');
        try {
            const requestPayload = {
                ...requestData,
                id: Date.now().toString(),
                status: 'pending',
                requestDate: new Date().toISOString(),
                adminCode: null,
                approvedBy: null,
                approvedDate: null,
            };

            await axios.post('http://localhost:4000/admin-code-requests', requestPayload);

            setMessage('Admin code request submitted successfully! You will receive an email notification once your request is reviewed.');
            setDialogOpen(true);

            // Reset form
            setRequestData({
                name: '',
                email: '',
                phoneNo: '',
                department: '',
                reason: '',
                organization: '',
                position: '',
            });
            setActiveStep(0);
        } catch (error) {
            console.error('Error submitting request', error);
            setError('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            name="name"
                            label="Full Name"
                            value={requestData.name}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="email"
                            label="Email Address"
                            type="email"
                            value={requestData.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="phoneNo"
                            label="Phone Number"
                            value={requestData.phoneNo}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            helperText="This number will be used to send the admin code via SMS"
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            name="organization"
                            label="Organization/Company"
                            value={requestData.organization}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="position"
                            label="Position/Job Title"
                            value={requestData.position}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="department"
                            label="Department"
                            value={requestData.department}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            name="reason"
                            label="Reason for Admin Access Request"
                            value={requestData.reason}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            required
                            helperText="Please provide a detailed explanation of why you need admin access"
                        />
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Request Summary
                            </Typography>
                            <Typography><strong>Name:</strong> {requestData.name}</Typography>
                            <Typography><strong>Email:</strong> {requestData.email}</Typography>
                            <Typography><strong>Phone:</strong> {requestData.phoneNo}</Typography>
                            <Typography><strong>Organization:</strong> {requestData.organization}</Typography>
                            <Typography><strong>Position:</strong> {requestData.position}</Typography>
                            <Typography><strong>Department:</strong> {requestData.department}</Typography>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom align="center" color="primary">
                        Request Admin Code
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }} align="center">
                        Fill out this form to request an admin access code for the Bonstay management system.
                        Your request will be reviewed by an administrator.
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {renderStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Back
                        </Button>
                        <Box>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={submitRequest}
                                    disabled={loading || !validateStep(activeStep)}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!validateStep(activeStep)}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Success Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Request Submitted Successfully</DialogTitle>
                <DialogContent>
                    <Typography>{message}</Typography>
                    <Typography sx={{ mt: 2 }}>What happens next:</Typography>
                    <Typography component="ul" sx={{ mt: 1 }}>
                        <li>An administrator will review your request</li>
                        <li>You'll receive an email notification about the decision</li>
                        <li>If approved, the admin code will be sent to your phone via SMS</li>
                        <li>Use the admin code during registration to create your admin account</li>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminCodeRequest;
