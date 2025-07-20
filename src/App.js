import "./App.css";
import { Box, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SWRConfig } from 'swr';
import NotificationsDialog from "./NotificationsDialog";
import Footer from "./Footer";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import useNotifications from "./hooks/useNotifications";
import AppRoutes from "./Routes/AppRoutes";
import Navigation from "./Navigation/Navigation";

const App = () => {
  const appliedTheme = useTheme();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    userId,
    userType,
    setIsLoggedIn,
    setUserId,
    handleLogout: authHandleLogout,
  } = useAuth();

  const {
    notifications,
    unreadNotifications,
    dialogOpen,
    addNotification,
    markAsRead,
    removeNotification,
    removeAllNotifications,
    toggleDialog,
  } = useNotifications(userId);

  // Enhanced logout handler with notifications
  const handleLogout = () => {
    authHandleLogout(navigate, addNotification);
  };

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'hidden'
          }}
        >
          <Navigation
            isLoggedIn={isLoggedIn}
            userId={userId}
            userType={userType}
            unreadNotifications={unreadNotifications}
            toggleDialog={toggleDialog}
            handleLogout={handleLogout}
          />

          <NotificationsDialog
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            dialogOpen={dialogOpen}
            toggleDialog={toggleDialog}
            markAsRead={markAsRead}
            removeNotification={removeNotification}
            removeAllNotifications={removeAllNotifications}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              minHeight: 0
            }}
          >
            <AppRoutes
              isLoggedIn={isLoggedIn}
              userId={userId}
              setIsLoggedIn={setIsLoggedIn}
              setUserId={setUserId}
            />
          </Box>

          <Footer />
        </Box>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default App;
