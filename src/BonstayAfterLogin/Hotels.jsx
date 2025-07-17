import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Typography } from '@mui/material';
import { getApiUrl } from '../config/apiConfig';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(getApiUrl('/hotels/'))
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.error('Error fetching hotels:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h3" align="center">Hotels</Typography>
      {hotels.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{hotel.hotelName}</h5>
                  <p>City: {hotel.city}</p>
                  <p>Description: {hotel.description}...</p>
                  <p>Amenities: {hotel.amenities}</p>
                  <p>Phone No: {hotel.phoneNo}</p>
                  <p>Address: {hotel.address}</p>
                </div>
                <div className="card-footer">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/bookroom/${hotel.id}/${hotel.hotelName}`)} // Pass hotelId and hotelName to the booking page
                  >
                    Book a Room
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/review/${hotel.id}`)}
                  >
                    Add Review
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => navigate(`/viewReview/${hotel.id}`)}
                  >
                    View Reviews
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Typography>No hotels available</Typography>
      )}
    </Container>
  );
};

export default Hotels;
