import { Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getApiUrl } from '../config/apiConfig';

const Bookings = ({ userId }) => { // Destructure userId prop here
    const [bookings, setBookings] = useState([]);
    console.log('bookings: ', bookings);
    const [hotels, setHotels] = useState([]);
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const [selectedBookingId, setSelectedBookingId] = useState(null); // Store the ID of the selected booking to be canceled
    const navigate = useNavigate();
    // const { id } = useParams();

    useEffect(() => {
        const fetchBookingsAndHotels = async () => {
            try {
                // Fetch bookings for the logged-in user
                console.log(`Fetching bookings for User ID: ${userId}`);
                const bookingsResponse = await axios.get(getApiUrl(`/bookings`));
                const hotelsResponse = await axios.get(getApiUrl('/hotels/'));

                const userBookings = bookingsResponse.data.filter(booking => {
                    const hadUserId = booking.userId !== undefined && booking.userId !== null;
                    const matchesCurrentUser = hadUserId && String(booking.userId) === String(userId);
                    return matchesCurrentUser;
                })

                if (userBookings.length === 0) {
                    console.log(`No bookings found for user ${userId}. This could be bacause:`);
                    console.log('1. The user has not made any bookings yet');
                    console.log('2. Existing bookings were created before the userId field was added');
                    console.log('3. There might be a data type mismatch between userId and booking.userId')
                }

                // Set the state with the fetched data
                setBookings(userBookings);
                setHotels(hotelsResponse.data);
            } catch (error) {
                setCancelError('Error while fetching data. Please try again later.');
                console.error(error);
            }
        };

        if (userId) {
            fetchBookingsAndHotels();
        }
    }, [userId]); // Fetch data whenever userId changes

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(getApiUrl(`/bookings/${bookingId}`));
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
            setCancelSuccess(`Booking cancelled successfully! with ${bookingId}`);
            setDialogOpen(false); // Close the confirmation dialog
        } catch (error) {
            setCancelError('Error canceling booking. Please try again later.');
        }
    };

    // Create a map of hotel IDs to hotel names for easy lookup
    const hotelMap = React.useMemo(() => {
        const map = {};
        hotels.forEach((hotel) => {
            // console.log(`Mapping hotel ID: ${hotel.id} => Hotel Name: ${hotel.hotelName}`);
            map[String(hotel.id)] = hotel.hotelName; // Ensure hotelId is treated as a string
        });
        return map;
    }, [hotels]);

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
                        return (
                            <div key={booking.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {hotelMap[String(booking.hotelId)] || 'Unknown Hotel'}
                                        </h5>
                                        <p><b>Booking Id:</b> {booking.id}</p>
                                        <p><b>Check-In Date:</b> {booking.checkIn || booking.startDate}</p>
                                        <p><b>Check-Out Date:</b> {booking.checkOut || booking.endDate}</p>
                                        <p><b>Number of Persons:</b> {booking.guests || booking.noOfPersons}</p>
                                        <p><b>Number of Rooms:</b> {booking.noOfRooms}</p>
                                        <p><b>Type of Room:</b> {booking.roomType || booking.typeOfRoom}</p>
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
