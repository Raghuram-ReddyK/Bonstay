import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewReviews = () => {
    const { hotelId } = useParams(); // Get the hotelId from the URL
    const [reviews, setReviews] = useState([]);  // State to store reviews for the hotel
    const [hotelName, setHotelName] = useState("");
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");  // State to store error message
    const navigate = useNavigate();  // To navigate to other pages

    // Fetch the reviews for the specific hotel on component mount
    useEffect(() => {
        const fetchReviewsAndHotelDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/hotels/${hotelId}`);
                console.log('response: ', response.data.hotelName);
                setHotelName(response.data.hotelName || response.data.name || "Unknown Hotel")
                setReviews(response.data.reviews || []); // Assuming the API response contains a 'reviews' array
            } catch (err) {
                setError("Error fetching reviews. Please try again later.");
            } finally {
                setLoading(false)
            }
        };

        if (hotelId) {
            fetchReviewsAndHotelDetails();
        }
    }, [hotelId]);

    return (
        <Container maxWidth="md">
            <Typography variant="h3" gutterBottom>
                Reviews for Hotel {hotelName || `Hotel ${hotelId}`}
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {/* Display reviews if available */}
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }} key={index}>
                                <Typography variant="h5">{`Review #${index + 1}`}</Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary={review} />
                                    </ListItem>
                                </List>
                            </Paper>
                        ))
                    ) : (
                        <Typography>No reviews yet for this hotel.</Typography>
                    )}

                    {/* Button to navigate to the review form page */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/review/${hotelId}`)}
                        style={{ marginTop: '16px' }}
                    >
                        Add Review
                    </Button>
                </>
            )}
        </Container>
    );
};

export default ViewReviews;
