// src/components/Review.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addHotelReview } from '../Slices/reviewSlice';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

const Review = () => {
  const { hotelId } = useParams(); // Get the hotelId from the URL
  const [reviewText, setReviewText] = useState(""); // Text for the review
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(""); // To handle error state
  const navigate = useNavigate(); // For navigation after submitting
  const dispatch = useDispatch(); // For dispatching actions

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Dispatch the action to add the review
      dispatch(addHotelReview({ hotelId, review: reviewText }));
      navigate(`/viewReview/${hotelId}`); // After successful submission, navigate to the ViewReviews page
    } catch (err) {
      setError("Failed to submit the review. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add Review for Hotel {hotelId}
      </Typography>

      {/* Display error message if any */}
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Your Review"
        multiline
        rows={4}
        fullWidth
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitReview}
        disabled={loading}
        sx={{ width: '100%' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit Review'}
      </Button>
    </Container>
  );
};

export default Review;
