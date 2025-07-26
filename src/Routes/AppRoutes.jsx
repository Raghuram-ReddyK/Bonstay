import { Routes, Route } from "react-router-dom";
import Home from '../Home'
import Login from "../Login";
import RegistrationPage from "../RegistrationPage";
import AdminCodeRequest from '../BonstayAfterLogin/AdminCodeRequest'
import PageNotFound from "../PageNotFound";
import PrivacyPolicy from "../BonstayAfterLogin/PrivacyPolicy";
import TermsAndConditions from "../BonstayAfterLogin/TermsAndConditions";
import PrivateRoute from "./PrivateRoute";

// Import all authenticated components
import DashBoard from "../BonstayAfterLogin/DashBoard";
import AdminDashboard from "../BonstayAfterLogin/AdminDashboard";
import AdminSettingsPage from "../AdminDashboardComponents/AdminSettingsPage";
import BookARoom from "../BonstayAfterLogin/BookARoom";
import Bookings from "../BonstayAfterLogin/Bookings";
import Hotels from "../BonstayAfterLogin/Hotels";
import Review from "../BonstayAfterLogin/Review";
import ViewReviews from "../BonstayAfterLogin/ViewReviews";
import View from "../BonstayAfterLogin/View";
import ReSchedule from "../BonstayAfterLogin/ReSchedule";
import PaymentPage from "../BonstayAfterLogin/PaymentPage";
import LoginGuard from "./LoginGuard";

const AppRoutes = ({ isLoggedIn, userId, setIsLoggedIn, setUserId }) => {
    const handleLogout = () => {
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("userType");
        window.location.href = "/";
    };

    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route
                path="/register"
                element={
                    <LoginGuard isLoggedIn={isLoggedIn}>
                        <RegistrationPage />
                    </LoginGuard>
                }
            />
            <Route
                path="/admin-code-request"
                element={
                    <LoginGuard isLoggedIn={isLoggedIn}>
                        <AdminCodeRequest />
                    </LoginGuard>
                }
            />
            <Route
                path="/login"
                element={
                    <LoginGuard isLoggedIn={isLoggedIn}>
                        <Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
                    </LoginGuard>
                }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />

            {isLoggedIn && (
                <>
                    {/* Dashboard Routes */}
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

                    {/* Admin Dashboard Routes */}
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
                        path="/admin-settings/:id"
                        element={
                            <PrivateRoute
                                element={<AdminSettingsPage />}
                                userId={userId}
                                loggedInUserId={userId}
                                requiredUserType="admin"
                            />
                        }
                    />

                    {/* Booking Routes */}
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
                        path="/bookroom/:id/:hotelName"
                        element={
                            <PrivateRoute
                                element={<BookARoom />}
                                userId={userId}
                                loggedInUserId={userId}
                            />
                        }
                    />

                    {/* Bookings Routes */}
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

                    {/* Hotels Routes */}
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

                    {/* Review Routes */}
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

                    {/* View Routes */}
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

                    {/* Reschedule Route */}
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

                    {/* Payment Route */}
                    <Route path="/payment/:bookingId" element={<PaymentPage />} />
                </>
            )}

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRoutes;
