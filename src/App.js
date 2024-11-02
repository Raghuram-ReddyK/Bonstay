import './App.css';
import AccountMenu from './BonstayAfterLogin/AccountMenu';
import BookARoom from './BonstayAfterLogin/BookARoom';
import Bookings from './BonstayAfterLogin/Bookings';
import DashBoard from './BonstayAfterLogin/DashBoard';
import Hotels from './BonstayAfterLogin/Hotels';
import ReSchedule from './BonstayAfterLogin/ReSchedule';
import Review from './BonstayAfterLogin/Review';
import View from './BonstayAfterLogin/View';
import ViewReviews from './BonstayAfterLogin/ViewReviews';
import Home from './Home';
import Login from './Login';
import PageNotFound from './PageNotFound';
import RegistrationPage from './RegistrationPage';
import ThemeToggle from './Themes/ThemeToggle';
import { darkTheme, lightTheme } from './Themes/Theme'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, FormControlLabel, ThemeProvider } from '@mui/material';
// import Hierarchy from './AgGrid/Hierarchy';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// import  GridExample  from './AgGrid/GridExample';


const App = () => {

  const themeMode = useSelector((state) => state.theme.mode);
  const appliedTheme = themeMode === 'light' ? lightTheme : darkTheme;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in on initial render
    const storedUserId = sessionStorage.getItem('id');
    // console.log(storedUserId);

    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('id');
    setIsLoggedIn(false);
    setUserId(null);
    navigate('/');
  };

  return (
    <ThemeProvider theme={appliedTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Bonstay Hotel
            </Typography>
            {isLoggedIn ? (
              <div>
                <FormControlLabel control={<ThemeToggle />} />
                <Button color="inherit" component={NavLink} to={`/dashboard/${userId}`}>Dashboard</Button>
                <Button color="inherit" component={NavLink} to={`/hotels/${userId}`}>Hotels</Button>
                <Button color="inherit" component={NavLink} to={`/bookings/${userId}`}>Bookings</Button>
                <Button color="inherit" component={NavLink} to={`/view/${userId}`}>View</Button>
                <AccountMenu handleLogout={handleLogout} />
              </div>

            ) : (
              <div>
                <FormControlLabel control={<ThemeToggle />} />
                <Button color="inherit" component={NavLink} to="/">Home</Button>
                <Button color="inherit" component={NavLink} to="/login">Login</Button>
                <Button color="inherit" component={NavLink} to="/register">Register</Button>
                {/* <Button color="inherit" component={NavLink} to="/AgGrid">Grid</Button> */}
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} navigate={navigate} />} />
          {/* <Route path='/AgGrid' element={<Hierarchy />} /> */}

          {isLoggedIn && (
            <>
              <Route path='/dashboard' element={<DashBoard />} />
              <Route path='/dashboard/:id' element={<DashBoard />} />
              <Route path="/bookroom" element={<BookARoom />} />
              <Route path="/bookroom/:id" element={<BookARoom />} />
              <Route path="/hotels/:id/bookroom/:id" element={<BookARoom />} />
              {/* <Route path="/details/:id" element={<ViewCustomer />} /> */}
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<Hotels />} />
              <Route path="/review" element={<Review />} />
              {/* <Route path="/hotelDet" element={<GetHotel />} /> */}
              <Route path="/view" element={<View />} />
              <Route path="/view/:id" element={<View />} />
              <Route path="/reschedule/:id" element={<ReSchedule />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id" element={<Bookings />} />
              {/* <Route path="/getallusers" element={<GetAllUsers />} /> */}
              <Route path="/viewReview/" element={<ViewReviews />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          )}
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;