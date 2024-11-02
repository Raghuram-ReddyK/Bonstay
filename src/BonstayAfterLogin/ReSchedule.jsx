import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ReSchedule = () => {
    const { id } = useParams();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({}); // Add state for booking data

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/bookings/` + id);
                setBookingData(response.data);
                setStartDate(new Date(response.data.startDate)); // Assuming bookingData.startDate exists
                setEndDate(new Date(response.data.endDate)); // Assuming bookingData.endDate exists
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('An error occurred while fetching booking data.');
            }
        };

        fetchBooking();
    }, [id]); // Run on `id` change

    const validateForm = () => {
        let isValid = true;
        setErrorMessage('');

        if (!startDate) {
            isValid = false;
            setErrorMessage('Start date is required');
        } else if (startDate < new Date()) {
            isValid = false;
            setErrorMessage('Start date must be in the future');
        }

        if (!endDate) {
            isValid = false;
            setErrorMessage('End date is required');
        } else if (endDate < startDate) {
            isValid = false;
            setErrorMessage('End date must be after the start date');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.put(`http://localhost:4000/bookings/` + id, {
                    startDate,
                    endDate,
                });
                console.log(response);
                if (response.status === 200) {

                    // Clear error messages and reset dates to avoid confusion
                    setError('');
                    setErrorMessage('');
                    setStartDate(new Date());
                    setEndDate(new Date());
                    setSuccess('Re-scheduled successfully!');
                } else {
                    setError(response.data.error || 'An error occurred while re-scheduling.');
                }
            } catch (error) {
                setError('An error occurred while re-scheduling.');
                // console.error(error);
            }
        }
    };

    return (
        <div className='bookpage1'>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <h4>Re-Schedule Hotel</h4>
                <label>Start Date:</label><br />
                <input
                    type="date"
                    value={startDate.toISOString().substring(0, 10)} // Consider using a date formatting library
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                /><br />
                <label>End Date:</label><br />
                <input
                    type="date"
                    value={endDate.toISOString().substring(0, 10)} // Consider using a date formatting library
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                /><br />
                <button type="submit">Re-Schedule</button><br />
                {success && <p className='text-success'>{success}</p>}
            </form>
        </div>
    );
};

export default ReSchedule;