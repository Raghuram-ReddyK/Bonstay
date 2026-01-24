import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { getBackendApiUrl } from '../../config/apiConfig';

const HotelList = ({ onViewDetails }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(getBackendApiUrl('/hotels'));
        setHotels(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Error loading hotels');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Available Hotels
      </Typography>
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={hotel.imageUrl || '/placeholder-hotel.jpg'}
                alt={hotel.hotelName}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {hotel.hotelName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {hotel.city}, {hotel.state}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <Rating value={hotel.rating} readOnly precision={0.1} size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {hotel.rating} ({hotel.totalReviews} reviews)
                  </Typography>
                </Box>
                <Chip label={hotel.category} size="small" color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {hotel.description?.substring(0, 100)}...
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => onViewDetails(hotel._id)}
                >
                  View Details & Book
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HotelList;