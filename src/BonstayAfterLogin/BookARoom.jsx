import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStartDate, setEndDate, setNoOfPersons, setNoOfRooms, setTypeOfRoom, setErrorMessage, setSuccessMessage, setError } from '../Slices/bookingSlice';
import { getBackendApiUrl } from '../config/apiConfig';
import { createBookingData } from '../services/bookingUtils';
import HotelList from './BookARoomComponents/HotelList';
import HotelDetails from './BookARoomComponents/HotelDetails';
import BookingForm from './BookARoomComponents/BookingForm';
import RoomDetailsCard from './BookARoomComponents/RoomDetailsCard';
import PricingSummaryCard from './BookARoomComponents/PricingSummaryCard';

const BookARoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [currentView, setCurrentView] = useState('list');

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

  const handleViewDetails = (hotelId) => {
    navigate(`/book-a-room/${hotelId}`);
    setCurrentView('details');
  };

  const handleBookNow = () => {
    setCurrentView('booking');
  };

  const handleBookingSubmit = () => {
    const bookingData = createBookingData(hotel, selectedRoomType, startDate, endDate, noOfPersons, noOfRooms, typeOfRoom);

    axios
      .post(getBackendApiUrl('/bookings'), bookingData)
      .then((response) => {
        dispatch(setSuccessMessage('Booked Successfully: ' + response.data.id));
        navigate(`/payment/${response.data.id}`);
      })
      .catch(() => {
        dispatch(setError('Error while booking'));
      });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(getBackendApiUrl(`/hotels/${id}`))
        .then((result) => {
          setHotel(result.data.data);
          setLoading(false);
          setCurrentView('details');
        })
        .catch(() => {
          dispatch(setError('Error loading hotel information'));
          setLoading(false);
        });
    } else {
      setLoading(false);
      setCurrentView('list');
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (currentView === 'list') {
    return <HotelList onViewDetails={handleViewDetails} />;
  }

  if (currentView === 'details') {
    return <HotelDetails hotel={hotel} onBookNow={handleBookNow} />;
  }

  if (currentView === 'booking') {
    return (
      <Box className="bookpage" sx={{ p: 3 }}>
        <BookingForm
          hotel={hotel}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          onSubmit={handleBookingSubmit}
        />
        <Box sx={{ mt: 3 }}>
          <RoomDetailsCard selectedRoomType={selectedRoomType} />
          <PricingSummaryCard
            selectedRoomType={selectedRoomType}
            startDate={startDate}
            endDate={endDate}
            noOfRooms={noOfRooms}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">Invalid view</Alert>
    </Box>
  );
};

export default BookARoom;
