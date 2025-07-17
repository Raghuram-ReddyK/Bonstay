import "./App.css";
import AccountMenu from "./BonstayAfterLogin/AccountMenu";
import BookARoom from "./BonstayAfterLogin/BookARoom";
import Bookings from "./BonstayAfterLogin/Bookings";
import DashBoard from "./BonstayAfterLogin/DashBoard";
import Hotels from "./BonstayAfterLogin/Hotels";
import ReSchedule from "./BonstayAfterLogin/ReSchedule";
import Review from "./BonstayAfterLogin/Review";
import View from "./BonstayAfterLogin/View";
import ViewReviews from "./BonstayAfterLogin/ViewReviews";
import Home from "./Home";
import Login from "./Login";
import PageNotFound from "./PageNotFound";
import RegistrationPage from "./RegistrationPage";
import ThemeToggle from "./Themes/ThemeToggle";
import {
  blueTheme,
  blackTheme,
  greenTheme,
  lightTheme,
  yellowTheme,
} from "./Themes/Theme";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Box,
  FormControlLabel,
  IconButton,
  Badge,
  ThemeProvider,
} from "@mui/material";
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react"; // Import useCallback to memoize showPageNotification
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsDialog from "./NotificationsDialog"; // Import the new NotificationsDialog component
import PrivacyPolicy from "./BonstayAfterLogin/PrivacyPolicy";
import Footer from "./Footer";
import TermsAndConditions from "./BonstayAfterLogin/TermsAndConditions";
import PaymentPage from "./BonstayAfterLogin/PaymentPage";
import AdminDashboard from "./BonstayAfterLogin/AdminDashboard";
import AdminCodeRequest from "./BonstayAfterLogin/AdminCodeRequest";
import AdminSettingsPage from "./AdminDashboardComponents/AdminSettingsPage";
import { SWRConfig } from "swr";

