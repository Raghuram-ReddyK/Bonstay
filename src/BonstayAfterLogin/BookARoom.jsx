import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Box,
    Alert,
} from '@mui/material';

const BookARoom = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [noOfPersons, setNoOfPersons] = useState(1);
    const [noOfRooms, setNoOfRooms] = useState(1);
    const [typeOfRoom, setTypeOfRoom] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setErrors] = useState('');
    const params = useParams();
    const navigate = useNavigate();
    const { id, hotelName } = params;

    const validateForm = () => {
        let isValid = true;
        setErrorMessage('');

        if (!startDate) {
            isValid = false;
            setErrorMessage('Check-In date is required.');
        } else if (startDate < new Date()) {
            isValid = false;
            setErrorMessage('Check-In date must be in the future.');
        }

        if (!endDate) {
            isValid = false;
            setErrorMessage('End date is required.');
        } else if (endDate < startDate) {
            isValid = false;
            setErrorMessage('Check-Out date must be after the Check-In date.');
        } else if (endDate < new Date()) {
            isValid = false;
            setErrorMessage('Check-Out date must be in the future.');
        }

        if (!noOfPersons || noOfPersons <= 0 || noOfPersons > 5) {
            isValid = false;
            setErrorMessage('Number of persons must be between 1 and 5.');
        }

        if (!noOfRooms || noOfRooms <= 0 || noOfRooms > 3) {
            isValid = false;
            setErrorMessage('Number of rooms must be between 1 and 3.');
        }

        if (!typeOfRoom) {
            isValid = false;
            setErrorMessage('Type of room is required.');
        }

        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateForm()) {
            axios.post("http://localhost:4000/bookings", {
                startDate,
                endDate,
                noOfPersons,
                noOfRooms,
                typeOfRoom,
            })
                .then((response) => {
                    const userId = response.data.userId; // Adjust this based on your API response
                    setSuccess("Booked Successfully: " + response.data.id);
                    navigate(`/bookroom?userId=${userId}`); // Navigate to the URL with userId
                })
                .catch(() => {
                    setErrors("Error while booking");
                });
        }
    };

    // Fetch hotels (not directly related to booking)
    useEffect(() => {
        axios.get(`http://localhost:4000/bookings/${id}`)
            .then((result) => {
                // Handle fetched hotels if necessary
            })
            .catch(() => {
                // Handle errors appropriately
            });
    }, [id]);

    return (
        <Box className='bookpage' sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Book Hotel {hotelName}
            </Typography>
            <form onSubmit={handleSubmit}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Check-In Date"
                    type="date"
                    value={startDate.toISOString().substring(0, 10)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Check-Out Date"
                    type="date"
                    value={endDate.toISOString().substring(0, 10)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Number of Persons"
                    type="number"
                    value={noOfPersons}
                    onChange={(e) => setNoOfPersons(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Number of Rooms"
                    type="number"
                    value={noOfRooms}
                    onChange={(e) => setNoOfRooms(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type of Room</InputLabel>
                    <Select
                        value={typeOfRoom}
                        onChange={(e) => setTypeOfRoom(e.target.value)}
                    >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        <MenuItem value="single with A/c">Single with A/c</MenuItem>
                        <MenuItem value="double with A/c">Double with A/c</MenuItem>
                        <MenuItem value="suite with A/c">Suite with A/c</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Book Now
                </Button>
            </form>
        </Box>
    );
}

export default BookARoom;