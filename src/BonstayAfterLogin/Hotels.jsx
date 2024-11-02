
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Hotels.css'; // Import your custom CSS file for styling

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [delSuccess, setDelSuccess] = useState('');
    const [delError, setDelError] = useState('');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:4000/hotels')
            .then((result) => {
                // console.log(result);
                setHotels(result.data);
            })
            .catch(() => {
                // Handle errors appropriately (e.g., display an error message)
            });
    }, []); // Empty dependency array to fetch hotels only once

    const handleReview = (hotelId) => {
        navigate(`/viewReview?hotelId=${hotelId}`);
    };

    return (
        <>
            <div className="text-center">
                {/* <h3>All Hotels</h3> */}
                {delSuccess && <div className="alert alert-success">{delSuccess}</div>}
                {delError && <div className="alert alert-danger">{delError}</div>}
                {hotels.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{hotel.hotelName}</h5>
                                        <span>
                                            <p>City: {hotel.city}</p>
                                            <p>Description: {hotel.description}...</p>
                                            <p>Amenities: {hotel.amenities}</p>
                                        </span>
                                    </div>
                                    <div className="card-footer">
                                        <small className="text-muted">Contact No: {hotel.phoneNo}</small>
                                        <br />
                                        <button
                                            className="btn btn-primary me-2"
                                            // onClick={() => navigate(`/login?hotelId=${hotel.id}`)} // Pass hotel ID as query parameter
                                            onClick={() => navigate(`/bookroom/:id=${hotel.id}`)}
                                        >
                                            Book a Room
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate(`/review?hotelId=${hotel.id}`)} // Pass hotel ID as query parameter
                                        >
                                            Add Review
                                        </button>

                                        <button className='btn btn-danger float-right'
                                            onClick={() => handleReview(hotel.id)}
                                        >
                                            View Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    null
                )}
            </div>
            {selectedHotel && ( // Conditionally display selected hotel name
                <div>
                    <h2>Selected Hotel: {selectedHotel.hotelName}</h2>
                    {/* You can display additional details about the selected hotel here */}
                </div>
            )}
        </>
    );
};

export default Hotels;