// Private Route Component to protect user-specific routes
const PrivateRoute = ({ element, userId, loggedInUserId, requiredUserType = null }) => {
  const userType = sessionStorage.getItem('userType');
  if (!loggedInUserId) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }
  if (requiredUserType && userType !== requiredUserType) {
    if (userType === "admin") {
      return <Navigate to={`/admin-dashboard/${loggedInUserId}`} replace />;
    }
    else {
      return <Navigate to={`/dashboard/${loggedInUserId}`} replace />
    }
  }
  // If user is logged in but the route is for a different user, redirect to login
  if (userId && userId !== loggedInUserId) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const App = () => {
  const colorScheme = useSelector((state) => state.theme.colorScheme);

  const appliedTheme = (() => {
    switch (colorScheme) {
      case "blue":
        return blueTheme;
      case "red":
        return yellowTheme;
      case "green":
        return greenTheme;
      case "light":
        return lightTheme;
      case "dark":
        return blackTheme;
      default:
        return blackTheme; // Default to blackTheme
    }
  })();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [notifications, setNotifications] = useState([]); // Store multiple notifications
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Track unread notifications count
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state for displaying notifications

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in by checking sessionStorage
    const storedUserId = sessionStorage.getItem("id");
    const storedUserType = sessionStorage.getItem("userType");
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserType(storedUserType);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("userType")
    setIsLoggedIn(false);
    setUserId(null);
    setUserType(null)
    addNotification("Logged out successfully!");
    navigate("/");
  };

  // Function to show page-specific notifications
  const showPageNotification = useCallback(() => {
    // Memoize with useCallback
    let newMessage = "";
    switch (location.pathname) {
      case "/hotels":
      case `/hotels/${userId}`:
        newMessage = "Hotels retrieved successfully!";
        break;
      case "/bookings":
      case `/bookings/${userId}`:
        newMessage = "Bookings retrieved successfully!";
        break;
      case "/bookroom":
      case `/bookroom/${userId}`:
        newMessage = "Booking information loaded!";
        break;
      case "/dashboard":
      case `/dashboard/${userId}`:
        newMessage = "Dashboard information loaded!";
        break;
      case "/admin-dashboard":
      case `/admin-dashboard/${userId}`:
        newMessage = "Admin Dashboard loaded!";
        break;
      case "/view":
      case `/view/${userId}`:
        newMessage = "View information loaded!";
        break;
      default:
        break;
    }
    if (newMessage) {
      addNotification(newMessage);
    }
  }, [location.pathname, userId]); // Add location.pathname and userId as dependencies

  // Add a new notification to the list
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(), // unique id based on timestamp
      message,
      read: false,
    };
    setNotifications((prev) => [...prev, newNotification]);
    setUnreadNotifications((prev) => prev + 1); // Increment unread count
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadNotifications((prev) => prev - 1); // Decrease unread count
  };

  // Remove a notification from the list
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setUnreadNotifications((prev) => prev - 1); // Decrease unread count
  };

  // Remove all notifications
  const removeAllNotifications = () => {
    setNotifications([]); // Clear all notifications
    setUnreadNotifications(0); // Reset unread count
  };

  // Toggle the notification dialog open/close
  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  // Trigger notification when route changes
  useEffect(() => {
    showPageNotification();
  }, [showPageNotification]); // Add showPageNotification to the dependency array

  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      <ThemeProvider theme={appliedTheme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Bonstay Hotel
              </Typography>
              {isLoggedIn ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* Left side: Navigation buttons */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel control={<ThemeToggle />} />
                    <Button
                      color="inherit"
                      component={NavLink}
                      to={userType === 'admin' ? `/admin-dashboard/${userId}` : `/dashboard/${userId}`}
                    >
                      Dashboard
                    </Button>
                    {userType !== 'admin' && (
                      <>
                        <Button
                          color="inherit"
                          component={NavLink}
                          to={`/hotels/${userId}`}
                        >
                          Hotels
                        </Button>
                        <Button
                          color="inherit"
                          component={NavLink}
                          to={`/bookings/${userId}`}
                        >
                          Bookings
                        </Button>
                        <Button
                          color="inherit"
                          component={NavLink}
                          to={`/view/${userId}`}
                        >
                          View
                        </Button>
                      </>
                    )}
                  </Box>
                  {/* Right side: Theme Toggle, Notification Icon, Account Menu */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="inherit" onClick={toggleDialog}>
                      <Badge badgeContent={unreadNotifications} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <AccountMenu handleLogout={handleLogout} />
                  </Box>
                  {/* Display User ID next to the Account Menu */}
                  {isLoggedIn && (
                    <Typography variant="body2" sx={{ marginRight: 2 }}>
                      {`${userId.toUpperCase()}`}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel control={<ThemeToggle />} />
                  <Button color="inherit" component={NavLink} to="/">
                    Home
                  </Button>
                  <Button color="inherit" component={NavLink} to="/Login">
                    Login
                  </Button>
                  <Button color="inherit" component={NavLink} to="/Register">
                    Register
                  </Button>
                </Box>
              )}
            </Toolbar>
          </AppBar>

          {/* Notification Dialog Component */}
          <NotificationsDialog
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            dialogOpen={dialogOpen}
            toggleDialog={toggleDialog}
            markAsRead={markAsRead}
            removeNotification={removeNotification}
            removeAllNotifications={removeAllNotifications}
          />

          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/admin-code-request" element={<AdminCodeRequest />} />
            <Route
              path="/login"
              element={
                <Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />

            {isLoggedIn && (
              <>
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute
                      element={<DashBoard />}
                      userId={userId}
                      loggedInUserId={userId}
                      requiredUserType="user"
                    />
                  }
                />
                <Route
                  path="/dashboard/:id"
                  element={
                    <PrivateRoute
                      element={<DashBoard />}
                      userId={userId}
                      loggedInUserId={userId}
                      requiredUserType="user"
                    />
                  }
                />
                <Route
                  path="/admin-dashboard/:id"
                  element={
                    <PrivateRoute
                      element={<AdminDashboard />}
                      userId={userId}
                      loggedInUserId={userId}
                      requiredUserType="admin"
                    />
                  }
                />
                <Route
                  path="/admin-settings/:id"
                  element={
                    <PrivateRoute
                      element={<AdminSettingsPage />}
                      userId={userId}
                      loggedInUserId={userId}
                      requiredUserType='admin'
                    />
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <PrivateRoute
                      element={<AdminDashboard />}
                      userId={userId}
                      loggedInUserId={userId}
                      requiredUserType="admin"
                    />
                  }
                />
                <Route
                  path="/bookroom"
                  element={
                    <PrivateRoute
                      element={<BookARoom />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/bookroom/:id"
                  element={
                    <PrivateRoute
                      element={<BookARoom />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <PrivateRoute
                      element={<Bookings userId={userId} />}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/bookings/:id"
                  element={
                    <PrivateRoute
                      element={<Bookings userId={userId} />}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/bookroom/:id/:hotelName"
                  element={
                    <PrivateRoute
                      element={<BookARoom />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/hotels"
                  element={
                    <PrivateRoute
                      element={<Hotels />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/hotels/:id"
                  element={
                    <PrivateRoute
                      element={<Hotels />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/hotels/:id/:hotelName"
                  element={
                    <PrivateRoute
                      element={<Hotels />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/review"
                  element={
                    <PrivateRoute
                      element={<Review />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/review/:hotelId"
                  element={
                    <PrivateRoute
                      element={<Review />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/viewReview/:hotelId"
                  element={
                    <PrivateRoute
                      element={<ViewReviews />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/view"
                  element={
                    <PrivateRoute
                      element={<View />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/view"
                  element={
                    <PrivateRoute
                      element={<View handleLogout={handleLogout} />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/view/:id"
                  element={
                    <PrivateRoute
                      element={<View handleLogout={handleLogout} userId={userId} />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/reschedule/:id"
                  element={
                    <PrivateRoute
                      element={<ReSchedule />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <PrivateRoute
                      element={<Bookings />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route
                  path="/bookings/:id"
                  element={
                    <PrivateRoute
                      element={<Bookings />}
                      userId={userId}
                      loggedInUserId={userId}
                    />
                  }
                />
                <Route path="/payment/:bookingId" element={<PaymentPage />} />
              </>
            )}

            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Box>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default App;
