import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

// Async Thunks
export const fetchHotelReviews = createAsyncThunk(
    'reviews/fetchHotelReviews',
    async (hotelId, { rejectWithValue }) => {
        try {
            const response = await axios.get(getApiUrl(`/hotels/${hotelId}`));
            return {
                reviews: response.data.reviews || [],
                hotel: response.data
            };
        } catch (error) {
            return rejectWithValue('Error fetching reviews.');
        }
    }
);

export const addHotelReview = createAsyncThunk(
    'reviews/addHotelReview',
    async ({ hotelId, reviewData }, { rejectWithValue }) => {
        try {
            // Get the hotel data first
            const response = await axios.get(getApiUrl(`/hotels/${hotelId}`));
            const currentHotel = response.data;

            // Create the enhanced review object
            const newReview = {
                id: `r${Date.now()}`,
                userId: reviewData.userId,
                userName: reviewData.userName,
                userEmail: reviewData.userEmail,
                rating: reviewData.rating,
                comment: reviewData.comment,
                date: new Date().toISOString().split('T')[0],
                helpful: 0,
                roomType: reviewData.roomType || "General",
                verified: true,
                createdAt: new Date().toISOString()
            };

            // Add the new review to existing reviews
            const updatedReviews = [...(currentHotel.reviews || []), newReview];

            // Calculate new average rating and total reviews
            const totalReviews = updatedReviews.length;
            const avgRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

            // Update the hotel with new review data
            const updatedHotel = {
                ...currentHotel,
                reviews: updatedReviews,
                rating: parseFloat(avgRating.toFixed(1)),
                totalReviews: totalReviews
            };

            await axios.put(getApiUrl(`/hotels/${hotelId}`), updatedHotel);

            return {
                reviews: updatedReviews,
                hotel: updatedHotel,
                newReview: newReview
            };
        } catch (error) {
            console.error('Error adding review:', error);
            return rejectWithValue('Error adding review. Please try again.');
        }
    }
);

// Mark review as helpful
export const markReviewHelpful = createAsyncThunk(
    'reviews/markReviewHelpful',
    async ({ hotelId, reviewId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(getApiUrl(`/hotels/${hotelId}`));
            const currentHotel = response.data;

            const updatedReviews = currentHotel.reviews.map(review =>
                review.id === reviewId
                    ? { ...review, helpful: (review.helpful || 0) + 1 }
                    : review
            );

            await axios.patch(getApiUrl(`/hotels/${hotelId}`), {
                reviews: updatedReviews
            });

            return updatedReviews;
        } catch (error) {
            return rejectWithValue('Error updating review.');
        }
    }
);

// Initial state
const initialState = {
    reviews: [],
    hotel: null,
    loading: false,
    error: '',
    successMessage: '',
    submitting: false
};

// Slice
const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.reviews = [];
            state.hotel = null;
            state.error = '';
            state.successMessage = '';
        },
        clearMessages: (state) => {
            state.error = '';
            state.successMessage = '';
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Hotel Reviews
            .addCase(fetchHotelReviews.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchHotelReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.hotel = action.payload.hotel;
            })
            .addCase(fetchHotelReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Hotel Review
            .addCase(addHotelReview.pending, (state) => {
                state.submitting = true;
                state.error = '';
                state.successMessage = '';
            })
            .addCase(addHotelReview.fulfilled, (state, action) => {
                state.submitting = false;
                state.reviews = action.payload.reviews;
                state.hotel = action.payload.hotel;
                state.successMessage = 'Thank you! Your review has been submitted successfully.';
            })
            .addCase(addHotelReview.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })

            // Mark Review Helpful
            .addCase(markReviewHelpful.pending, (state) => {
                // Don't show loading for this action
            })
            .addCase(markReviewHelpful.fulfilled, (state, action) => {
                state.reviews = action.payload;
            })
            .addCase(markReviewHelpful.rejected, (state, action) => {
                // Silently fail for helpful marking
                console.error('Failed to mark review as helpful:', action.payload);
            });
    },
});

export const {
    resetReviewState,
    clearMessages,
    setError,
    setSuccessMessage
} = reviewSlice.actions;

export default reviewSlice.reducer;
