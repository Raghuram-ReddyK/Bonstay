import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Alert,
    Card,
    CardContent,
    Box,
    Grid,
    Chip,
    Divider,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    CalendarToday,
    Hotel,
    Person,
    Payment,
    Info,
    CheckCircle,
    Warning,
    ArrowBack,
    Preview
} from '@mui/icons-material';
import { getApiUrl } from '../config/apiConfig';
import axios from 'axios';

const ReSchedule = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [newBookingDetails, setNewBookingDetails] = useState(null);

    // Calculate new booking details
    const calculateNewBookingDetails = () => {
        if (!startDate || !endDate || !bookingData.pricePerNight) return null;

        const checkInDate = new Date(startDate);
        const checkOutDate = new Date(endDate);
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const newNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const pricePerNight = bookingData.pricePerNight || 0;
        const rooms = bookingData.rooms || 1;
        const newTotalRoomCost = pricePerNight * newNights * rooms;
        const taxRate = bookingData.taxes && bookingData.totalRoomCost
            ? bookingData.taxes / bookingData.totalRoomCost
            : 0.18;
        const newTaxes = Math.round(newTotalRoomCost * taxRate);
        const newTotalAmount = newTotalRoomCost + newTaxes;

        return {
            nights: newNights,
            totalRoomCost: newTotalRoomCost,
            taxes: newTaxes,
            totalAmount: newTotalAmount,
            costDifference: newTotalAmount - (bookingData.totalAmount || 0)
        };
    };

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const response = await axios.get(getApiUrl(`/bookings/${id}`));
                setBookingData(response.data);

                // Handle both admin-created bookings (checkIn/checkOut) and user-created bookings (startDate/endDate)
                const startDateValue = response.data.checkIn || response.data.startDate;
                const endDateValue = response.data.checkOut || response.data.endDate;

                if (startDateValue && endDateValue) {
                    setStartDate(startDateValue);
                    setEndDate(endDateValue);
                } else {
                    console.error('Missing date fields in booking data:', response.data);
                    setError('Invalid booking data: missing date fields.');
                }
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setError('An error occurred while fetching booking data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBooking();
        }
    }, [id]);

    const validateForm = () => {
        let isValid = true;
        setErrorMessage('');

        if (!startDate) {
            isValid = false;
            setErrorMessage('Check-in date is required');
        } else if (new Date(startDate) < new Date()) {
            isValid = false;
            setErrorMessage('Check-in date must be in the future');
        }

        if (!endDate) {
            isValid = false;
            setErrorMessage('Check-out date is required');
        } else if (new Date(endDate) <= new Date(startDate)) {
            isValid = false;
            setErrorMessage('Check-out date must be after the check-in date');
        }

        // Check if dates are actually different from current booking
        const currentCheckIn = bookingData.checkIn || bookingData.startDate;
        const currentCheckOut = bookingData.checkOut || bookingData.endDate;

        if (startDate === currentCheckIn && endDate === currentCheckOut) {
            isValid = false;
            setErrorMessage('Please select different dates to reschedule');
        }

        return isValid;
    };

    const handlePreview = () => {
        if (validateForm()) {
            const details = calculateNewBookingDetails();
            setNewBookingDetails(details);
            setConfirmDialog(true);
        }
    };

    const handleConfirmReschedule = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const details = calculateNewBookingDetails();

            // Create updated booking with proper field names and new calculations
            const updatedBooking = {
                ...bookingData,
                lastModified: new Date().toISOString(),
                modifiedBy: 'user',
                rescheduleReason: 'User requested reschedule',
                nights: details.nights,
                totalRoomCost: details.totalRoomCost,
                taxes: details.taxes,
                totalAmount: details.totalAmount
            };

            // Check if original booking used checkIn/checkOut (admin-created) or startDate/endDate (user-created)
            if (bookingData.checkIn !== undefined || bookingData.checkOut !== undefined) {
                updatedBooking.checkIn = startDate;
                updatedBooking.checkOut = endDate;
            } else {
                updatedBooking.startDate = startDate;
                updatedBooking.endDate = endDate;
            }

            const response = await axios.put(getApiUrl(`/bookings/${id}`), updatedBooking);

            if (response.status === 200) {
                setError('');
                setErrorMessage('');
                setConfirmDialog(false);
                setSuccess(`Booking successfully rescheduled! New dates: ${startDate} to ${endDate}. ${details.costDifference !== 0 ? `Cost ${details.costDifference > 0 ? 'increased' : 'decreased'} by ₹${Math.abs(details.costDifference).toLocaleString()}` : 'No cost change'}`);

                // Redirect to bookings page after 3 seconds
                setTimeout(() => {
                    navigate('/bookings');
                }, 3000);
            } else {
                setError(response.data.error || 'An error occurred while rescheduling.');
            }
        } catch (error) {
            console.error('Error rescheduling:', error);
            setError('An error occurred while rescheduling. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading booking details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={3}>
                <Tooltip title="Back to Bookings">
                    <IconButton onClick={() => navigate('/bookings')} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                </Tooltip>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Reschedule Booking
                </Typography>
                <Chip
                    label={`ID: ${bookingData.id || 'N/A'}`}
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 2 }}
                />
            </Box>

            {/* Alerts */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Current Booking Details */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Info color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Current Booking Details
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Hotel sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>{bookingData.hotelName || 'Hotel Name'}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Check-in</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {bookingData.checkIn || bookingData.startDate || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Check-out</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {bookingData.checkOut || bookingData.endDate || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Nights</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {bookingData.nights || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Guests</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {bookingData.guests || bookingData.adults || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Rooms</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {bookingData.rooms || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Room Type</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {bookingData.roomTypeName || bookingData.typeOfRoom || 'N/A'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" alignItems="center" justifyContent="between">
                                        <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            ₹{(bookingData.totalAmount || 0).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Chip
                                        label={bookingData.bookingStatus || bookingData.status || 'confirmed'}
                                        color={
                                            (bookingData.bookingStatus || bookingData.status) === 'confirmed'
                                                ? 'success'
                                                : 'default'
                                        }
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reschedule Form */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <CalendarToday color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Select New Dates
                                </Typography>
                            </Box>

                            <Box component="form" sx={{ mt: 2 }}>
                                <TextField
                                    label="New Check-in Date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{
                                        min: new Date().toISOString().split('T')[0]
                                    }}
                                    required
                                />

                                <TextField
                                    label="New Check-out Date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{
                                        min: startDate || new Date().toISOString().split('T')[0]
                                    }}
                                    required
                                />

                                {/* Live Preview */}
                                {startDate && endDate && (() => {
                                    const newDetails = calculateNewBookingDetails();
                                    return newDetails ? (
                                        <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                📋 New Booking Preview
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2">
                                                        <strong>Nights:</strong> {newDetails.nights}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2">
                                                        <strong>Room Cost:</strong> ₹{newDetails.totalRoomCost.toLocaleString()}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2">
                                                        <strong>Taxes:</strong> ₹{newDetails.taxes.toLocaleString()}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2">
                                                        <strong>New Total:</strong> ₹{newDetails.totalAmount.toLocaleString()}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Divider sx={{ my: 1, bgcolor: 'primary.contrastText' }} />
                                                    <Typography variant="body2" align="center">
                                                        {newDetails.costDifference > 0 && '📈 '}
                                                        {newDetails.costDifference < 0 && '📉 '}
                                                        {newDetails.costDifference === 0 && '➡️ '}
                                                        Cost {newDetails.costDifference > 0 ? 'increase' : newDetails.costDifference < 0 ? 'decrease' : 'unchanged'}:
                                                        {newDetails.costDifference !== 0 && ` ₹${Math.abs(newDetails.costDifference).toLocaleString()}`}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    ) : null;
                                })()}

                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Preview />}
                                        onClick={handlePreview}
                                        disabled={!startDate || !endDate}
                                        fullWidth
                                    >
                                        Preview Changes
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Warning color="warning" sx={{ mr: 1 }} />
                        Confirm Reschedule
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Please confirm the changes to your booking:
                    </Typography>

                    {newBookingDetails && (
                        <Box sx={{ mt: 2 }}>
                            <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" gutterBottom>📅 Date Changes:</Typography>
                                <Typography variant="body2">
                                    <strong>From:</strong> {bookingData.checkIn || bookingData.startDate} to {bookingData.checkOut || bookingData.endDate} ({bookingData.nights} nights)
                                </Typography>
                                <Typography variant="body2">
                                    <strong>To:</strong> {startDate} to {endDate} ({newBookingDetails.nights} nights)
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="subtitle2" gutterBottom>💰 Cost Impact:</Typography>
                                <Typography variant="body2">
                                    <strong>Previous Total:</strong> ₹{(bookingData.totalAmount || 0).toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>New Total:</strong> ₹{newBookingDetails.totalAmount.toLocaleString()}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={newBookingDetails.costDifference > 0 ? 'error' : newBookingDetails.costDifference < 0 ? 'success' : 'text.primary'}
                                    fontWeight="bold"
                                >
                                    <strong>Difference:</strong> {newBookingDetails.costDifference > 0 ? '+' : ''}₹{newBookingDetails.costDifference.toLocaleString()}
                                </Typography>
                            </Paper>

                            {newBookingDetails.costDifference !== 0 && (
                                <Alert severity={newBookingDetails.costDifference > 0 ? 'warning' : 'info'} sx={{ mt: 2 }}>
                                    {newBookingDetails.costDifference > 0
                                        ? `Additional payment of ₹${newBookingDetails.costDifference.toLocaleString()} will be required.`
                                        : `You will receive a refund of ₹${Math.abs(newBookingDetails.costDifference).toLocaleString()}.`
                                    }
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmReschedule}
                        variant="contained"
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
                    >
                        {submitting ? 'Rescheduling...' : 'Confirm Reschedule'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReSchedule;
