import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';

const RoomDetailsCard = ({ selectedRoomType }) => {
  if (!selectedRoomType) return null;

  return (
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
  );
};

export default RoomDetailsCard;