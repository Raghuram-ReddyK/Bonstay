import React from 'react';
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
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStartDate, setEndDate, setNoOfPersons, setNoOfRooms, setTypeOfRoom, setErrorMessage } from '../../Slices/bookingSlice';

const BookingForm = ({ hotel, selectedRoomType, setSelectedRoomType, onSubmit }) => {
  const dispatch = useDispatch();
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
      dispatch(setErrorMessage('Check-Out date is required.'));
    } else if (endDate < startDate) {
      isValid = false;
      dispatch(setErrorMessage('Check-Out date must be after the Check-In date.'));
    }

    if (!noOfPersons || noOfPersons <= 0 || noOfPersons > 6) {
      isValid = false;
      dispatch(setErrorMessage('Number of persons must be between 1 and 6.'));
    }

    if (!noOfRooms || noOfRooms <= 0 || noOfRooms > 5) {
      isValid = false;
      dispatch(setErrorMessage('Number of rooms must be between 1 and 5.'));
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
      onSubmit();
    }
  };

  const handleRoomTypeChange = (e) => {
    const roomTypeId = e.target.value;
    dispatch(setTypeOfRoom(roomTypeId));
    const selected = hotel?.roomTypes?.find(room => room.id === roomTypeId);
    setSelectedRoomType(selected);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Booking Details
        </Typography>

        <form onSubmit={handleSubmit}>
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check-In Date"
                type="date"
                value={startDate ? new Date(startDate).toISOString().substring(0, 10) : ''}
                onChange={(e) => dispatch(setStartDate(new Date(e.target.value)))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check-Out Date"
                type="date"
                value={endDate ? new Date(endDate).toISOString().substring(0, 10) : ''}
                onChange={(e) => dispatch(setEndDate(new Date(e.target.value)))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Guests"
                type="number"
                value={noOfPersons}
                onChange={(e) => dispatch(setNoOfPersons(Number(e.target.value)))}
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 6 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Rooms"
                type="number"
                value={noOfRooms}
                onChange={(e) => dispatch(setNoOfRooms(Number(e.target.value)))}
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Room Type</InputLabel>
                <Select
                  value={typeOfRoom}
                  onChange={handleRoomTypeChange}
                >
                  <MenuItem value="">
                    <em>Select Room Type</em>
                  </MenuItem>
                  {hotel.roomTypes?.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name} - ₹{room.pricePerNight}/night
                      {room.discount > 0 && (
                        <Chip
                          label={`${room.discount}% OFF`}
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!selectedRoomType || !startDate || !endDate}
          >
            Book Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;