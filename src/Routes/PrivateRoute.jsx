import { Navigate } from "react-router-dom";

// Private Route Component to protect user-specific routes
const PrivateRoute = ({ element, userId, loggedInUserId, requiredUserType = null }) => {
    const userType = sessionStorage.getItem('userType');

    if (!loggedInUserId) {
        return <Navigate to="/login" replace />; // Redirect to login if not logged in
    }

    // If user type is required and doesn't match, redirect to appropriate dashboard
    if (requiredUserType && userType !== requiredUserType) {
        if (userType === 'admin') {
            return <Navigate to={`/admin-dashboard/${loggedInUserId}`} replace />;
        } else {
            return <Navigate to={`/dashboard/${loggedInUserId}`} replace />;
        }
    }

    // If user is logged in but the route is for a different user, redirect to login
    if (userId && userId !== loggedInUserId) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;
