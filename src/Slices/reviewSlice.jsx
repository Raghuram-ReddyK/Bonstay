import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getBackendApiUrl } from '../config/apiConfig';

// Async Thunks
export const fetchHotelReviews = createAsyncThunk(
    'reviews/fetchHotelReviews',
    async (hotelId, { rejectWithValue }) => {
        try {
            const response = await axios.get(getBackendApiUrl(`/hotels/${hotelId}`));
            // API returns data in response.data.data structure
            const hotelData = response.data.data || response.data;
            return {
                reviews: hotelData.reviews || [],
                hotel: hotelData
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
            const response = await axios.post(getBackendApiUrl(`/hotels/${hotelId}/reviews`), reviewData);
            
            if (response.data.success) {
                // Refetch the hotel data to get updated reviews and ratings
                const hotelResponse = await axios.get(getBackendApiUrl(`/hotels/${hotelId}`));
                const hotelData = hotelResponse.data.data || hotelResponse.data;
                return {
                    reviews: hotelData.reviews || [],
                    hotel: hotelData,
                    newReview: response.data.data
                };
            } else {
                return rejectWithValue('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            return rejectWithValue(error.response?.data?.message || 'Error adding review. Please try again.');
        }
    }
);

// Mark review as helpful
export const markReviewHelpful = createAsyncThunk(
    'reviews/markReviewHelpful',
    async ({ hotelId, reviewId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(getBackendApiUrl(`/hotels/${hotelId}`));
            const hotelData = response.data.data || response.data;

            const updatedReviews = hotelData.reviews.map(review =>
                review.id === reviewId
                    ? { ...review, helpful: (review.helpful || 0) + 1 }
                    : review
            );

            await axios.patch(getBackendApiUrl(`/hotels/${hotelId}`), {
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
