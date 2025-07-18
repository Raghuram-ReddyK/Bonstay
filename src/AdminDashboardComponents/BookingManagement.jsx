import { useState } from 'react';
import { 
    Chip, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Typography, 
    Alert,
    Box
} from '@mui/material'; 
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios'; 
import CustomDataGrid from '../CommonComponents/CustomDataGrid';
import { getApiUrl } from '../config/apiConfig';

/**
 * BookingManagement Component
 * This component provides an interface for administrators to view and manage all hotel bookings.
 * It displays bookings in a data grid, allows for cancellation of bookings, and provides
 * confirmation dialogs and feedback messages for these actions.
 * @param {Object} props - Component props
 * @param {Array} props.allBookings - An array of all booking objects to display.
 * @param {boolean} props.isLoading - A boolean indicating if booking data is currently loading.
 * @param {function} props.getHotelName - A helper function to get the hotel name from a booking object.
 * @param {function} props.getRoomsCount - A helper function to get the number of rooms from a booking object.
 * @param {function} [props.onBookingCancelled] - Optional callback function to be called after a booking is successfully cancelled.
 */
const BookingManagement = ({ allBookings, isLoading, getHotelName, getRoomsCount, onBookingCancelled }) => {
    const [cancelDialog, setCancelDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    /**
     * Opens the booking cancellation confirmation dialog.
     * Sets the selected booking, clears previous success/error messages, and opens the dialog.
     * @param {Object} booking - The booking object to be cancelled.
     */
    const openCancelDialog = (booking) => {
        setSelectedBooking(booking); 
        setCancelDialog(true);       
        setCancelSuccess('');        
        setCancelError('');     
    };

    /**
     * Closes the booking cancellation confirmation dialog.
     * Clears the selected booking and closes the dialog.
     */
    const closeCancelDialog = () => {
        setCancelDialog(false);       // Close the dialog
        setSelectedBooking(null);     // Clear the selected booking
    };

    /**
     * Handles the actual cancellation of a booking by an admin.
     * Makes an API call to delete the booking, updates state with success/error messages,
     * and calls the `onBookingCancelled` callback if provided to refresh data in the parent component.
     */
    const handleAdminCancelBooking = async () => {
        // If no booking is selected, do nothing.
        if (!selectedBooking) return;

        setCancelling(true); // Set cancelling state to true to disable buttons
        try {
            // Make an API call to delete the booking using its ID.
            await axios.delete(getApiUrl(`/bookings/${selectedBooking.id}`));
            setCancelSuccess(`Booking ${selectedBooking.id} cancelled successfully by admin!`); // Set success message
            setCancelDialog(false); // Close the confirmation dialog
            setSelectedBooking(null); // Clear the selected booking

            // If an `onBookingCancelled` callback is provided, call it to trigger data refresh in the parent.
            if (onBookingCancelled) {
                onBookingCancelled();
            }
        } catch (error) {
            console.error('Error cancelling booking:', error); // Log the error to console
            setCancelError('Failed to cancel booking. Please try again.'); // Set error message for display
        } finally {
            setCancelling(false); // Reset cancelling state to false regardless of success or failure
        }
    };

    const columns = [
        { 
            field: 'id', 
            headerName: 'Booking ID', 
            width: 130,
            sortable: true 
        },
        { 
            field: 'userId', 
            headerName: 'User ID', 
            width: 120,
            sortable: true 
        },
        { 
            field: 'hotelName', 
            headerName: 'Hotel', 
            width: 200,
            sortable: true,
            // valueGetter uses the `getHotelName` prop to display the correct hotel name.
            valueGetter: ({ row }) => getHotelName(row)
        },
        { 
            field: 'checkIn', 
            headerName: 'Check In', 
            width: 130,
            sortable: true,
            // valueGetter for display: formats ISO date strings to local date.
            valueGetter: ({ row }) => {
                const dateValue = row.checkIn || row.startDate; // Prioritize checkIn, then startDate
                if (!dateValue) return 'N/A';
                
                try {
                    // Check if it's an ISO string (contains 'T' for time part) and format it.
                    if (typeof dateValue === 'string' && dateValue.includes('T')) {
                        return new Date(dateValue).toLocaleDateString();
                    }
                    return dateValue; // Return as is if not an ISO string or already formatted
                } catch (error) {
                    return dateValue; // Fallback in case of parsing error
                }
            },
            // sortValueGetter for sorting: uses the raw date value for accurate sorting.
            sortValueGetter: ({ row }) => {
                const dateValue = row.checkIn || row.startDate;
                return dateValue || ''; // Return empty string if no date for consistent sorting
            }
        },
        { 
            field: 'checkOut', 
            headerName: 'Check Out', 
            width: 130,
            sortable: true,
            // valueGetter for display: formats ISO date strings to local date.
            valueGetter: ({ row }) => {
                const dateValue = row.checkOut || row.endDate;
                if (!dateValue) return 'N/A';
                
                try {
                    if (typeof dateValue === 'string' && dateValue.includes('T')) {
                        return new Date(dateValue).toLocaleDateString();
                    }
                    return dateValue; 
                } catch (error) {
                    return dateValue; // Fallback in case of parsing error
                }
            },
            // sortValueGetter for sorting: uses the raw date value for accurate sorting.
            sortValueGetter: ({ row }) => {
                const dateValue = row.checkOut || row.endDate;
                return dateValue || ''; // Return empty string if no date for consistent sorting
            }
        },
        { 
            field: 'guests', 
            headerName: 'Guests', 
            width: 100,
            sortable: true,
            // valueGetter: uses `guests` or `noOfPersons`, defaults to 1.
            valueGetter: ({ row }) => row.guests || row.noOfPersons || 1,
            // sortValueGetter: ensures numerical sorting.
            sortValueGetter: ({ row }) => Number(row.guests || row.noOfPersons || 1)
        },
        { 
            field: 'rooms', 
            headerName: 'Rooms', 
            width: 100,
            sortable: true,
            // valueGetter: uses the `getRoomsCount` prop.
            valueGetter: ({ row }) => getRoomsCount(row),
            // sortValueGetter: ensures numerical sorting.
            sortValueGetter: ({ row }) => Number(getRoomsCount(row))
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            sortable: true,
            // renderCell: displays status as a Material-UI Chip with dynamic color.
            renderCell: ({ row }) => (
                <Chip
                    label={row.status || 'confirmed'} 
                    color={row.status === 'confirmed' ? 'success' : 'default'} 
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            sortable: false, 
            renderCell: ({ row }) => (
                <Button
                    variant="outlined"
                    color="error" 
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => openCancelDialog(row)}
                    sx={{ 
                        minWidth: 100, // Minimum width for the button
                        fontSize: '0.75rem' // Smaller font size for compactness
                    }}
                >
                    Cancel
                </Button>
            )
        }
    ];

    return (
        <Box>
            {/* Success/Error Messages */}
            {cancelSuccess && ( // Display success alert if `cancelSuccess` state is not empty
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setCancelSuccess('')}>
                    {cancelSuccess}
                </Alert>
            )}
            {cancelError && ( // Display error alert if `cancelError` state is not empty
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setCancelError('')}>
                    {cancelError}
                </Alert>
            )}

            {/* Custom Data Grid for displaying bookings */}
            <CustomDataGrid
                rows={allBookings} 
                columns={columns} 
                pageSize={5} 
                pageSizeOptions={[5, 10, 25]} 
                loading={isLoading}
                title="Booking Management" 
                subtitle="View and manage all hotel bookings. Admins can cancel any booking. Sort by any column and use pagination to navigate through bookings."
            />

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialog} onClose={closeCancelDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" color="error">
                        Cancel Booking Confirmation
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to cancel this booking?
                    </Typography>
                    {selectedBooking && ( // Display details of the selected booking if available
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2"><strong>Booking ID:</strong> {selectedBooking.id}</Typography>
                            <Typography variant="body2"><strong>User ID:</strong> {selectedBooking.userId}</Typography>
                            <Typography variant="body2"><strong>Hotel:</strong> {getHotelName(selectedBooking)}</Typography>
                            <Typography variant="body2">
                                <strong>Check-in:</strong> {
                                    selectedBooking.checkIn || selectedBooking.startDate 
                                        ? new Date(selectedBooking.checkIn || selectedBooking.startDate).toLocaleDateString()
                                        : 'N/A'
                                }
                            </Typography>
                            <Typography variant="body2">
                                <strong>Check-out:</strong> {
                                    selectedBooking.checkOut || selectedBooking.endDate 
                                        ? new Date(selectedBooking.checkOut || selectedBooking.endDate).toLocaleDateString()
                                        : 'N/A'
                                }
                            </Typography>
                        </Box>
                    )}
                    {/* Warning message about irreversible action */}
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Warning:</strong> This action cannot be undone. The booking will be permanently removed from the system.
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    {/* "No" button to close the dialog without cancelling */}
                    <Button onClick={closeCancelDialog} color="primary">
                        No, Keep Booking
                    </Button>
                    {/* "Yes" button to confirm cancellation */}
                    <Button
                        onClick={handleAdminCancelBooking}
                        color="error"
                        variant="contained"
                        disabled={cancelling} // Disable button while cancellation is in progress
                    >
                        {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'} {/* Dynamic button text */}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookingManagement;
