import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to prevent browser back navigation from dashboard
 * This keeps users on the dashboard after login and prevents unwanted navigation
 */
const useDashboardProtection = (isLoggedIn, userId, userType) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current dashboard path based on user type
  const getDashboardPath = useCallback(() => {
    const storedUserId = sessionStorage.getItem('id');
    const storedUserType = sessionStorage.getItem('userType');
    
    const currentUserId = userId || storedUserId;
    const currentUserType = userType || storedUserType;
    
    if (currentUserType === 'admin') {
      return `/admin-dashboard/${currentUserId}`;
    } else {
      return `/dashboard/${currentUserId}`;
    }
  }, [userId, userType]);

  // Function to check if current page is a dashboard
  const isDashboardPage = useCallback(() => {
    const currentPath = location.pathname;
    return currentPath.includes('/dashboard') || currentPath.includes('/admin-dashboard');
  }, [location.pathname]);

  // Function to replace history with dashboard
  const lockToDashboard = useCallback(() => {
    const dashboardPath = getDashboardPath();
    
    // Replace current history entry with dashboard
    window.history.replaceState(
      { locked: true, dashboard: true }, 
      'Dashboard', 
      dashboardPath
    );
    
    // Push dashboard again to create a barrier
    window.history.pushState(
      { locked: true, dashboard: true }, 
      'Dashboard', 
      dashboardPath
    );
  }, [getDashboardPath]);

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!isLoggedIn) return;

    const handlePopState = (event) => {
      const storedUserId = sessionStorage.getItem('id');
      const storedUserType = sessionStorage.getItem('userType');
      
      // Only proceed if user is logged in
      if (!storedUserId || !storedUserType) return;

      const dashboardPath = getDashboardPath();
      const currentPath = window.location.pathname;
      
      // If user tries to navigate away from dashboard area, redirect back
      if (isDashboardPage() || currentPath === '/') {
        // Prevent navigation away from dashboard
        event.preventDefault();
        
        // Force navigation back to dashboard
        navigate(dashboardPath, { replace: true });
        
        // Re-lock the history
        setTimeout(lockToDashboard, 100);
      }
    };

    // Add event listener for popstate (browser back/forward)
    window.addEventListener('popstate', handlePopState);

    // Initial lock when component mounts (if on dashboard)
    if (isDashboardPage()) {
      setTimeout(lockToDashboard, 100);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoggedIn, navigate, getDashboardPath, isDashboardPage, lockToDashboard]);

  // Function to manually lock user to dashboard (call after login)
  const initializeDashboardLock = useCallback(() => {
    const dashboardPath = getDashboardPath();
    
    // Clear any existing history
    window.history.replaceState(null, null, dashboardPath);
    
    // Add dashboard lock
    setTimeout(lockToDashboard, 200);
  }, [getDashboardPath, lockToDashboard]);

  // Override browser navigation buttons with dashboard redirect
  useEffect(() => {
    if (!isLoggedIn || !isDashboardPage()) return;

    const preventNavigation = (event) => {
      // Disable F5, Ctrl+R (refresh)
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        return false;
      }
      
      // Disable Backspace navigation (when not in input fields)
      if (event.key === 'Backspace' && 
          !['INPUT', 'TEXTAREA'].includes(event.target.tagName) &&
          !event.target.isContentEditable) {
        event.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventNavigation);

    return () => {
      document.removeEventListener('keydown', preventNavigation);
    };
  }, [isLoggedIn, isDashboardPage]);

  return {
    initializeDashboardLock,
    lockToDashboard,
    isDashboardPage
  };
};

export default useDashboardProtection;
