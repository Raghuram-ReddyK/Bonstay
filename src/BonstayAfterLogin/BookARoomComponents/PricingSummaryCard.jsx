import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider
} from '@mui/material';

const PricingSummaryCard = ({ selectedRoomType, startDate, endDate, noOfRooms }) => {
  if (!selectedRoomType || !startDate || !endDate) return null;

  const nights = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  const roomCost = selectedRoomType.pricePerNight * nights * noOfRooms;
  const taxes = Math.round(roomCost * 0.18);
  const totalAmount = roomCost + taxes;

  return (
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
  );
};

export default PricingSummaryCard;