import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStartDate, setEndDate, setNoOfPersons, setNoOfRooms, setTypeOfRoom, setErrorMessage, setSuccessMessage, setError } from '../Slices/bookingSlice';
import { getApiUrl } from '../config/apiConfig';

const BookARoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, hotelName } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

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
      dispatch(setErrorMessage('Check-Out date is required.'));
    } else if (endDate < startDate) {
      isValid = false;
      dispatch(setErrorMessage('Check-Out date must be after the Check-In date.'));
    } else if (endDate < new Date()) {
      isValid = false;
      dispatch(setErrorMessage('Check-Out date must be in the future.'));
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
      const userId = sessionStorage.getItem('id');
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const roomCost = selectedRoomType ? selectedRoomType.pricePerNight * nights * noOfRooms : 0;
      const taxes = Math.round(roomCost * 0.18); // 18% tax
      const totalAmount = roomCost + taxes;

      // Create enhanced booking object
      const bookingData = {
        // Legacy fields for compatibility
        startDate,
        endDate,
        noOfPersons,
        noOfRooms,
        typeOfRoom,
        hotelId: id,
        userId: userId,

        // Enhanced fields
        bookingReference: `BNS${Date.now()}`,
        userName: sessionStorage.getItem('name') || 'Guest',
        userEmail: sessionStorage.getItem('email') || '',
        userPhone: sessionStorage.getItem('phoneNo') || '',
        hotelName: hotel?.hotelName || hotelName,
        roomTypeId: selectedRoomType?.id,
        roomTypeName: selectedRoomType?.name || typeOfRoom,
        checkIn: startDate.toISOString().split('T')[0],
        checkOut: endDate.toISOString().split('T')[0],
        nights: nights,
        guests: noOfPersons,
        adults: noOfPersons,
        children: 0,
        rooms: noOfRooms,
        pricePerNight: selectedRoomType?.pricePerNight || 0,
        totalRoomCost: roomCost,
        taxes: taxes,
        totalAmount: totalAmount,
        paymentStatus: 'pending',
        bookingStatus: 'confirmed',
        bookingDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        specialRequests: '',
        cancellationPolicy: hotel?.policies?.cancellation || 'Standard cancellation policy',
        createdBy: 'user',
        paymentMethod: '',
        confirmationSent: false,
        reminderSent: false
      };

      axios
        .post(getApiUrl('/bookings'), bookingData)
        .then((response) => {
          dispatch(setSuccessMessage('Booked Successfully: ' + response.data.id));
          navigate(`/payment/${response.data.id}`);
        })
        .catch(() => {
          dispatch(setError('Error while booking'));
        });
    }
  };

  const handleRoomTypeChange = (e) => {
    const roomTypeId = e.target.value;
    dispatch(setTypeOfRoom(roomTypeId));
    const selected = hotel?.roomTypes?.find(room => room.id === roomTypeId);
    setSelectedRoomType(selected);
  };

  useEffect(() => {
    // Fetch the hotel data to get room types
    setLoading(true);
    axios
      .get(getApiUrl(`/hotels/${id}`))
      .then((result) => {
        setHotel(result.data);
        setLoading(false);
      })
      .catch(() => {
        dispatch(setError('Error loading hotel information'));
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!hotel) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Hotel not found</Alert>
      </Box>
    );
  }

  const nights = startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;
  const roomCost = selectedRoomType && nights ? selectedRoomType.pricePerNight * nights * noOfRooms : 0;
  const taxes = Math.round(roomCost * 0.18);
  const totalAmount = roomCost + taxes;

  return (
    <Box className="bookpage" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Book Your Stay at {hotel.hotelName}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {hotel.description}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
                      value={startDate.toISOString().substring(0, 10)}
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
                      value={endDate.toISOString().substring(0, 10)}
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
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Room Type Details */}
          {selectedRoomType && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedRoomType.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedRoomType.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Capacity:</strong> {selectedRoomType.capacity} guests
                  </Typography>
                  <Typography variant="body2">
                    <strong>Size:</strong> {selectedRoomType.size}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Bed:</strong> {selectedRoomType.bedType}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Amenities:</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {selectedRoomType.amenities?.map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Pricing Summary */}
          {selectedRoomType && startDate && endDate && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Room Rate:</Typography>
                  <Typography>₹{selectedRoomType.pricePerNight}/night</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Nights:</Typography>
                  <Typography>{nights}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Rooms:</Typography>
                  <Typography>{noOfRooms}</Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Room Cost:</Typography>
                  <Typography>₹{roomCost.toLocaleString()}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Taxes (18%):</Typography>
                  <Typography>₹{taxes.toLocaleString()}</Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookARoom;
