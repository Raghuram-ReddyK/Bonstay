import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to prevent browser back navigation to login page after authentication
 * This hook should be used in protected/authenticated components
 */
const usePreventBackToLogin = (isLoggedIn) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) return;

    // Function to handle browser back button
    const handlePopState = (event) => {
      const storedUserId = sessionStorage.getItem('id');
      const storedUserType = sessionStorage.getItem('userType');
      
      // If user is logged in and tries to go back to login/register pages
      if (storedUserId && storedUserType) {
        const currentPath = window.location.pathname;
        
        // List of pages that logged-in users shouldn't access
        const restrictedPaths = ['/login', '/register', '/admin-code-request'];
        
        if (restrictedPaths.some(path => currentPath.includes(path))) {
          // Prevent the back navigation and redirect to appropriate dashboard
          event.preventDefault();
          
          if (storedUserType === 'admin') {
            navigate(`/admin-dashboard/${storedUserId}`, { replace: true });
          } else {
            navigate(`/dashboard/${storedUserId}`, { replace: true });
          }
        }
      }
    };

    // Add event listener for popstate (browser back/forward)
    window.addEventListener('popstate', handlePopState);

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoggedIn, navigate, location]);

  // Function to manually clear login/register from history
  const clearAuthPagesFromHistory = () => {
    if (typeof window !== 'undefined' && window.history) {
      // This will replace the current history entry
      const storedUserId = sessionStorage.getItem('id');
      const storedUserType = sessionStorage.getItem('userType');
      
      if (storedUserId && storedUserType) {
        const dashboardPath = storedUserType === 'admin' 
          ? `/admin-dashboard/${storedUserId}` 
          : `/dashboard/${storedUserId}`;
        
        window.history.replaceState(null, null, dashboardPath);
      }
    }
  };

  return { clearAuthPagesFromHistory };
};

export default usePreventBackToLogin;
