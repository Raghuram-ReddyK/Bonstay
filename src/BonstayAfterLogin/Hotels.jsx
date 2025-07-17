import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for programmatic navigation
import { Container, Button, Typography, CircularProgress, Alert } from '@mui/material'; // Importing Material-UI components for UI elements
import { useHotels } from '../hooks/useSWRData'; // Importing custom SWR hook to fetch hotel data

/**
 * Hotels Component
 * This component displays a list of available hotels.
 * It fetches hotel data using the `useHotels` SWR hook and provides options
 * to book a room, add a review, or view existing reviews for each hotel.
 */
const Hotels = () => {
  // useNavigate hook to get the navigation function for routing
  const navigate = useNavigate();

  // useHotels SWR hook to fetch hotel data
  // It provides `data` (the list of hotels), `error` (if fetching fails), and `isLoading` (fetching status).
  const { data: hotels, error, isLoading } = useHotels();

  // Conditional rendering for loading state:
  // Display a circular progress indicator while hotel data is being fetched.
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Conditional rendering for error state:
  // Display an alert with an error message if there was an issue fetching hotels.
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading hotels: {error.message} {/* Display the specific error message */}
        </Alert>
      </Container>
    );
  }

  // Main component render
  return (
    <Container>
      <Typography variant="h3" align="center">Hotels</Typography> {/* Page title */}
      {/* Conditional rendering based on whether hotels data is available and not empty */}
      {hotels && hotels.length > 0 ? (
        // Display hotels in a responsive grid layout
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="col"> {/* Unique key for each hotel card */}
              <div className="card h-100 shadow-sm"> {/* Card styling with shadow */}
                <div className="card-body">
                  <h5 className="card-title">{hotel.hotelName}</h5> {/* Hotel name */}
                  <p>City: {hotel.city}</p>
                  <p>Description: {hotel.description}...</p> {/* Hotel description (truncated) */}
                  <p>Amenities: {hotel.amenities}</p> {/* Hotel amenities */}
                  <p>Phone No: {hotel.phoneNo}</p> {/* Hotel phone number */}
                  <p>Address: {hotel.address}</p> {/* Hotel address */}
                </div>
                <div className="card-footer">
                  {/* Button to navigate to the "Book a Room" page for the specific hotel */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/bookroom/${hotel.id}/${hotel.hotelName}`)} // Pass hotel ID and name as URL parameters
                  >
                    Book a Room
                  </Button>
                  {/* Button to navigate to the "Add Review" page for the specific hotel */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/review/${hotel.id}`)} // Pass hotel ID for review
                  >
                    Add Review
                  </Button>
                  {/* Button to navigate to the "View Reviews" page for the specific hotel */}
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => navigate(`/viewReview/${hotel.id}`)} // Pass hotel ID to view reviews
                  >
                    View Reviews
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Display a message if no hotels are available
        <Typography>No hotels available</Typography>
      )}
    </Container>
  );
};

export default Hotels;
