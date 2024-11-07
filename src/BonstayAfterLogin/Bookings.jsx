import { Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const [selectedBookingId, setSelectedBookingId] = useState(null); // Store the ID of the selected booking to be canceled
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingsAndHotels = async () => {
            try {
                const bookingsResponse = await axios.get('http://localhost:4000/bookings/');
                const hotelsResponse = await axios.get('http://localhost:4000/hotels/');

                setBookings(bookingsResponse.data);
                setHotels(hotelsResponse.data);
            } catch (error) {
                setCancelError('Error while fetching data. Please try again later.');
            }
        };

        fetchBookingsAndHotels();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:4000/bookings/${bookingId}`);
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
            setCancelSuccess(`Booking cancelled successfully! with ${bookingId}`);
            setDialogOpen(false); // Close the confirmation dialog
        } catch (error) {
            setCancelError('Error canceling booking. Please try again later.');
        }
    };

    // Create a map of hotel IDs to hotel names for easy lookup
    const hotelMap = {};
    hotels.forEach(hotel => {
        hotelMap[hotel.id] = hotel.hotelName;
    });

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
            'Hotel Name': hotelMap[booking.hotelId] || 'Unknown Hotel',
            'Check-In Date': booking.startDate,
            'Check-Out Date': booking.endDate,
            'Number of Persons': booking.noOfPersons,
            'Number of Rooms': booking.noOfRooms,
            'Type of Room': booking.typeOfRoom,
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
                    {bookings.map((booking) => (
                        <div key={booking.id} className="col">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {hotelMap[booking.hotelId] || 'Unknown Hotel'}
                                    </h5>
                                    <p><b>Booking Id:</b> {booking.id}</p>
                                    <p><b>Check-In Date:</b> {booking.startDate}</p>
                                    <p><b>Check-Out Date:</b> {booking.endDate}</p>
                                    <p><b>Number of Persons:</b> {booking.noOfPersons}</p>
                                    <p><b>Number of Rooms:</b> {booking.noOfRooms}</p>
                                    <p><b>Type of Room:</b> {booking.typeOfRoom}</p>
                                </div>
                                <div className="card-footer">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/reschedule/${booking.id}`)}
                                    >
                                        Reschedule Booking
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => openConfirmationDialog(booking.id)}
                                    >
                                        Cancel Booking
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
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
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleCancelBooking(selectedBookingId)}
                        color="secondary"
                    >
                        Confirm Cancellation
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Bookings;
