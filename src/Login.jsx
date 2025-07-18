import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from './config/apiConfig';
import { useUser, useUserByEmail } from './hooks/useSWRData';
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
    DialogContentText,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const Login = ({ setIsLoggedIn, setUserId }) => {
    const navigate = useNavigate();
    const [userIdOrEmail, setUserIdOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('user'); // Track login type
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false); // State to track Privacy checkbox
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Account lockout states
    const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
    const [lockedUser, setLockedUser] = useState(null);
    const [existingTicketStatus, setExistingTicketStatus] = useState(null);

    // SWR hooks for user data fetching
    const isEmail = userIdOrEmail.includes('@');
    const { data: emailUser, error: emailError, isLoading: emailLoading } = useUserByEmail(
        userIdOrEmail,
        isEmail && userIdOrEmail.length > 0
    );
    const { data: idUser, error: idError, isLoading: idLoading } = useUser(
        userIdOrEmail,
        !isEmail && userIdOrEmail.length > 0
    );

    // Forgot password related states
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotPasswordUserId, setForgotPasswordUserId] = useState('');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');

    // State for Privacy Policy Dialog
    const [privacyPolicyDialogOpen, setPrivacyPolicyDialogOpen] = useState(false);

    // Helper functions for account lockout
    const updateUserFailedAttempts = async (userId, attempts, isLocked = false, lockoutTime = null) => {
        try {
            const response = await axios.get(getApiUrl(`/users/${userId}`));
            const userToUpdate = response.data;

            const updatedUser = {
                ...userToUpdate,
                failedLoginAttempts: attempts,
                isLocked: isLocked,
                lockoutTime: lockoutTime
            };

            await axios.put(getApiUrl(`/users/${userId}`), updatedUser);
        } catch (error) {
            console.error('Error updating user failed attempts:', error);
        }
    };

    const createIncidentTicket = async (user) => {
        try {
            const incidentId = `INC-${Date.now()}`;
            const incident = {
                id: incidentId,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                type: 'account_unlock',
                status: 'pending',
                description: 'Account locked due to multiple failed login attempts',
                failedAttempts: 3,
                lockoutTime: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                resolvedBy: null,
                resolvedAt: null,
                adminNotes: ''
            };

            await axios.post(getApiUrl('/incidentTickets'), incident);
            return incidentId;
        } catch (error) {
            console.error('Error creating incident ticket:', error);
            return null;
        }
    };

    const handleIncidentTicketSubmit = async () => {
        if (!lockedUser) return;

        try {
            // Check if there's already a ticket for this user
            const response = await axios.get(getApiUrl('/incidentTickets'));
            const existingTickets = response.data.filter(ticket =>
                ticket.userId === lockedUser.id &&
                ticket.type === 'account_unlock'
            );

            const latestTicket = existingTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

            if (latestTicket) {
                if (latestTicket.status === 'pending') {
                    setSuccess(`You already have a pending incident ticket (${latestTicket.id}). Please wait for admin approval.`);
                    setIncidentDialogOpen(false);
                    setLockedUser(null);
                    return;
                } else if (latestTicket.status === 'rejected') {
                    // Allow creating a new ticket if the previous one was rejected
                    // Continue with creating new ticket
                } else if (latestTicket.status === 'approved') {
                    setSuccess(`Your previous incident ticket (${latestTicket.id}) was approved. Please try logging in again.`);
                    setIncidentDialogOpen(false);
                    setLockedUser(null);
                    return;
                }
            }

            const incidentId = await createIncidentTicket(lockedUser);
            if (incidentId) {
                setSuccess(`Incident ticket ${incidentId} created successfully. An admin will review your request.`);
            } else {
                setError('Failed to create incident ticket. Please try again or contact support.');
            }

            setIncidentDialogOpen(false);
            setLockedUser(null);
        } catch (error) {
            console.error('Error checking existing tickets:', error);
            setError('Failed to create incident ticket. Please try again or contact support.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!acceptPrivacy) {
            setError('Please read and accept the privacy policy before logging in.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            let userData = null;

            if (isEmail) {
                if (emailLoading) {
                    setError('Loading user data...');
                    return;
                }

                if (emailError) {
                    setError('Error loading user data. Please try again.');
                    return;
                }

                userData = emailUser;
            } else {
                if (idLoading) {
                    setError('Loading user data...');
                    return;
                }

                if (idError) {
                    setError('User not found. Please check your UserID.');
                    return;
                }

                userData = idUser;
            }

            if (!userData) {
                setError('User not found. Please check your credentials.');
                return;
            }

            // Check if account is locked
            if (userData.isLocked) {
                // Check for existing tickets to show proper message
                try {
                    const response = await axios.get(getApiUrl('/incidentTickets'));
                    const userTickets = response.data.filter(ticket =>
                        ticket.userId === userData.id &&
                        ticket.type === 'account_unlock'
                    );
                    const latestTicket = userTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                    setExistingTicketStatus(latestTicket);
                } catch (error) {
                    console.error('Error fetching ticket status:', error);
                }

                setError('Your account has been locked due to multiple failed login attempts. Please create an incident ticket to unlock your account.');
                setLockedUser(userData);
                setIncidentDialogOpen(true);
                return;
            }

            // Check user type
            if (userData.userType !== userType) {
                setError(`Invalid login type. This account is registered as ${userData.userType === 'admin' ? 'Administrator' : 'Normal User'}`);
                return;
            }

            // For non-admin users, check lockout status and incident tickets
            if (userData.userType !== 'admin' && userData.failedLoginAttempts >= 3) {
                // Check if there's any incident ticket for this user
                const response = await axios.get(getApiUrl('/incidentTickets'));
                const userTickets = response.data.filter(ticket =>
                    ticket.userId === userData.id &&
                    ticket.type === 'account_unlock'
                );

                const latestTicket = userTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                // If no ticket exists, or latest ticket is not approved, deny login
                if (!latestTicket || latestTicket.status !== 'approved') {
                    // Force lock the account if not already locked
                    if (!userData.isLocked) {
                        await updateUserFailedAttempts(userData.id, userData.failedLoginAttempts, true, userData.lockoutTime || new Date().toISOString());
                    }

                    let errorMessage = 'Your account has been locked due to multiple failed login attempts.';
                    if (latestTicket) {
                        if (latestTicket.status === 'pending') {
                            errorMessage = `Your account is locked. Your incident ticket ${latestTicket.id} is pending admin approval.`;
                        } else if (latestTicket.status === 'rejected') {
                            errorMessage = `Your account is locked. Your incident ticket ${latestTicket.id} was rejected. Please create a new incident ticket.`;
                        }
                    } else {
                        errorMessage += ' Please create an incident ticket to unlock your account.';
                    }

                    setError(errorMessage);
                    setExistingTicketStatus(latestTicket);
                    setLockedUser({ ...userData, isLocked: true });
                    setIncidentDialogOpen(true);
                    return;
                }

                // If latest ticket is approved, allow login (reset lockout status)
                if (latestTicket.status === 'approved' && userData.isLocked) {
                    await updateUserFailedAttempts(userData.id, 0, false, null);
                    userData = { ...userData, isLocked: false, failedLoginAttempts: 0 };
                }
            }

            // Block login if there's a pending or rejected ticket, even if account appears unlocked
            if (userData.failedLoginAttempts >= 3) {
                try {
                    const response = await axios.get(getApiUrl('/incidentTickets'));
                    const userTickets = response.data.filter(ticket =>
                        ticket.userId === userData.id &&
                        ticket.type === 'account_unlock'
                    );

                    const latestTicket = userTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                    if (latestTicket && (latestTicket.status === 'pending' || latestTicket.status === 'rejected')) {
                        setError(`Your account is locked. Incident ticket ${latestTicket.id} is currently ${latestTicket.status}.`);
                        setExistingTicketStatus(latestTicket);
                        setLockedUser(userData);
                        setIncidentDialogOpen(true);
                        setIsLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error checking incident ticket before login:', error);
                }
            }


            // Check password
            if (userData.password !== password) {
                const currentAttempts = (userData.failedLoginAttempts || 0) + 1;

                if (currentAttempts >= 3) {
                    // Lock the account
                    await updateUserFailedAttempts(userData.id, currentAttempts, true, new Date().toISOString());
                    setError('Account locked due to multiple failed login attempts.');
                    setExistingTicketStatus(null); // No existing ticket yet for a new lockout
                    setLockedUser({ ...userData, failedLoginAttempts: currentAttempts });
                    setIncidentDialogOpen(true);
                } else {
                    // Update failed attempts
                    await updateUserFailedAttempts(userData.id, currentAttempts);
                    setError(`Invalid password. ${3 - currentAttempts} attempts remaining before account lockout.`);
                }
                return;
            }

            // Successful login - reset failed attempts
            if (userData.failedLoginAttempts > 0) {
                await updateUserFailedAttempts(userData.id, 0, false, null);
            }

            sessionStorage.setItem('id', userData.id);
            sessionStorage.setItem('userType', userData.userType); // Store user type
            setIsLoggedIn(true);
            setUserId(userData.id); // Set the userId in the state immediately
            setSuccess('Login successful!');

            // Navigate based on user type
            if (userData.userType === 'admin') {
                navigate(`/admin-dashboard/${userData.id}`);
            } else {
                navigate(`/dashboard/${userData.id}`);
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

    const handlePrivacyPolicyAccept = () => {
        setAcceptPrivacy(true); // Enable the checkbox after accepting
        setPrivacyPolicyDialogOpen(false); // Close the privacy policy dialog
    };

    return (
        <Container maxWidth="md" className="login-container">
            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="login-form">
                <Typography variant="h4" gutterBottom color="white">
                    Login Form
                </Typography>
                {(isLoading || emailLoading || idLoading) && <CircularProgress sx={{ mx: 'auto', mb: 2 }} />}
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'white' }}>Login As</InputLabel>
                    <Select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        label="Login As"
                        sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                    >
                        <MenuItem value="user">Normal User</MenuItem>
                        <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="UserID or Email"
                    margin="normal"
                    required
                    fullWidth
                    name="userIdOrEmail"
                    value={userIdOrEmail}
                    onChange={(e) => setUserIdOrEmail(e.target.value)}
                    error={Boolean(error)}
                    helperText={error === 'Invalid Username/Email/Password' ? 'UserID/Email or password is incorrect.' : ''}
                    sx={{ color: 'white' }}
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
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
                    helperText={error === 'Invalid Username/Email/Password' ? 'UserID/Email or password is incorrect.' : ''}
                    sx={{ color: 'white' }}
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                />
                <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: 'white' }} />}
                    label="Remember me"
                    sx={{ color: 'white' }}
                />

                {/* Privacy Policy Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={acceptPrivacy}
                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                            disabled={!privacyPolicyDialogOpen} // Disable until user accepts the policy
                            sx={{ color: 'white' }}
                        />
                    }
                    label={
                        <span>
                            I have read and agree to the{' '}
                            <MuiLink
                                // href="/privacy-policy"
                                onClick={() => setPrivacyPolicyDialogOpen(true)}
                                underline="true"
                                color="white"
                                sx={{ cursor: 'pointer' }}
                            >
                                Privacy Policy
                            </MuiLink>
                        </span>
                    }
                    sx={{ color: 'white' }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={!acceptPrivacy || isLoading || emailLoading || idLoading} // Disable during SWR loading
                >
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

            {/* Privacy Policy Dialog */}
            <Dialog open={privacyPolicyDialogOpen} onClose={() => setPrivacyPolicyDialogOpen(false)}>
                <DialogTitle>Privacy Policy</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <h3>Privacy Policy for [Bonstay]</h3>
                        <p><strong>Last Updated: [2024]</strong></p>
                        <p>At [Bonstay], we value your privacy and are committed to protecting the personal data that you provide to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services. By using our services, you agree to the practices described in this policy.</p>

                        <h4>1. Information We Collect</h4>
                        <p>We collect the following types of personal information:</p>
                        <ul>
                            <li><strong>Personal Identification Information:</strong> When you book a room, make a reservation, or subscribe to our newsletter, we may collect your name, email address, phone number, address, payment information, and any special requests for your stay.</li>
                            <li><strong>Technical Data:</strong> We collect information about your devices and usage patterns on our website, such as IP address, browser type, location, and pages visited. This information is collected via cookies and similar technologies to improve the user experience.</li>
                        </ul>

                        <h4>2. How We Use Your Information</h4>
                        <ul>
                            <li>Process and manage your hotel reservation or booking.</li>
                            <li>Communicate with you regarding your booking, special offers, and promotions.</li>
                            <li>Improve the quality of our services and customer support.</li>
                            <li>Analyze website usage to enhance the user experience.</li>
                            <li>Comply with legal obligations or resolve disputes.</li>
                        </ul>

                        <h4>3. Data Sharing</h4>
                        <p>We may share your personal data in the following situations:</p>
                        <ul>
                            <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party partners that help us run our business, such as payment processors, marketing services, and customer support tools.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, in response to a legal request, or to protect our rights, property, or safety, or that of others.</li>
                        </ul>

                        <h4>4. Cookies and Tracking Technologies</h4>
                        <p>We use cookies and similar technologies to enhance the user experience on our website...</p>
                        <li>Remember your preferences.</li>
                        <li>Analyze website traffic.</li>
                        <li>Customize the content you see.</li><br />

                        <h4>5. Security of Your Information</h4>
                        <p>We take the security of your personal information seriously. We implement physical, electronic, and procedural safeguards to protect your data from unauthorized access, alteration, or destruction. However, please note that no method of transmission over the internet is completely secure.</p>


                        <h4>6. Data Retention</h4>
                        <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>

                        <h4>7. Your Rights</h4>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal information we hold about you.</li>
                            <li>Correct any inaccurate or incomplete data.</li>
                            <li>Request the deletion of your personal data, subject to certain exceptions.</li>
                            <li>Opt-out of marketing communications by following the unsubscribe instructions in our emails.</li>
                        </ul>

                        <span>To exercise any of these rights, please contact us at [hotel contact information].</span><br /><br />

                        <h4>8. Children’s Privacy</h4>
                        <p>Our services are not intended for children under the age of 13. We do not knowingly collect or maintain personal information from children under 13. If we become aware that we have inadvertently collected information from a child under 13, we will take steps to delete such information.</p>

                        <h4>9. Changes to This Privacy Policy</h4>
                        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the “Last Updated” date will be revised accordingly. We encourage you to review this policy periodically to stay informed about how we are protecting your information.</p>

                        <h4>10. Contact Us</h4>
                        <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                        <ul>
                            <li><strong>Email:</strong> [info@bonstay.com]</li>
                            <li><strong>Phone:</strong> [+91-3485933941]</li>
                            <li><strong>Address:</strong> [SRT-121, Oppo to Cure Hospital, Gachibowli, Hyderabad]</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPrivacyPolicyDialogOpen(false)} color="primary">
                        Close
                    </Button>
                    <Button onClick={handlePrivacyPolicyAccept} variant="contained" color="primary">
                        I Accept
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Account Lockout - Incident Ticket Dialog */}
            <Dialog
                open={incidentDialogOpen}
                onClose={() => {
                    setIncidentDialogOpen(false);
                    setExistingTicketStatus(null); // Clear status when dialog closes
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#f44336', color: 'white' }}>
                    Account Locked - Create Incident Ticket
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Your account has been locked due to multiple failed login attempts.
                    </Alert>
                    <DialogContentText>
                        <strong>Account Details:</strong><br />
                        Name: {lockedUser?.name}<br />
                        Email: {lockedUser?.email}<br />
                        Failed Attempts: {lockedUser?.failedLoginAttempts || 3}<br />
                        Lockout Time: {new Date().toLocaleString()}<br /><br />

                        {existingTicketStatus ? (
                            <>
                                <strong>Existing Incident Ticket:</strong><br />
                                Ticket ID: {existingTicketStatus.id}<br />
                                Status: <span style={{
                                    color: existingTicketStatus.status === 'pending' ? '#ff9800' :
                                        existingTicketStatus.status === 'approved' ? '#4caf50' : '#f44336',
                                    fontWeight: 'bold'
                                }}>
                                    {existingTicketStatus.status.toUpperCase()}
                                </span><br />
                                Created: {new Date(existingTicketStatus.createdAt).toLocaleString()}<br />
                                {existingTicketStatus.adminNotes && (
                                    <>Admin Notes: {existingTicketStatus.adminNotes}<br /></>
                                )}
                                <br />

                                {existingTicketStatus.status === 'pending' && (
                                    "Your ticket is being reviewed by an administrator. Please wait for approval."
                                )}
                                {existingTicketStatus.status === 'rejected' && (
                                    "Your previous ticket was rejected. You can create a new incident ticket below."
                                )}
                                {existingTicketStatus.status === 'approved' && (
                                    "Your ticket was approved. Please try logging in again."
                                )}
                            </>
                        ) : (
                            <>
                                To unlock your account, click "Create Incident Ticket" below.
                                An administrator will review your request and unlock your account if appropriate.
                                You will receive a confirmation message with your incident ticket ID.
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setIncidentDialogOpen(false);
                            setExistingTicketStatus(null);
                        }}
                        color="secondary"
                    >
                        Close
                    </Button>
                    {(!existingTicketStatus || existingTicketStatus.status === 'rejected') && (
                        <Button
                            onClick={handleIncidentTicketSubmit}
                            variant="contained"
                            color="primary"
                        >
                            {existingTicketStatus?.status === 'rejected' ? 'Create New Incident Ticket' : 'Create Incident Ticket'}
                        </Button>
                    )}
                    {existingTicketStatus?.status === 'approved' && (
                        <Button
                            onClick={() => {
                                setIncidentDialogOpen(false);
                                setExistingTicketStatus(null);
                                // Clear the form to allow re-login
                                setError('');
                                setSuccess('Your account has been unlocked. Please try logging in again.');
                            }}
                            variant="contained"
                            color="success"
                        >
                            Try Login Again
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login;
