import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const ReSchedule = () => {
    const { id } = useParams();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({});

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/bookings/${id}`);
                setBookingData(response.data);
                setStartDate(new Date(response.data.startDate));
                setEndDate(new Date(response.data.endDate));
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('An error occurred while fetching booking data.');
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
                const updatedBooking = {
                    ...bookingData,
                    startDate,
                    endDate,
                };

                const response = await axios.put(`http://localhost:4000/bookings/${id}`, updatedBooking);
                console.log(response);

                if (response.status === 200) {
                    setError('');
                    setErrorMessage('');
                    setStartDate(new Date());
                    setEndDate(new Date());
                    setSuccess('Re-scheduled successfully!');
                } else {
                    setError(response.data.error || 'An error occurred while re-scheduling.');
                }
            } catch (error) {
                setError('An error occurred while re-scheduling.', error);
            }
        }
    };

    return (
        <div className='bookpage' sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <form onSubmit={handleSubmit}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
