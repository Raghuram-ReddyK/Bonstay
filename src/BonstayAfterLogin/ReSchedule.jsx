import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Alert } from '@mui/material';

const ReSchedule = () => {
    const { id } = useParams();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');  // This is the general error state
    const [bookingData, setBookingData] = useState({});

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/bookings/${id}`);
                setBookingData(response.data);
                const startDateValue = response.data.checkIn || response.data.startDate;
                const endDateValue = response.data.checkOut || response.data.endDate;

                if (startDateValue && endDateValue) {
                    setStartDate(new Date(startDateValue));
                    setEndDate(new Date(endDateValue));
                } else {
                    console.error('Missing date fields in booking data:', response.data);
                    setError('Invalid booking data: missing date fields.');
                }
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('An error occurred while fetching booking data.'); // Set error state here
            }
        };

        fetchBooking();
    }, [id]);

    const validateForm = () => {
        let isValid = true;
        setErrorMessage('');

        if (!startDate) {
            isValid = false;
            setErrorMessage('Check-in date is required');
        } else if (startDate < new Date()) {
            isValid = false;
            setErrorMessage('Check-In date must be in the future');
        }

        if (!endDate) {
            isValid = false;
            setErrorMessage('Check-Out date is required');
        } else if (endDate < startDate) {
            isValid = false;
            setErrorMessage('Check-Out date must be after the Check-In date');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                // Create updated booking with proper field names based on original booking format
                const updatedBooking = { ...bookingData };

                // Check if original booking used checkIn/checkOut (admin-created) or startDate/endDate (user-created)
                if (bookingData.checkIn !== undefined || bookingData.checkOut !== undefined) {
                    // Admin-created booking format
                    updatedBooking.checkIn = startDate.toISOString().split('T')[0];
                    updatedBooking.checkOut = endDate.toISOString().split('T')[0];
                } else {
                    // User-created booking format
                    updatedBooking.startDate = startDate.toISOString().split('T')[0];
                    updatedBooking.endDate = endDate.toISOString().split('T')[0];
                }

                const response = await axios.put(`http://localhost:4000/bookings/${id}`, updatedBooking);
                console.log(response);

                if (response.status === 200) {
                    setError(''); // Clear the general error
                    setErrorMessage(''); // Clear the specific error
                    setStartDate(new Date());
                    setEndDate(new Date());
                    setSuccess('Re-scheduled successfully!');
                } else {
                    setError(response.data.error || 'An error occurred while re-scheduling.');
                }
            } catch (error) {
                setError('An error occurred while re-scheduling. Please try again later.'); // Set error state for general errors
            }
        }
    };

    return (
        <div className='bookpage' sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <form onSubmit={handleSubmit}>
                {error && <Alert severity="error">{error}</Alert>} {/* Display general error */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>} {/* Display specific error */}
                {success && <Alert severity="success">{success}</Alert>}
                <Typography variant="h4" gutterBottom>
                    Re-Schedule Hotel
                </Typography>
                <TextField
                    label="Check-in Date"
                    type="date"
                    value={startDate.toISOString().substring(0, 10)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Check-out Date"
                    type="date"
                    value={endDate.toISOString().substring(0, 10)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Re-Schedule
                </Button>
            </form>
        </div>
    );
};

export default ReSchedule;
