import { Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Link as MuiLink, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getApiUrl } from '../config/apiConfig';
import { useUserBookings, useHotels } from '../hooks/useSWRData';

const Bookings = ({ userId }) => { // Destructure userId prop here
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const [selectedBookingId, setSelectedBookingId] = useState(null); // Store the ID of the selected booking to be canceled
    const navigate = useNavigate();

    // Use SWR hooks for data fetching
    const { data: bookings, error: bookingsError, isLoading: bookingsLoading, mutate: mutateBookings } = useUserBookings(userId);
    const { data: hotels, error: hotelsError, isLoading: hotelsLoading } = useHotels();

    // Create a map of hotel IDs to hotel names for easy lookup (must be called before any early returns)
    const hotelMap = React.useMemo(() => {
        if (!hotels) return {};
        const map = {};
        hotels.forEach((hotel) => {
            // console.log(`Mapping hotel ID: ${hotel.id} => Hotel Name: ${hotel.hotelName}`);
            map[String(hotel.id)] = hotel.hotelName; // Ensure hotelId is treated as a string
        });
        return map;
    }, [hotels]);

    // Check for loading states
    if (bookingsLoading || hotelsLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading bookings...</Typography>
            </Container>
        );
    }

    // Check for errors
    if (bookingsError || hotelsError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    Error loading data: {bookingsError?.message || hotelsError?.message}
                </Alert>
            </Container>
        );
    }

    console.log(`Found ${bookings?.length || 0} bookings for user ${userId}`);

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(getApiUrl(`/bookings/${bookingId}`));
            // Refresh bookings data after cancellation
            mutateBookings();
            setCancelSuccess(`Booking cancelled successfully! with ${bookingId}`);
            setDialogOpen(false); // Close the confirmation dialog
        } catch (error) {
            setCancelError('Error canceling booking. Please try again later.');
        }
    };

    // Open the confirmation dialog
    const openConfirmationDialog = (bookingId) => {
        setSelectedBookingId(bookingId);
        setDialogOpen(true);
    };

    // Close the confirmation dialog
    const closeConfirmationDialog = () => {
        setDialogOpen(false);
        setSelectedBookingId(null);
    };

    // Export to Excel
    const handleExportExcel = () => {
        const data = bookings.map((booking) => ({
            'Booking ID': booking.id,
            'Hotel Name': hotelMap[String(booking.hotelId)] || 'Unknown Hotel', // Using hotelMap for hotel name
            'Check-In Date': booking.checkIn || booking.startDate,
            'Check-Out Date': booking.checkOut || booking.endDate,
            'Number of Persons': booking.guests || booking.noOfPersons,
            'Number of Rooms': booking.noOfRooms,
            'Type of Room': booking.roomType || booking.typeOfRoom,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

        // Save as Excel file
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelFile], { type: 'application/octet-stream' }), 'bookings.xlsx');
    };

    // Print the page
    const handlePrint = () => {
        const printContent = document.getElementById('printable-bookings');
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <Container className="text-center">
            <Typography variant="h3" color="blue">
                --- Bookings ---
            </Typography>
            {cancelSuccess && <div className="alert alert-success">{cancelSuccess}</div>}
            {cancelError && <div className="alert alert-danger">{cancelError}</div>}

            {/* Export and Print buttons */}
            <Button variant="outlined" color="primary" onClick={handleExportExcel} sx={{ m: 2 }}>
                Export to Excel
            </Button>
            <Button variant="outlined" color="secondary" onClick={handlePrint} sx={{ m: 2 }}>
                Print Bookings
            </Button>

            {bookings.length > 0 ? (
                <div id="printable-bookings" className="row row-cols-1 row-cols-md-2 g-4">
                    {bookings.map((booking) => {
                        // Get hotel name from the new data structure
                        const hotelName = booking.hotelName || hotelMap[String(booking.hotelId)] || 'Unknown Hotel';
                        const isEnhancedBooking = booking.bookingReference; // Check if it's new format

                        return (
                            <div key={booking.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{hotelName}</h5>
                                            {isEnhancedBooking && (
                                                <span className="badge bg-primary">{booking.bookingStatus || 'confirmed'}</span>
                                            )}
                                        </div>

                                        {/* Enhanced booking display */}
                                        {isEnhancedBooking ? (
                                            <>
                                                <p className="text-muted mb-2">
                                                    <small>Booking Reference: {booking.bookingReference}</small>
                                                </p>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <p><b>Check-in:</b><br />{new Date(booking.checkIn).toLocaleDateString()}</p>
                                                        <p><b>Check-out:</b><br />{new Date(booking.checkOut).toLocaleDateString()}</p>
                                                        <p><b>Guests:</b> {booking.guests}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p><b>Nights:</b> {booking.nights}</p>
                                                        <p><b>Rooms:</b> {booking.rooms}</p>
                                                        <p><b>Room Type:</b><br />{booking.roomTypeName}</p>
                                                    </div>
                                                </div>

                                                {/* Pricing Information */}
                                                <div className="mt-3 p-2 bg-light rounded">
                                                    <div className="d-flex justify-content-between">
                                                        <span>Room Cost:</span>
                                                        <span>₹{booking.totalRoomCost?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <span>Taxes:</span>
                                                        <span>₹{booking.taxes?.toLocaleString()}</span>
                                                    </div>
                                                    <hr className="my-1" />
                                                    <div className="d-flex justify-content-between fw-bold">
                                                        <span>Total Amount:</span>
                                                        <span className="text-success">₹{booking.totalAmount?.toLocaleString()}</span>
                                                    </div>
                                                    {booking.paymentStatus && (
                                                        <div className="text-center mt-2">
                                                            <span className={`badge ${booking.paymentStatus === 'paid' ? 'bg-success' :
                                                                    booking.paymentStatus === 'partial' ? 'bg-warning' : 'bg-danger'
                                                                }`}>
                                                                Payment: {booking.paymentStatus}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Special Requests */}
                                                {booking.specialRequests && (
                                                    <div className="mt-2">
                                                        <small className="text-muted">
                                                            <b>Special Requests:</b> {booking.specialRequests}
                                                        </small>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            /* Legacy booking display */
                                            <>
                                                <p><b>Booking Id:</b> {booking.id}</p>
                                                <p><b>Check-In Date:</b> {booking.checkIn || booking.startDate}</p>
                                                <p><b>Check-Out Date:</b> {booking.checkOut || booking.endDate}</p>
                                                <p><b>Number of Persons:</b> {booking.guests || booking.noOfPersons}</p>
                                                <p><b>Number of Rooms:</b> {booking.noOfRooms}</p>
                                                <p><b>Type of Room:</b> {booking.roomType || booking.typeOfRoom}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => navigate(`/reschedule/${booking.id}`)}
                                            >
                                                Reschedule Booking
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => openConfirmationDialog(booking.id)}
                                            >
                                                Cancel Booking
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Typography variant="h4" color="red">
                    No bookings found. Please try to book the hotels....
                    <MuiLink href="/hotels" underline="true">
                        Click here
                    </MuiLink>
                </Typography>
            )}

            {/* Confirmation Dialog */}
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
                        onClick={() => handleCancelBooking(selectedBookingId)}
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
