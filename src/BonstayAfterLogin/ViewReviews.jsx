import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    Alert
} from '@mui/material';

const ViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/hotels");
                setReviews(response.data);
            } catch (err) {
                setError("Error fetching reviews. Please try again later.");
            }
        };

        fetchData();
    }, []);

    return (
        <Container className='home' maxWidth="md" >
            <Typography variant="h3" gutterBottom>
                All Reviews
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }} key={review.id}>
                        <Typography variant="h5">{review.hotelName}</Typography>
                        {review.reviews.length > 0 ? (
                            <List>
                                {review.reviews.map((reviewText, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={reviewText} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No reviews for this hotel yet.</Typography>
                        )}
                    </Paper>
                ))
            ) : (
                <Typography>No reviews available</Typography>
            )}
            <Button variant="contained" color="primary" onClick={() => navigate("/review")} style={{ marginTop: '16px' }}>
                Add Review
            </Button>
        </Container>
    );
};

export default ViewReviews;
