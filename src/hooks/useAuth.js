import { useState, useEffect } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

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

  const handleLogout = (navigate, addNotification) => {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserId(null);
    setUserType(null);
    addNotification("Logged out successfully!");
    // Navigate to home with replace to prevent going back to protected routes
    navigate("/", { replace: true });

    // Optional: Clear history stack to prevent back navigation to protected pages
    // This will replace the entire history with just the home page
    window.history.replaceState(null, null, "/");
  };

  return {
    isLoggedIn,
    userId,
    userType,
    setIsLoggedIn,
    setUserId,
    setUserType,
    handleLogout,
  };
};

export default useAuth;
