import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { loginUser, oauthLogin, resetLoginState } from './Slices/registerSlice';
import { useAccountLockout } from './hooks/useAccountLockout';
import BrandingPanel from './BonstayAfterLogin/Login/BrandingPanel';
import LoginForm from './BonstayAfterLogin/Login/LoginForm';
import ForgotPasswordDialog from './BonstayAfterLogin/Login/ForgotPasswordDialog';
import PrivacyPolicyDialog from './BonstayAfterLogin/Login/PrivacyPolicyDialog';
import IncidentTicketDialog from './BonstayAfterLogin/Login/IncidentTicketDialog';
import { auth, googleProvider, signInWithPopup } from './firebase';
import { signOut } from 'firebase/auth';


const Login = ({ setIsLoggedIn, setUserId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, success, error, user } = useSelector((state) => state.user);
    const { createIncidentTicket, checkExistingTickets } = useAccountLockout();
    
    // Reset login state when component mounts to clear any stale state
    useEffect(() => {
        dispatch(resetLoginState());
    }, [dispatch]);

    // Prevent logged-in users from accessing login page
    useEffect(() => {
        const storedUserId = sessionStorage.getItem('id');
        const storedUserType = sessionStorage.getItem('userType');

        if (storedUserId && storedUserType) {
            // User is already logged in, redirect to appropriate dashboard
            if (storedUserType === 'admin') {
                navigate(`/admin-dashboard/${storedUserId}`, { replace: true });
            } else {
                navigate(`/dashboard/${storedUserId}`, { replace: true });
            }
        }
    }, [navigate]);

    // Form states
    const [userIdOrEmail, setUserIdOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('user');
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    // UI states
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Account lockout states
    const [lockedUser, setLockedUser] = useState(null);
    const [existingTicketStatus, setExistingTicketStatus] = useState(null);

    // Dialog states
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [privacyPolicyDialogOpen, setPrivacyPolicyDialogOpen] = useState(false);
    const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);

    // Handle successful login
    useEffect(() => {
        if (success && user) {
            console.log('Login successful, user data:', user);
            
            const userId = user.userId || user.id || user._id;
            const userType = user.userType || user.type;
            
            if (userId) {
                // Check if this login should be allowed (user should be logged out)
                const storedUserId = sessionStorage.getItem('id');
                const storedUserType = sessionStorage.getItem('userType');
                
                if (!storedUserId || !storedUserType) {
                    console.log('Login success: User appears to be properly logged out, proceeding with login');
                    
                    sessionStorage.setItem('id', userId);
                    sessionStorage.setItem('userType', userType);
                    setIsLoggedIn(true);
                    setUserId(userId);
                    setSuccessMessage('Login successful!');

                    // Clear any existing history and prepare for dashboard lock
                    window.history.replaceState(null, null, window.location.pathname);

                    // Navigate based on user type with replace to prevent back navigation
                    if (userType === 'admin') {
                        navigate(`/admin-dashboard/${userId}`, { replace: true });
                    } else {
                        navigate(`/dashboard/${userId}`, { replace: true });
                    }
                } else {
                    console.log('Login success: User appears to already be logged in, ignoring auto-login');
                    // User is already logged in, don't proceed with automatic navigation
                }
            } else {
                console.error('Login response missing user ID:', user);
                setErrorMessage('Login failed: Invalid response from server');
            }
        }
    }, [success, user, navigate, setIsLoggedIn, setUserId]);

    // Handle login errors
    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!acceptPrivacy) {
            setErrorMessage('Please read and accept the privacy policy before logging in.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');

        try {
            await dispatch(loginUser({
                identifier: userIdOrEmail,
                password: password
            }));
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Error while logging in.');
        }
    };

    const handleOAuthLogin = async () => {
        // Check if user should be logged out (no session data)
        const storedUserId = sessionStorage.getItem('id');
        const storedUserType = sessionStorage.getItem('userType');

        if (!storedUserId || !storedUserType) {
            console.log('OAuth login: User appears to be logged out, proceeding with fresh login');

            try {
                // Check if user is already signed in with Firebase and sign out if needed
                const currentUser = auth.currentUser;
                if (currentUser) {
                    await signOut(auth);
                    console.log('OAuth login: Signed out existing Firebase user');
                }

                // Sign in with Google
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                // Get Firebase ID token
                const idToken = await user.getIdToken();

                // Prepare OAuth data for backend with ID token
                const oauthData = {
                    idToken: idToken,
                    provider: 'google'
                };

                // Send to backend for OAuth login
                await dispatch(oauthLogin(oauthData));
            } catch (error) {
                console.error('OAuth login error:', error);
                if (error.code === 'auth/popup-closed-by-user') {
                    setErrorMessage('Login cancelled by user.');
                } else {
                    setErrorMessage('Error during OAuth login. Please try again.');
                }
            }
        } else {
            console.log('OAuth login: User appears to already be logged in, ignoring');
        }
    };

    const handleIncidentTicketSubmit = async () => {
        if (!lockedUser) return;

        try {
            const latestTicket = await checkExistingTickets(lockedUser.id);

            if (latestTicket) {
                if (latestTicket.status === 'pending') {
                    setSuccessMessage(`You already have a pending incident ticket (${latestTicket.id}). Please wait for admin approval.`);
                    setIncidentDialogOpen(false);
                    setLockedUser(null);
                    return;
                } else if (latestTicket.status === 'approved') {
                    setSuccessMessage(`Your previous incident ticket (${latestTicket.id}) was approved. Please try logging in again.`);
                    setIncidentDialogOpen(false);
                    setLockedUser(null);
                    return;
                }
            }

            const incidentId = await createIncidentTicket(lockedUser);
            if (incidentId) {
                setSuccessMessage(`Incident ticket ${incidentId} created successfully. An admin will review your request.`);
            } else {
                setErrorMessage('Failed to create incident ticket. Please try again or contact support.');
            }
        } catch (error) {
            console.error('Error checking existing tickets:', error);
            setErrorMessage('Failed to create incident ticket. Please try again or contact support.');
        }

        setIncidentDialogOpen(false);
        setLockedUser(null);
    };

    const handleTryLoginAgain = () => {
        setIncidentDialogOpen(false);
        setExistingTicketStatus(null);
        setErrorMessage('');
        setSuccessMessage('Your account has been unlocked. Please try logging in again.');
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
                onOAuthLogin={handleOAuthLogin}
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
                isLoading={loading}
                emailLoading={false}
                idLoading={false}
                error={errorMessage}
                success={successMessage}
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
