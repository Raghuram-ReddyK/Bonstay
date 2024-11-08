
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: new Date(),
  endDate: new Date(),
  noOfPersons: 1,
  noOfRooms: 1,
  typeOfRoom: '',
  errorMessage: '',
  successMessage: '',
  error: '',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setNoOfPersons: (state, action) => {
      state.noOfPersons = action.payload;
    },
    setNoOfRooms: (state, action) => {
      state.noOfRooms = action.payload;
    },
    setTypeOfRoom: (state, action) => {
      state.typeOfRoom = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetBookingState: (state) => {
      state = { ...initialState };
    }
  },
});

export const {
  setStartDate,
  setEndDate,
  setNoOfPersons,
  setNoOfRooms,
  setTypeOfRoom,
  setErrorMessage,
  setSuccessMessage,
  setError,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
