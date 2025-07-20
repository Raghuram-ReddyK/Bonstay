import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useUser, useUserByEmail } from './hooks/useSWRData';
import { useAccountLockout } from './hooks/useAccountLockout';
import BrandingPanel from './BonstayAfterLogin/Login/BrandingPanel';
import LoginForm from './BonstayAfterLogin/Login/LoginForm';
import ForgotPasswordDialog from './BonstayAfterLogin/Login/ForgotPasswordDialog';
import PrivacyPolicyDialog from './BonstayAfterLogin/Login/PrivacyPolicyDialog';
import IncidentTicketDialog from './BonstayAfterLogin/Login/IncidentTicketDialog';


const Login = ({ setIsLoggedIn, setUserId }) => {
    const navigate = useNavigate();
    const { updateUserFailedAttempts, createIncidentTicket, checkExistingTickets } = useAccountLockout();

    // Form states
    const [userIdOrEmail, setUserIdOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('user');
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    // UI states
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [privacyPolicyDialogOpen, setPrivacyPolicyDialogOpen] = useState(false);
    const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);

    // Account lockout states
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

            // Get user data from SWR
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
                const latestTicket = await checkExistingTickets(userData.id);
                setExistingTicketStatus(latestTicket);
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

            // Handle failed login attempts for non-admin users
            if (userData.userType !== 'admin' && userData.failedLoginAttempts >= 3) {
                const latestTicket = await checkExistingTickets(userData.id);

                if (!latestTicket || latestTicket.status !== 'approved') {
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

                if (latestTicket.status === 'approved' && userData.isLocked) {
                    await updateUserFailedAttempts(userData.id, 0, false, null);
                    userData = { ...userData, isLocked: false, failedLoginAttempts: 0 };
                }
            }

            // Check password
            if (userData.password !== password) {
                const currentAttempts = (userData.failedLoginAttempts || 0) + 1;

                if (currentAttempts >= 3) {
                    await updateUserFailedAttempts(userData.id, currentAttempts, true, new Date().toISOString());
                    setError('Account locked due to multiple failed login attempts.');
                    setExistingTicketStatus(null);
                    setLockedUser({ ...userData, failedLoginAttempts: currentAttempts });
                    setIncidentDialogOpen(true);
                } else {
                    await updateUserFailedAttempts(userData.id, currentAttempts);
                    setError(`Invalid password. ${3 - currentAttempts} attempts remaining before account lockout.`);
                }
                return;
            }

            // Successful login
            if (userData.failedLoginAttempts > 0) {
                await updateUserFailedAttempts(userData.id, 0, false, null);
            }

            sessionStorage.setItem('id', userData.id);
            sessionStorage.setItem('userType', userData.userType);
            setIsLoggedIn(true);
            setUserId(userData.id);
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

    const handleIncidentTicketSubmit = async () => {
        if (!lockedUser) return;

        try {
            const latestTicket = await checkExistingTickets(lockedUser.id);

            if (latestTicket) {
                if (latestTicket.status === 'pending') {
                    setSuccess(`You already have a pending incident ticket (${latestTicket.id}). Please wait for admin approval.`);
                    setIncidentDialogOpen(false);
                    setLockedUser(null);
                    return;
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
        } catch (error) {
            console.error('Error checking existing tickets:', error);
            setError('Failed to create incident ticket. Please try again or contact support.');
        }

        setIncidentDialogOpen(false);
        setLockedUser(null);
    };

    const handleTryLoginAgain = () => {
        setIncidentDialogOpen(false);
        setExistingTicketStatus(null);
        setError('');
        setSuccess('Your account has been unlocked. Please try logging in again.');
    };

    const handlePrivacyPolicyAccept = () => {
        setAcceptPrivacy(true);
        setPrivacyPolicyDialogOpen(false);
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <BrandingPanel />

            <LoginForm
                onSubmit={handleSubmit}
                userType={userType}
                setUserType={setUserType}
                userIdOrEmail={userIdOrEmail}
                setUserIdOrEmail={setUserIdOrEmail}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                acceptPrivacy={acceptPrivacy}
                setAcceptPrivacy={setAcceptPrivacy}
                onOpenPrivacyPolicy={() => setPrivacyPolicyDialogOpen(true)}
                onOpenForgotPassword={() => setForgotPasswordOpen(true)}
                isLoading={isLoading}
                emailLoading={emailLoading}
                idLoading={idLoading}
                error={error}
                success={success}
            />

            <ForgotPasswordDialog
                open={forgotPasswordOpen}
                onClose={() => setForgotPasswordOpen(false)}
            />

            <PrivacyPolicyDialog
                open={privacyPolicyDialogOpen}
                onClose={() => setPrivacyPolicyDialogOpen(false)}
                onAccept={handlePrivacyPolicyAccept}
            />

            <IncidentTicketDialog
                open={incidentDialogOpen}
                onClose={() => setIncidentDialogOpen(false)}
                lockedUser={lockedUser}
                existingTicketStatus={existingTicketStatus}
                onCreateTicket={handleIncidentTicketSubmit}
                onTryLoginAgain={handleTryLoginAgain}
            />
        </Grid>
    );
};

export default Login;
