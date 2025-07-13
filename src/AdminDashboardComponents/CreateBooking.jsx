import { useEffect } from 'react';
import {
    Typography,
    Box,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearFormErrors,
    clearMessage,
    fetchHotels,
    fetchUsers,
} from '../Slices/multiBookingSlice';
import StatusDisplay from '../AdminDashboardComponents/MultiBooking/StatusDisplay'
import AvailableBookingsTable from '../AdminDashboardComponents/MultiBooking/AvailableBookingsTable';
import BookingForm from '../AdminDashboardComponents/MultiBooking/BookingForm';
import FinalizationTable from '../AdminDashboardComponents/MultiBooking/FinalizationTable';


const CreateBooking = () => {
    const dispatch = useDispatch();

    // Redux state
    const { formPart1 } = useSelector((state) => state.multiBooking);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchHotels());

        return () => {
            dispatch(clearMessage());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(clearFormErrors());
    }, [formPart1, dispatch]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Multi-Booking Management System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create multiple hotel bookings efficiently. Fill the form, add to available bookings, select desired bookings, and finalize them.
                </Typography>
            </Box>
            <StatusDisplay />
            <BookingForm />
            <AvailableBookingsTable />
            <FinalizationTable />

        </LocalizationProvider>
    );
};

export default CreateBooking;
