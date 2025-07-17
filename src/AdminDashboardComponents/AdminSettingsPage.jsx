import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { ArrowBack } from '@mui/icons-material'; 
import AdminSettings from './AdminSettings';


/**
 * AdminSettingsPage Component
 * This component serves as a dedicated page for the Admin Settings.
 * It provides a header with a title and a back button, and then renders the
 * AdminSettings component which contains the actual setting controls.
 */
const AdminSettingsPage = () => {
    // useNavigate hook to get the navigation function for routing
    const navigate = useNavigate();

    /**
     * Handles the action of navigating back to the admin dashboard.
     * It retrieves the user ID from session storage to construct the correct dashboard URL.
     */
    const handleGoBack = () => {
        const userId = sessionStorage.getItem('id'); // Get the user ID from session storage
        navigate(`/admin-dashboard/${userId}`); // Navigate to the admin dashboard route
    };

    // Main component render
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}> {/* Main container for the page content */}
            {/* Header Section */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Admin Settings {/* Page title */}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Configure your system settings, security options, and real-time monitoring preferences {/* Page description */}
                            </Typography>
                        </Box>
                        {/* Back to Dashboard Button */}
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />} // ArrowBack icon
                            onClick={handleGoBack} // Call handleGoBack function on click
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)', // Hover effect
                                    borderColor: 'white'
                                }
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Admin Settings Component */}
            {/* This is where the actual settings form and logic are rendered */}
            <AdminSettings />
        </Container>
    );
};

export default AdminSettingsPage;
