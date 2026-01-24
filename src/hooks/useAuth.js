import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { resetLoginState } from "../Slices/registerSlice";

const useAuth = () => {
  const dispatch = useDispatch();
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

  const handleLogout = async (navigate, addNotification) => {
    console.log('handleLogout: Starting logout process');

    try {
      // Sign out from Firebase
      await signOut(auth);
      console.log('handleLogout: Firebase sign out successful');
    } catch (error) {
      console.error('handleLogout: Firebase sign out error:', error);
    }

    // Clear session storage
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    console.log('handleLogout: Session storage cleared');

    // Reset Redux login state
    dispatch(resetLoginState());
    console.log('handleLogout: Redux state reset');

    console.log('handleLogout: Updating React state');
    setIsLoggedIn(false);
    setUserId(null);
    setUserType(null);

    // Small delay to ensure state updates propagate before navigation
    setTimeout(() => {
      console.log('handleLogout: About to navigate to /login');
      addNotification("Logged out successfully!");
      navigate("/login", { replace: true });
      console.log('handleLogout: Navigation completed');
    }, 100);
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
