

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

// Async Thunks
export const fetchHotelReviews = createAsyncThunk(
    'reviews/fetchHotelReviews',
    async (hotelId, { rejectWithValue }) => {
        try {
            const response = await axios.get(getApiUrl(`/hotels/${hotelId}`));
            return response.data.reviews || []; // Ensure reviews is always an array
        } catch (error) {
            return rejectWithValue('Error fetching reviews.');
        }
    }
);

export const addHotelReview = createAsyncThunk(
    'reviews/addHotelReview',
    async ({ hotelId, review }, { rejectWithValue }) => {
        try {
            // Get the hotel data first
            const response = await axios.get(getApiUrl(`/hotels/${hotelId}`));
            const updatedReviews = [...response.data.reviews, review];

            // Now update the reviews on the backend
            await axios.put(getApiUrl(`/hotels/${hotelId}`), {
                ...response.data,
                reviews: updatedReviews,
            });

            return updatedReviews; // Return the updated reviews for state update
        } catch (error) {
            return rejectWithValue('Error adding review.');
        }
    }
);

// Initial state
const initialState = {
    reviews: [],
    loading: false,
    error: '',
    successMessage: '',
};

// Slice
const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.reviews = [];
            state.error = '';
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotelReviews.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchHotelReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchHotelReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addHotelReview.pending, (state) => {
                state.error = '';
                state.successMessage = '';
            })
            .addCase(addHotelReview.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.successMessage = 'Review added successfully!';
            })
            .addCase(addHotelReview.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { resetReviewState } = reviewSlice.actions;

export default reviewSlice.reducer;
