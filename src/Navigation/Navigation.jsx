import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, FormControlLabel, IconButton, Badge } from "@mui/material";
import { NavLink } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "../BonstayAfterLogin/AccountMenu";
import ThemeToggle from "../Themes/ThemeToggle";

const Navigation = ({
    isLoggedIn,
    userId,
    userType,
    unreadNotifications,
    toggleDialog,
    handleLogout
}) => {
    return (
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
                            <Button
                                color="inherit"
                                component={NavLink}
                                to={userType === 'admin' ? `/admin-dashboard/${userId}` : `/dashboard/${userId}`}
                                sx={{
                                    '&.active': {
                                        borderBottom: '2px solid white',
                                        borderRadius: 0,
                                        paddingBottom: '6px'
                                    }
                                }}

                            >
                                Dashboard
                            </Button>
                            {userType !== 'admin' && (
                                <>
                                    <Button
                                        color="inherit"
                                        component={NavLink}
                                        to={`/hotels/${userId}`}
                                        sx={{
                                            '&.active': {
                                                borderBottom: '2px solid white',
                                                borderRadius: 0,
                                                paddingBottom: '6px'
                                            }
                                        }}

                                    >
                                        Hotels
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={NavLink}
                                        to={`/bookings/${userId}`}
                                        sx={{
                                            '&.active': {
                                                borderBottom: '2px solid white',
                                                borderRadius: 0,
                                                paddingBottom: '6px'
                                            }
                                        }}

                                    >
                                        Bookings
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={NavLink}
                                        to={`/view/${userId}`}
                                        sx={{
                                            '&.active': {
                                                borderBottom: '2px solid white',
                                                borderRadius: 0,
                                                paddingBottom: '6px'
                                            }
                                        }}

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
                        <Button color="inherit" component={NavLink} to="/admin-code-request">
                            Request Admin Code
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;
