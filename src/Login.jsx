import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { loginUser, oauthLogin, resetLoginState } from "./Slices/registerSlice";
import { useAccountLockout } from "./hooks/useAccountLockout";
import BrandingPanel from "./BonstayAfterLogin/Login/BrandingPanel";
import LoginForm from "./BonstayAfterLogin/Login/LoginForm";
import ForgotPasswordDialog from "./BonstayAfterLogin/Login/ForgotPasswordDialog";
import PrivacyPolicyDialog from "./BonstayAfterLogin/Login/PrivacyPolicyDialog";
import IncidentTicketDialog from "./BonstayAfterLogin/Login/IncidentTicketDialog";
import { auth, googleProvider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";

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
    const storedUserId = sessionStorage.getItem("id");
    const storedUserType = sessionStorage.getItem("userType");

    if (storedUserId && storedUserType) {
      // User is already logged in, redirect to appropriate dashboard
      if (storedUserType === "admin") {
        navigate(`/admin-dashboard/${storedUserId}`, { replace: true });
      } else {
        navigate(`/dashboard/${storedUserId}`, { replace: true });
      }
    }
  }, [navigate]);

  // Form states
  const [userIdOrEmail, setUserIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // UI states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      // Handle nested data structure from API response
      const userData = user.data || user;
      const userId = userData.userId || userData.id || userData._id;
      const userType = userData.userType || userData.type;

      if (userId) {
        // Check if this login should be allowed (user should be logged out)
        const storedUserId = sessionStorage.getItem("id");
        const storedUserType = sessionStorage.getItem("userType");

        if (!storedUserId || !storedUserType) {

          // For OAuth login, try to get user info from Firebase if backend doesn't provide it
          let userName =
            userData.name || userData.fullName || userData.displayName;
          let userEmail = userData.email || userData.emailAddress;

          // If this is OAuth login and we don't have name/email from backend, get from Firebase
          if ((!userName || !userEmail) && auth.currentUser) {
            const firebaseUser = auth.currentUser;
            userName =
              userName ||
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              "User";
            userEmail = userEmail || firebaseUser.email || "";
          }

          sessionStorage.setItem("id", userId);
          sessionStorage.setItem("userType", userType);
          sessionStorage.setItem("name", userName || "User");
          sessionStorage.setItem("email", userEmail || "");

          setIsLoggedIn(true);
          setUserId(userId);
          setSuccessMessage("Login successful!");

          // Clear any existing history and prepare for dashboard lock
          window.history.replaceState(null, null, window.location.pathname);

          // Navigate based on user type with replace to prevent back navigation
          if (userType === "admin") {
            navigate(`/admin-dashboard/${userId}`, { replace: true });
          } else {
            navigate(`/dashboard/${userId}`, { replace: true });
          }
        } else {
          // User is already logged in, don't proceed with automatic navigation
        }
      } else {
        console.error("Login response missing user ID:", user);
        setErrorMessage("Login failed: Invalid response from server");
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
      setErrorMessage(
        "Please read and accept the privacy policy before logging in.",
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await dispatch(
        loginUser({
          identifier: userIdOrEmail,
          password: password,
        }),
      );
    } catch (error) {
      setErrorMessage("Error while logging in.");
    }
  };

  const handleOAuthLogin = async () => {
    // Check if user should be logged out (no session data)
    const storedUserId = sessionStorage.getItem("id");
    const storedUserType = sessionStorage.getItem("userType");

    if (!storedUserId || !storedUserType) {

      try {
        // Check if user is already signed in with Firebase and sign out if needed
        const currentUser = auth.currentUser;
        if (currentUser) {
          await signOut(auth);
        }

        // Sign in with Google
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Get Firebase ID token
        const idToken = await user.getIdToken();

        // Prepare OAuth data for backend with ID token
        const oauthData = {
          idToken: idToken,
          provider: "google",
        };

        // Send to backend for OAuth login
        await dispatch(oauthLogin(oauthData));
      } catch (error) {
        if (error.code === "auth/popup-closed-by-user") {
          setErrorMessage("Login cancelled by user.");
        } else {
          setErrorMessage("Error during OAuth login. Please try again.");
        }
      }
    } else {
    }
  };

  const handleIncidentTicketSubmit = async () => {
    if (!lockedUser) return;

    try {
      const latestTicket = await checkExistingTickets(lockedUser.id);

      if (latestTicket) {
        if (latestTicket.status === "pending") {
          setSuccessMessage(
            `You already have a pending incident ticket (${latestTicket.id}). Please wait for admin approval.`,
          );
          setIncidentDialogOpen(false);
          setLockedUser(null);
          return;
        } else if (latestTicket.status === "approved") {
          setSuccessMessage(
            `Your previous incident ticket (${latestTicket.id}) was approved. Please try logging in again.`,
          );
          setIncidentDialogOpen(false);
          setLockedUser(null);
          return;
        }
      }

      const incidentId = await createIncidentTicket(lockedUser);
      if (incidentId) {
        setSuccessMessage(
          `Incident ticket ${incidentId} created successfully. An admin will review your request.`,
        );
      } else {
        setErrorMessage(
          "Failed to create incident ticket. Please try again or contact support.",
        );
      }
    } catch (error) {
      setErrorMessage(
        "Failed to create incident ticket. Please try again or contact support.",
      );
    }

    setIncidentDialogOpen(false);
    setLockedUser(null);
  };

  const handleTryLoginAgain = () => {
    setIncidentDialogOpen(false);
    setExistingTicketStatus(null);
    setErrorMessage("");
    setSuccessMessage(
      "Your account has been unlocked. Please try logging in again.",
    );
  };

  const handlePrivacyPolicyAccept = () => {
    setAcceptPrivacy(true);
    setPrivacyPolicyDialogOpen(false);
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
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
