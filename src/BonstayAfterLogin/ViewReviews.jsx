import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [success, setSuccess] = useState("");
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
        <div>
            <h3>All Reviews</h3>
            {success && <div>{success}</div>}
            {error && <div>{error}</div>}
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div className="reviews" key={review.id}>
                        <h3>{review.hotelName}</h3>
                        {review.reviews.length > 0 ? (
                            <ul>
                                {review.reviews.map((reviewText, index) => (
                                    <li key={index}>{reviewText}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No reviews for this hotel yet.</p>
                        )}
                    </div>
                ))
            ) : (
                <div>No reviews available</div>
            )}
            <button onClick={() => navigate("/review")}>Add review</button>
        </div>
    );
};

export default ViewReviews;