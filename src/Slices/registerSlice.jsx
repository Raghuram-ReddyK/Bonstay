import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            // check if the email already exists in the fake JSON server
            const response = await axios.get(`http://localhost:4000/users`);
            const existingUser = response.data.find(user => user.email === userData.email);

            if (existingUser) {
                // Reject the registration if email already exists
                return rejectWithValue('Email is already registered');
            }
            // If email is unique, proceed with registration (POST request)
            const registerResponse = await axios.post(`http://localhost:4000/users`, userData);
            return registerResponse.data; // registered user's data
        }
        catch (error) {
            return rejectWithValue(' Error during registration')
        }
    }
);

const initialState = {
    user: null,
    loading: false,
    success: false,
    error: null,
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
                state.success = true;
                state.user = action.payload; // Store the registered user data
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload // Store the error msg (e.g email is already registered)
            });
    },
});

export default registerSlice.reducer;