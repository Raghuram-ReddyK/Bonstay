import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiUrl } from "../config/apiConfig";

// Async thunk for creating multiple bookings
export const createMultipleBookings = createAsyncThunk(
    'multiBooking/createMultipleBookings',
    async (bookingsData, { rejectWithValue, getState }) => {
        try {
            const results = [];
            const state = getState();
            const { hotels, users } = state.multiBooking;

            // Helper function to generate booking ID
            const generateBookingId = () => {
                const randomDigits = Math.random().toString().slice(2, 10); // 8 random digits
                return `BK${randomDigits}`;
            };

            // Helper function to generate booking reference
            const generateBookingReference = () => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const time = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0');
                const random = Math.random().toString().slice(2, 4);
                return `BNS${year}${month}${day}${time}${random}`;
            };

            // Helper function to calculate financial details
            const calculateBookingFinancials = (booking, hotel, nights) => {
                // Find the room type in hotel data
                const roomType = hotel?.roomTypes?.find(rt =>
                    rt.name === booking.roomType ||
                    rt.id === booking.roomType ||
                    rt.name.toLowerCase().includes(booking.roomType.toLowerCase())
                ) || hotel?.roomTypes?.[0]; // fallback to first room type

                const pricePerNight = roomType?.pricePerNight || 3000; // fallback price
                const totalRoomCost = pricePerNight * nights * booking.rooms;
                const taxRate = 0.18; // 18% tax
                const taxes = Math.round(totalRoomCost * taxRate);
                const totalAmount = totalRoomCost + taxes;

                return {
                    pricePerNight,
                    totalRoomCost,
                    taxes,
                    totalAmount,
                    roomTypeId: roomType?.id || 'standard',
                    roomTypeName: roomType?.name || booking.roomType
                };
            };

            for (const booking of bookingsData) {
                try {
                    // Find hotel and user data
                    const hotel = hotels.find(h => h.id === booking.hotelId);
                    const user = users.find(u => u.id === booking.userId);

                    // Calculate nights - ensure minimum 1 night
                    const checkInDate = new Date(booking.checkIn);
                    const checkOutDate = new Date(booking.checkOut);
                    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

                    // Calculate financial details
                    const financials = calculateBookingFinancials(booking, hotel, nights);

                    // Create complete booking object
                    const completeBooking = {
                        id: generateBookingId(),
                        bookingReference: generateBookingReference(),
                        userId: booking.userId,
                        userName: user?.name || booking.userName || booking.userId,
                        userEmail: user?.email || '',
                        userPhone: user?.phoneNo || '',
                        hotelId: booking.hotelId,
                        hotelName: booking.hotelName,
                        roomTypeId: financials.roomTypeId,
                        roomTypeName: financials.roomTypeName,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                        nights: nights,
                        guests: booking.guests,
                        adults: booking.guests,
                        children: 0,
                        rooms: booking.rooms,
                        pricePerNight: financials.pricePerNight,
                        totalRoomCost: financials.totalRoomCost,
                        taxes: financials.taxes,
                        totalAmount: financials.totalAmount,
                        paymentStatus: 'paid',
                        bookingStatus: 'confirmed',
                        bookingDate: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        specialRequests: '',
                        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
                        createdBy: 'admin',
                        paymentMethod: 'admin_booking',
                        confirmationSent: true,
                        reminderSent: false,
                        // Legacy fields for compatibility
                        status: 'confirmed',
                        noOfPersons: booking.guests,
                        noOfRooms: booking.rooms,
                        typeOfRoom: booking.roomType,
                        startDate: booking.checkIn,
                        endDate: booking.checkOut,
                        tempId: booking.tempId,
                        createdAt: new Date().toISOString()
                    };

                    const response = await axios.post(getApiUrl('/bookings'), completeBooking);
                    results.push({ success: true, data: response.data, booking: completeBooking });
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
            // This catch block handles errors that occur before individual requests are sent (e.g., network issues)
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

    // Selections
    selectedAvailableBookings: [],
    selectedFinalizationBookings: [],

    // Error states
    errors: {
        formPart1: {
            userId: false,
            hotelId: false,
            checkIn: false,
            checkOut: false
        },
        finalization: false
    },

    // API data
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
        // Form Part 1 actions
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

        // Selection management
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

        // Update booking date
        updateBookingDate: (state, action) => {
            const { bookingId, dateType, newDate } = action.payload;

            // Update in available bookings
            const availableBookingIndex = state.availableBookings.findIndex(
                booking => booking.tempId === bookingId
            );
            if (availableBookingIndex !== -1) {
                state.availableBookings[availableBookingIndex][dateType] = newDate;

                // Recalculate duration if both dates are present
                const booking = state.availableBookings[availableBookingIndex];
                if (booking.checkIn && booking.checkOut) {
                    const checkInDate = new Date(booking.checkIn);
                    const checkOutDate = new Date(booking.checkOut);
                    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                    booking.duration = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
                }
            }

            // Update in finalization bookings if exists
            const finalizationBookingIndex = state.selectedForFinalization.findIndex(
                booking => booking.tempId === bookingId
            );
            if (finalizationBookingIndex !== -1) {
                state.selectedForFinalization[finalizationBookingIndex][dateType] = newDate;

                // Recalculate duration if both dates are present
                const booking = state.selectedForFinalization[finalizationBookingIndex];
                if (booking.checkIn && booking.checkOut) {
                    const checkInDate = new Date(booking.checkIn);
                    const checkOutDate = new Date(booking.checkOut);
                    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                    booking.duration = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
                }
            }
        },

        // Reset states
        resetMultiBookingState: (_state) => {
            return initialState;
        },
        clearMessages: (state) => {
            state.success = false;
            state.error = null;
            state.creationResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading.users = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading.users = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading.users = false;
                state.error = action.payload;
            })

            // Fetch Hotels
            .addCase(fetchHotels.pending, (state) => {
                state.loading.hotels = true;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading.hotels = false;
                state.hotels = action.payload;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading.hotels = false;
                state.error = action.payload;
            })

            // Create Multiple Bookings
            .addCase(createMultipleBookings.pending, (state) => {
                state.loading.creating = true;
                state.error = null;
            })
            .addCase(createMultipleBookings.fulfilled, (state, action) => {
                state.loading.creating = false;
                state.success = true;
                state.creationResults = action.payload;

                // Remove successfully created bookings from finalization table
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
    updateBookingDate,
    resetMultiBookingsState,
    clearMessages
} = multiBookingSlice.actions;

export default multiBookingSlice.reducer;
