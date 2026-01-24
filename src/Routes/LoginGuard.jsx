import React from 'react';
import { Navigate } from "react-router-dom";

/**
 * LoginGuard Component
 * Prevents logged-in users from accessing login/register pages
 * Redirects them to their appropriate dashboard
 */
const LoginGuard = ({ children, isLoggedIn }) => {
  const storedUserId = sessionStorage.getItem('id');
  const storedUserType = sessionStorage.getItem('userType');

  // If user is logged in (either through app state or session storage)
  if (isLoggedIn || (storedUserId && storedUserType)) {
    // Redirect to appropriate dashboard based on user type
    if (storedUserType === 'admin') {
      return <Navigate to={`/admin-dashboard/${storedUserId}`} replace />;
    } else {
      return <Navigate to={`/dashboard/${storedUserId}`} replace />;
    }
  }

  // If not logged in, render the children (login/register components)
  return children;
};

export default LoginGuard;
