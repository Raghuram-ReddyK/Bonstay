import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "../config/apiConfig";

// Async thunk for creating multiple bookings
export const createMultipleBookings = createAsyncThunk(
    'multiBooking/createMultipleBookings',
    async (bookingsData, { rejectWithValue }) => {
        try {
            const results = [];

            for (const booking of bookingsData) {
                try {
                    const response = await axios.post(getApiUrl('/bookings', booking));
                    results.push({ success: true, data: response.data, booking });
                } catch (error) {
                    results.push({
                        success: false,
                        error: error.response?.data || error.message,
                        booking
                    });
                }
            }
            return results;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
    'multiBooking/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(getApiUrl('/users'));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk for fetching hotels
export const fetchHotels = createAsyncThunk(
    'multiBooking/fetchHotels',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(getApiUrl('/hotels'));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    formPart1: {
        userId: '',
        userName: '',
        hotelId: '',
        hotelName: '',
        checkIn: '',
        checkOut: '',
    },
    formPart2: {
        guests: 1,
        rooms: 1,
        roomType: 'Standard'
    },

    // Table Data
    availableBookings: [],
    selectedForFinalization: [],

    //selections
    selectedAvailableBookings: [],
    selectedFinalizationBookings: [],

    // Error states
    errors: {
        formPart1: {
            userId: false,
            hotelId: false,
            checkIn: false,
            checkOut: false,
        },
        finalization: false
    },

    // Api Data
    users: [],
    hotels: [],

    // Loading states
    loading: {
        users: false,
        hotels: false,
        creating: false,
    },

    // Success/Error states
    success: false,
    error: null,

    // Creation results
    creationResults: []
};

const multiBookingSlice = createSlice({
    name: 'multiBooking',
    initialState,
    reducers: {
        // Forms Part 1 actions
        setFormPart1: (state, action) => {
            state.formPart1 = { ...state.formPart1, ...action.payload };
        },
        setFormPart2: (state, action) => {
            state.formPart2 = { ...state.formPart2, ...action.payload };
        },
        clearForm: (state) => {
            state.formPart1 = initialState.formPart1;
            state.formPart2 = initialState.formPart2;
        },

        // Error management
        setErrors: (state, action) => {
            state.errors = { ...state.errors, ...action.payload };
        },
        clearErrors: (state) => {
            state.errors = initialState.errors;
        },
        clearFormErrors: (state) => {
            state.errors.formPart1 = initialState.errors.formPart1;
        },
        clearFinalizationError: (state) => {
            state.errors.finalization = false;
        },

        // Available bookings management
        addAvailableBooking: (state, action) => {
            state.availableBookings.push(action.payload);
        },
        removeAvailableBookings: (state, action) => {
            const idsToRemove = action.payload;
            state.availableBookings = state.availableBookings.filter(
                booking => !idsToRemove.includes(booking.tempId)
            );
        },

        // Finalization bookings management
        addFinalizationBookings: (state, action) => {
            state.selectedForFinalization.push(...action.payload);
        },
        removeFinalizationBookings: (state, action) => {
            const idsToRemove = action.payload;
            state.selectedForFinalization = state.selectedForFinalization.filter(
                booking => !idsToRemove.includes(booking.tempId)
            );
        },

        // selection management
        setSelectedAvailableBookings: (state, action) => {
            state.selectedAvailableBookings = action.payload;
        },
        setSelectedFinalizationBookings: (state, action) => {
            state.selectedFinalizationBookings = action.payload;
            // Clear finalization error when bookings are selected
            if (action.payload.length > 0) {
                state.errors.finalization = false;
            }
        },
        clearSelection: (state) => {
            state.selectedAvailableBookings = [];
            state.selectedFinalizationBookings = [];
        },

        // Move bookings between tables
        moveToFinalization: (state) => {
            if (state.selectedAvailableBookings.length === 0) return;

            const bookingsToMove = state.availableBookings.filter(booking =>
                state.selectedAvailableBookings.includes(booking.tempId)
            );

            state.selectedForFinalization.push(...bookingsToMove);
            state.availableBookings = state.availableBookings.filter(booking =>
                !state.selectedAvailableBookings.includes(booking.tempId)
            );
            state.selectedAvailableBookings = [];
        },

        moveBackToAvailable: (state) => {
            if (state.selectedFinalizationBookings.length === 0) return;

            const bookingsToMove = state.selectedForFinalization.filter(booking =>
                state.selectedFinalizationBookings.includes(booking.tempId)
            );

            state.availableBookings.push(...bookingsToMove);
            state.selectedForFinalization = state.selectedForFinalization.filter(booking =>
                !state.selectedFinalizationBookings.includes(booking.tempId)
            );
            state.selectedFinalizationBookings = [];
        },

        // Reset states
        resetMultiBookingsState: (state) => {
            return initialState;
        },
        clearMessage: (state) => {
            state.success = false;
            state.error = null;
            state.creationResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // fetcher users
            .addCase(fetchUsers.pending, (state) => {
                state.loading.users = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading.users = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading.users = false;
                state.users = action.payload;
            })

            // fetcher hotels
            .addCase(fetchHotels.pending, (state) => {
                state.loading.hotels = true;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading.hotels = false;
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading.hotels = false;
                state.hotels = action.payload;
            })

            // create multiple bookings
            .addCase(createMultipleBookings.pending, (state) => {
                state.loading.creating = true;
                state.error = null;
            })
            .addCase(createMultipleBookings.fulfilled, (state, action) => {
                state.loading.creating = false;
                state.success = true;
                state.creationResults = action.payload;

                // Remove successfully create bookings from finalization table
                const successfulBookingIds = action.payload
                    .filter(result => result.success)
                    .map(result => result.booking.tempId);

                state.selectedForFinalization = state.selectedForFinalization.filter(
                    booking => !successfulBookingIds.includes(booking.tempId)
                );
                state.selectedFinalizationBookings = [];
            })
            .addCase(createMultipleBookings.rejected, (state, action) => {
                state.loading.creating = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFormPart1,
    setFormPart2,
    clearForm,
    setErrors,
    clearErrors,
    clearFormErrors,
    clearFinalizationError,
    addAvailableBooking,
    removeAvailableBookings,
    addFinalizationBookings,
    removeFinalizationBookings,
    setSelectedAvailableBookings,
    setSelectedFinalizationBookings,
    clearSelection,
    moveToFinalization,
    moveBackToAvailable,
    resetMultiBookingsState,
    clearMessage
} = multiBookingSlice.actions;

export default multiBookingSlice.reducer;