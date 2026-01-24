import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Rating,
  Divider,
  Button
} from '@mui/material';

const HotelDetails = ({ hotel, onBookNow }) => {
  if (!hotel) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        {hotel.hotelName}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {hotel.description}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hotel Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Location:</strong> {hotel.city}, {hotel.state}, {hotel.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Category:</strong> {hotel.category}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {hotel.phoneNo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {hotel.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Check-in:</strong> {hotel.checkInTime}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Check-out:</strong> {hotel.checkOutTime}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                {hotel.amenities?.map((amenity, index) => (
                  <Chip key={index} label={amenity} size="small" variant="outlined" />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Policies
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Cancellation:</strong> {hotel.policies?.cancellation}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Children:</strong> {hotel.policies?.childPolicy}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pets:</strong> {hotel.policies?.petPolicy}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Smoking:</strong> {hotel.policies?.smokingPolicy}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Nearby Attractions
              </Typography>
              <Box>
                {hotel.nearbyAttractions?.map((attraction, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {attraction.name} - {attraction.distance}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gallery
              </Typography>
              <Grid container spacing={1}>
                {hotel.gallery?.map((image, index) => (
                  <Grid item xs={6} key={index}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={image}
                      alt={`Gallery ${index + 1}`}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );
};

export default HotelDetails;