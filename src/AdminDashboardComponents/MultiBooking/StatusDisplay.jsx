import { useDispatch, useSelector } from 'react-redux';
import {
    Typography,
    Box,
    Alert
} from '@mui/material';
import { clearMessage } from '../../Slices/multiBookingSlice';

const StatusDisplay = () => {
    const dispatch = useDispatch();

    const { success, error, creationResults } = useSelector((state) => state.multiBooking);

    if (!error && !success) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            {/* Global Error Display */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => dispatch(clearMessage())}
                >
                    {error}
                </Alert>
            )}

            {/* Success Results Display */}
            {success && creationResults.length > 0 && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => dispatch(clearMessage())}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Booking Creation Results:
                    </Typography>

                    <Typography variant="body2">
                        Successfully created: {creationResults.filter(r => r.success).length} bookings
                    </Typography>

                    {creationResults.filter(r => !r.success).length > 0 && (
                        <Typography variant="body2" color="error">
                            Failed: {creationResults.filter(r => !r.success).length} bookings
                        </Typography>
                    )}
                </Alert>
            )}
        </Box>

    )
}

export default StatusDisplay

