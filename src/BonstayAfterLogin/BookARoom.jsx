import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStartDate, setEndDate, setNoOfPersons, setNoOfRooms, setTypeOfRoom, setErrorMessage, setSuccessMessage, setError } from '../Slices/bookingSlice';
import { getApiUrl } from '../config/apiConfig';

const BookARoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate hook for programmatic navigation
  const { id, hotelName } = useParams(); // hotelName and hotelId come from the URL

  const {
    startDate,
    endDate,
    noOfPersons,
    noOfRooms,
    typeOfRoom,
    errorMessage,
    successMessage,
    error,
  } = useSelector((state) => state.booking);

  // Validate the form fields
  const validateForm = () => {
    let isValid = true;
    dispatch(setErrorMessage(''));

    if (!startDate) {
      isValid = false;
      dispatch(setErrorMessage('Check-In date is required.'));
    } else if (startDate < new Date()) {
      isValid = false;
      dispatch(setErrorMessage('Check-In date must be in the future.'));
    }

    if (!endDate) {
      isValid = false;
      dispatch(setErrorMessage('End date is required.'));
    } else if (endDate < startDate) {
      isValid = false;
      dispatch(setErrorMessage('Check-Out date must be after the Check-In date.'));
    } else if (endDate < new Date()) {
      isValid = false;
      dispatch(setErrorMessage('Check-Out date must be in the future.'));
    }

    if (!noOfPersons || noOfPersons <= 0 || noOfPersons > 5) {
      isValid = false;
      dispatch(setErrorMessage('Number of persons must be between 1 and 5.'));
    }

    if (!noOfRooms || noOfRooms <= 0 || noOfRooms > 3) {
      isValid = false;
      dispatch(setErrorMessage('Number of rooms must be between 1 and 3.'));
    }

    if (!typeOfRoom) {
      isValid = false;
      dispatch(setErrorMessage('Type of room is required.'));
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      const userId = sessionStorage.getItem('id')
      axios
        .post(getApiUrl('/bookings'), {
          startDate,
          endDate,
          noOfPersons,
          noOfRooms,
          typeOfRoom,
          hotelId: id, // Include hotelId in the booking data
          userId: userId,
        })
        .then((response) => {
          dispatch(setSuccessMessage('Booked Successfully: ' + response.data.id));

          // Redirect to the payment page with the booking ID as a query parameter
          navigate(`/payment/${response.data.id}`); // Navigate to payment page
        })
        .catch(() => {
          dispatch(setError('Error while booking'));
        });
    }
  };

  useEffect(() => {
    // Fetch the hotel data (optional) if you need more details about the hotel during the booking process
    axios
      .get(getApiUrl(`/hotels/${id}`))
      .then((result) => {
        // Do something with the fetched hotel data if needed
      })
      .catch(() => {
        // Handle errors appropriately
      });
  }, [id]);

  return (
    <Box className="bookpage" sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Book Hotel: {hotelName} {/* Display the hotelName passed from the URL */}
      </Typography>
      <form onSubmit={handleSubmit}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Check-In Date"
          type="date"
          value={startDate.toISOString().substring(0, 10)}
          onChange={(e) => dispatch(setStartDate(new Date(e.target.value)))}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Check-Out Date"
          type="date"
          value={endDate.toISOString().substring(0, 10)}
          onChange={(e) => dispatch(setEndDate(new Date(e.target.value)))}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Persons"
          type="number"
          value={noOfPersons}
          onChange={(e) => dispatch(setNoOfPersons(Number(e.target.value)))}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Rooms"
          type="number"
          value={noOfRooms}
          onChange={(e) => dispatch(setNoOfRooms(Number(e.target.value)))}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type of Room</InputLabel>
          <Select
            value={typeOfRoom}
            onChange={(e) => dispatch(setTypeOfRoom(e.target.value))}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
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
};

export default BookARoom;
