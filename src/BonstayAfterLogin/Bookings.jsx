import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingsAndHotels = async () => {
            try {
                const bookingsResponse = await axios.get('http://localhost:4000/bookings/');
                const hotelsResponse = await axios.get('http://localhost:4000/hotels/');
                console.log('Hotels:', hotelsResponse.data);

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
            await axios.delete(`http://localhost:4000/bookings/${bookingId}`); // Use template literal correctly
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
            setCancelSuccess('Booking cancelled successfully!');
        } catch (error) {
            setCancelError('Error canceling booking. Please try again later.');
        }
    };

    // Create a map of hotel IDs to hotel names for easy lookup
    const hotelMap = {};
    hotels.forEach(hotel => {
        hotelMap[hotel.id] = hotel.hotelName;
    });

    return (
        <Container className="text-center">
            <Typography variant='h3' color='blue'> --- Bookings --- </Typography>
            {cancelSuccess && <div className="alert alert-success">{cancelSuccess}</div>}
            {cancelError && <div className="alert alert-danger">{cancelError}</div>}
            {bookings.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="col">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {hotelMap[booking.id] || 'Unknown Hotel'} {/* Correctly referencing hotelId */}
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
                                        onClick={() => navigate(`/reschedule/${booking.id}`)} // Use template literal correctly
                                    >
                                        Reschedule Booking
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        Cancel Booking
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant='h4' color='red'>
                    No bookings found. Please try to book the hotels....
                    <MuiLink href="/hotels" underline="true">
                        Click here
                    </MuiLink>
                </Typography>
            )}
        </Container>
    );
};

export default Bookings;
