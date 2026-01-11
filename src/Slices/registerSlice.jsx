import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getBackendApiUrl } from "../config/apiConfig";


export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(getBackendApiUrl('/users/register'), userData);
            return response.data;
        }
        catch (error) {
            // Handle different error formats from the backend
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Registration failed');
            }
            return rejectWithValue('Network error during registration');
        }
    }
);

const initialState = {
    user: null,
    loading: false,
    success: false,
    error: null,
    message: null,
};

const registerSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // if need we can add the reducers, as of now not required
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.user = action.payload.data; // Store the user data from the data field
                state.message = action.payload.message; // Store success message
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload // Store the error message
            });
    },
});

export default registerSlice.reducer;