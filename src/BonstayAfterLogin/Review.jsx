// src/components/Review.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addHotelReview, fetchHotelReviews, clearMessages } from '../Slices/reviewSlice';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Box,
  Rating,
  Chip,
  Grid,
  Avatar
} from '@mui/material';
import {
  Star,
  Person,
  LocationOn,
  Phone
} from '@mui/icons-material';

const Review = () => {
  const { hotelId } = useParams();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const {
    hotel,
    loading,
    submitting,
    error,
    successMessage
  } = useSelector((state) => state.reviews);

  // Get user info from session
  const userId = sessionStorage.getItem('id');
  const userName = sessionStorage.getItem('name') || 'Anonymous User';
  const userEmail = sessionStorage.getItem('email') || '';

  // Fetch hotel details on component mount
  useEffect(() => {
    if (hotelId) {
      dispatch(fetchHotelReviews(hotelId));
    }
  }, [hotelId, dispatch]);

  // Clear messages when component unmounts or hotelId changes
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch, hotelId]);

  // Navigate to reviews after successful submission
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate(`/viewReview/${hotelId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, hotelId]);

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      dispatch(clearMessages());
      // We'll use a simple alert for validation since we're using Redux for async errors
      alert("Please write a review.");
      return;
    }

    if (rating === 0) {
      dispatch(clearMessages());
      alert("Please select a rating.");
      return;
    }

    // Clear any previous messages
    dispatch(clearMessages());

    // Prepare review data
    const reviewData = {
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      rating: rating,
      comment: reviewText,
      roomType: "General" // Could be enhanced to ask which room type they stayed in
    };

    // Dispatch the addHotelReview action
    dispatch(addHotelReview({ hotelId, reviewData }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!hotel) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Hotel not found. Please try again.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Hotel Info Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom color="primary">
                {hotel.hotelName}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                <LocationOn color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {hotel.city}, {hotel.state}
                </Typography>
                <Chip label={hotel.category} size="small" color="primary" variant="outlined" />
              </Box>
              {hotel.rating && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">
                    {hotel.rating} ({hotel.totalReviews || 0} reviews)
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">{hotel.phoneNo}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Share Your Experience
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Help other travelers by writing an honest review about your stay.
          </Typography>

          {/* User Info */}
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{userName}</Typography>
              <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
            </Box>
          </Box>

          {/* Messages */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Rating *
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{ fontSize: '2rem' }}
              />
              <Typography variant="body1" color="text.secondary">
                {rating > 0 ? (
                  rating === 5 ? 'Excellent!' :
                    rating === 4 ? 'Very Good' :
                      rating === 3 ? 'Good' :
                        rating === 2 ? 'Fair' :
                          'Poor'
                ) : 'Select a rating'}
              </Typography>
            </Box>
          </Box>

          {/* Review Text */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Write Your Review *
            </Typography>
            <TextField
              label="Tell us about your experience..."
              multiline
              rows={6}
              fullWidth
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              variant="outlined"
              placeholder="What did you like most? What could be improved? Share details about the room, service, amenities, location, etc."
              helperText={`${reviewText.length}/500 characters`}
              inputProps={{ maxLength: 500 }}
            />
          </Box>

          {/* Submit Button */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate(`/viewReview/${hotelId}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReview}
              disabled={submitting || !reviewText.trim() || rating === 0}
              startIcon={submitting ? <CircularProgress size={20} /> : <Star />}
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Review;