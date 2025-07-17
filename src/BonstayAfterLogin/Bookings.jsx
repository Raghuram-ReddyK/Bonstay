import { Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Link as MuiLink, CircularProgress, Alert } from '@mui/material'; // Importing Material-UI components for UI elements
import axios from 'axios'; // Importing Axios for making HTTP requests
import React, { useState } from 'react'; // Importing React and useState hook for component state
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for programmatic navigation
import * as XLSX from 'xlsx'; // Importing xlsx library for Excel file generation
import { saveAs } from 'file-saver'; // Importing file-saver for saving files
import { getApiUrl } from '../config/apiConfig'; // Importing a utility to get the base API URL
import { useUserBookings, useHotels } from '../hooks/useSWRData'; // Importing custom SWR hooks for data fetching

/**
 * Bookings Component
 * This component displays a user's hotel bookings, allows them to reschedule or cancel bookings,
 * and provides options to export booking data to Excel or print the list.
 * It uses SWR hooks for efficient data fetching and caching.
 * @param {Object} props - Component props
 * @param {string} props.userId - The ID of the user whose bookings are to be displayed.
 */
const Bookings = ({ userId }) => { // Destructure userId prop here
    // useState hooks for managing component-specific state
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');     
    const [dialogOpen, setDialogOpen] = useState(false);  
    const [selectedBookingId, setSelectedBookingId] = useState(null); 
    const navigate = useNavigate(); 

    // Use SWR hooks for data fetching:
    // useUserBookings fetches bookings specific to the provided userId.
    // useHotels fetches all hotel data, which is needed to map hotel IDs to names.
    const { data: bookings, error: bookingsError, isLoading: bookingsLoading, mutate: mutateBookings } = useUserBookings(userId);
    const { data: hotels, error: hotelsError, isLoading: hotelsLoading } = useHotels();

    // React.useMemo to create a map of hotel IDs to hotel names.
    // This memoized value prevents re-calculation on every render unless 'hotels' data changes.
    // It's crucial to define this before any early returns to ensure it's always available if data is loaded.
    const hotelMap = React.useMemo(() => {
        if (!hotels) return {}; // Return empty map if hotels data is not yet available
        const map = {};
        hotels.forEach((hotel) => {
            // console.log(`Mapping hotel ID: ${hotel.id} => Hotel Name: ${hotel.hotelName}`); // Debugging log
            map[String(hotel.id)] = hotel.hotelName; // Populate map, ensuring hotel ID is treated as a string for consistent keys
        });
        return map;
    }, [hotels]); // Dependency array: Recalculate `hotelMap` only when `hotels` data changes

    // Conditional rendering for loading state:
    // Display a circular progress indicator and a loading message while data is being fetched.
    if (bookingsLoading || hotelsLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading bookings...</Typography>
            </Container>
        );
    }

    // Conditional rendering for error state:
    // Display an alert with an error message if there was an issue fetching data.
    if (bookingsError || hotelsError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    Error loading data: {bookingsError?.message || hotelsError?.message} {/* Display specific error message */}
                </Alert>
            </Container>
        );
    }

    // Log the number of bookings found for the current user (for debugging/info)
    console.log(`Found ${bookings?.length || 0} bookings for user ${userId}`);

    /**
     * Handles the cancellation of a booking.
     * Makes an API call to delete the booking and then refreshes the booking list.
     * @param {string} bookingId - The ID of the booking to cancel.
     */
    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(getApiUrl(`/bookings/${bookingId}`)); // API call to delete the booking
            mutateBookings(); // Trigger SWR to re-fetch and update the bookings list
            setCancelSuccess(`Booking cancelled successfully! with ${bookingId}`); // Set success message
            setDialogOpen(false); // Close the confirmation dialog
        } catch (error) {
            setCancelError('Error canceling booking. Please try again later.'); // Set error message
        }
    };

    /**
     * Opens the confirmation dialog for booking cancellation.
     * Stores the ID of the booking to be canceled.
     * @param {string} bookingId - The ID of the booking to be canceled.
     */
    const openConfirmationDialog = (bookingId) => {
        setSelectedBookingId(bookingId); // Store the booking ID
        setDialogOpen(true); // Open the dialog
    };

    /**
     * Closes the confirmation dialog and clears the selected booking ID.
     */
    const closeConfirmationDialog = () => {
        setDialogOpen(false); // Close the dialog
        setSelectedBookingId(null); // Clear the selected booking ID
    };

    /**
     * Handles exporting the current user's bookings to an Excel file.
     * It transforms the booking data into a format suitable for Excel and then saves the file.
     */
    const handleExportExcel = () => {
        // Map booking data to a flat structure suitable for Excel, using hotelMap for hotel names
        const data = bookings.map((booking) => ({
            'Booking ID': booking.id,
            'Hotel Name': hotelMap[String(booking.hotelId)] || 'Unknown Hotel', // Get hotel name from map, fallback if not found
            'Check-In Date': booking.checkIn || booking.startDate, // Use checkIn or startDate
            'Check-Out Date': booking.checkOut || booking.endDate,   // Use checkOut or endDate
            'Number of Persons': booking.guests || booking.noOfPersons, // Use guests or noOfPersons
            'Number of Rooms': booking.noOfRooms,
            'Type of Room': booking.roomType || booking.typeOfRoom, // Use roomType or typeOfRoom
        }));

        const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to a worksheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Bookings'); // Append the worksheet to the workbook with a sheet name

        // Generate and save the Excel file
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelFile], { type: 'application/octet-stream' }), 'bookings.xlsx'); // Save the file using file-saver
    };

    /**
     * Handles printing the current page content.
     * It opens a new window, writes the content of the 'printable-bookings' div, and triggers the print dialog.
     */
    const handlePrint = () => {
        const printContent = document.getElementById('printable-bookings'); // Get the element to be printed
        const printWindow = window.open('', '', 'height=600,width=800'); // Open a new blank window
        printWindow.document.write(printContent.innerHTML); // Write the inner HTML of the printable area to the new window
        printWindow.document.close(); // Close the document stream
        printWindow.print(); // Trigger the print dialog
    };

    return (
        <Container className="text-center"> {/* Main container for the bookings page */}
            <Typography variant="h3" color="blue">
                --- Bookings --- {/* Page title */}
            </Typography>
            {/* Display success or error alerts */}
            {cancelSuccess && <div className="alert alert-success">{cancelSuccess}</div>}
            {cancelError && <div className="alert alert-danger">{cancelError}</div>}

            {/* Export and Print buttons */}
            <Button variant="outlined" color="primary" onClick={handleExportExcel} sx={{ m: 2 }}>
                Export to Excel
            </Button>
            <Button variant="outlined" color="secondary" onClick={handlePrint} sx={{ m: 2 }}>
                Print Bookings
            </Button>

            {/* Conditional rendering based on whether bookings are found */}
            {bookings.length > 0 ? (
                // Display bookings in a grid layout if bookings exist
                <div id="printable-bookings" className="row row-cols-1 row-cols-md-2 g-4"> {/* ID for printing functionality */}
                    {bookings.map((booking) => {
                        return (
                            <div key={booking.id} className="col"> {/* Unique key for each booking card */}
                                <div className="card h-100 shadow-sm"> {/* Card styling */}
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {hotelMap[String(booking.hotelId)] || 'Unknown Hotel'} {/* Display hotel name from map */}
                                        </h5>
                                        <p><b>Booking Id:</b> {booking.id}</p>
                                        <p><b>Check-In Date:</b> {booking.checkIn || booking.startDate}</p>
                                        <p><b>Check-Out Date:</b> {booking.checkOut || booking.endDate}</p>
                                        <p><b>Number of Persons:</b> {booking.guests || booking.noOfPersons}</p>
                                        <p><b>Number of Rooms:</b> {booking.noOfRooms}</p>
                                        <p><b>Type of Room:</b> {booking.roomType || booking.typeOfRoom}</p>
                                    </div>
                                    <div className="card-footer">
                                        {/* Reschedule Button */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigate(`/reschedule/${booking.id}`)} // Navigate to reschedule page
                                        >
                                            Reschedule Booking
                                        </Button>
                                        {/* Cancel Button - opens confirmation dialog */}
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => openConfirmationDialog(booking.id)} // Open dialog with current booking ID
                                        >
                                            Cancel Booking
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Display message if no bookings are found
                <Typography variant="h4" color="red">
                    No bookings found. Please try to book the hotels....
                    <MuiLink href="/hotels" underline="true"> {/* Link to hotels page */}
                        Click here
                    </MuiLink>
                </Typography>
            )}

            {/* Confirmation Dialog for Cancellation */}
            <Dialog open={dialogOpen} onClose={closeConfirmationDialog}>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to cancel this booking?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmationDialog} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={() => handleCancelBooking(selectedBookingId)} // Call cancellation handler with stored ID
                        color="secondary"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Bookings;
