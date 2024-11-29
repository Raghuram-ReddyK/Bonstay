import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Box, Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const PaymentPage = () => {
  const { bookingId } = useParams(); // Get the booking ID from the URL
  const [paymentStatus, setPaymentStatus] = useState(null); // State to track payment status
  const [loading, setLoading] = useState(false); // To manage loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate payment processing with 1 rupee after a 5-second delay
    const simulatePayment = () => {
      setLoading(true);

      // Introduce a 5-second delay before processing the payment
      setTimeout(() => {
        // Simulate a request to a mock payment endpoint (could be your JSON Server here)
        axios
          .post("http://localhost:4000/payments", {
            bookingId,
            amount: 1, // 1 Rupee
            method: "Google Pay", // Simulate Google Pay (you can mock PhonePe, Credit/Debit Card as well)
          })
          .then((response) => {
            // If the payment is successful, update the status
            setPaymentStatus("success");
            setLoading(false);
          })
          .catch((error) => {
            // If there's an error, set the status to 'error'
            setPaymentStatus("error");
            setLoading(false);
          });
      }, 5000); // 5000ms (5 seconds) delay
    };

    simulatePayment(); // Trigger the payment process after the delay
  }, [bookingId]); // This will run when the bookingId changes

  const handlePaymentSuccess = () => {
    // After payment is successful, navigate to the booking confirmation page
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      {loading ? (
        // Show a loading spinner while the payment is being processed
        <CircularProgress />
      ) : paymentStatus === "success" ? (
        <>
          <Typography variant="h4">Payment Successful</Typography>
          <Typography variant="body1">Your booking ID is: {bookingId}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePaymentSuccess}
            sx={{ mt: 2 }}
          >
            Go to Booking Confirmation
          </Button>
        </>
      ) : paymentStatus === "error" ? (
        <>
          <Typography variant="h4" color="error">
            Payment Failed
          </Typography>
          <Typography variant="body1">
            Something went wrong with your payment. Please try again.
          </Typography>
        </>
      ) : (
        // If payment is still being processed, show a status message
        <Alert severity="info">Processing payment of 1 Rupee...</Alert>
      )}
    </Box>
  );
};

export default PaymentPage;

