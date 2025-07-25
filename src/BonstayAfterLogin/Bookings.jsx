import { Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Link as MuiLink, CircularProgress, Alert, Tabs, Tab, Box, Chip, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getApiUrl } from '../config/apiConfig';
import { useUserBookings, useHotels } from '../hooks/useSWRData';

const Bookings = ({ userId }) => { // Destructure userId prop here
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // State for confirmation dialog
    const [selectedBookingId, setSelectedBookingId] = useState(null); // Store the ID of the selected booking to be canceled
    const [cancellationReason, setCancellationReason] = useState(''); // Store cancellation reason
    const [tabValue, setTabValue] = useState(0); // State for tab switching
    const navigate = useNavigate();

    // Use SWR hooks for data fetching
    const { data: bookings, error: bookingsError, isLoading: bookingsLoading, mutate: mutateBookings } = useUserBookings(userId);
    const { data: hotels, error: hotelsError, isLoading: hotelsLoading } = useHotels();

    // Create a map of hotel IDs to hotel names for easy lookup (must be called before any early returns)
    const hotelMap = React.useMemo(() => {
        if (!hotels) return {};
        const map = {};
        hotels.forEach((hotel) => {
            // console.log(`Mapping hotel ID: ${hotel.id} => Hotel Name: ${hotel.hotelName}`);
            map[String(hotel.id)] = hotel.hotelName; // Ensure hotelId is treated as a string
        });
        return map;
    }, [hotels]);

    // Separate bookings into active, past, and cancelled based on status and dates
    const { activeBookings, pastBookings, cancelledBookings } = React.useMemo(() => {
        if (!bookings) return { activeBookings: [], pastBookings: [], cancelledBookings: [] };
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        
        const active = [];
        const past = [];
        const cancelled = [];
        
        bookings.forEach(booking => {
            const bookingStatus = booking.bookingStatus || booking.status || 'confirmed';
            
            // Check if booking is cancelled
            if (bookingStatus === 'cancelled' || bookingStatus === 'canceled') {
                cancelled.push(booking);
                return;
            }
            
            // For non-cancelled bookings, check dates
            const checkOutDate = new Date(booking.checkOut || booking.endDate);
            checkOutDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
            
            if (checkOutDate >= today) {
                active.push(booking);
            } else {
                past.push(booking);
            }
        });
        
        // Sort active bookings by check-in date (nearest first)
        active.sort((a, b) => new Date(a.checkIn || a.startDate) - new Date(b.checkIn || b.startDate));
        
        // Sort past bookings by check-out date (most recent first)
        past.sort((a, b) => new Date(b.checkOut || b.endDate) - new Date(a.checkOut || a.endDate));
        
        // Sort cancelled bookings by last modified date (most recent first)
        cancelled.sort((a, b) => new Date(b.lastModified || b.bookingDate || b.createdAt) - new Date(a.lastModified || a.bookingDate || a.createdAt));
        
        return { activeBookings: active, pastBookings: past, cancelledBookings: cancelled };
    }, [bookings]);

    // Check for loading states
    if (bookingsLoading || hotelsLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading bookings...</Typography>
            </Container>
        );
    }

    // Check for errors
    if (bookingsError || hotelsError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    Error loading data: {bookingsError?.message || hotelsError?.message}
                </Alert>
            </Container>
        );
    }

    console.log(`Found ${bookings?.length || 0} bookings for user ${userId}`);
    console.log(`Active bookings: ${activeBookings.length}, Past bookings: ${pastBookings.length}, Cancelled bookings: ${cancelledBookings.length}`);

    const handleCancelBooking = async (bookingId) => {
        try {
            // Instead of deleting, update the booking status to cancelled
            const bookingToCancel = bookings.find(booking => booking.id === bookingId);
            if (!bookingToCancel) {
                setCancelError('Booking not found.');
                return;
            }

            const updatedBooking = {
                ...bookingToCancel,
                bookingStatus: 'cancelled',
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'user',
                lastModified: new Date().toISOString(),
                cancellationReason: cancellationReason || 'Cancelled by user'
            };

            await axios.put(getApiUrl(`/bookings/${bookingId}`), updatedBooking);
            
            // Refresh bookings data after cancellation
            mutateBookings();
            setCancelSuccess(`Booking cancelled successfully! Booking ID: ${bookingId}`);
            setDialogOpen(false); // Close the confirmation dialog
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setCancelError('Error canceling booking. Please try again later.');
        }
    };

    // Open the confirmation dialog
    const openConfirmationDialog = (bookingId) => {
        setSelectedBookingId(bookingId);
        setDialogOpen(true);
    };

    // Close the confirmation dialog
    const closeConfirmationDialog = () => {
        setDialogOpen(false);
        setSelectedBookingId(null);
        setCancellationReason(''); // Reset cancellation reason
    };

    // Export to Excel (with filtering by current tab)
    const handleExportExcel = () => {
        let currentBookings, fileName, sheetName;
        
        if (tabValue === 0) {
            currentBookings = activeBookings;
            fileName = 'active-bookings.xlsx';
            sheetName = 'Active Bookings';
        } else if (tabValue === 1) {
            currentBookings = pastBookings;
            fileName = 'booking-history.xlsx';
            sheetName = 'Booking History';
        } else {
            currentBookings = cancelledBookings;
            fileName = 'cancelled-bookings.xlsx';
            sheetName = 'Cancelled Bookings';
        }
        
        const data = currentBookings.map((booking) => ({
            'Booking ID': booking.id,
            'Booking Reference': booking.bookingReference || 'N/A',
            'Hotel Name': hotelMap[String(booking.hotelId)] || 'Unknown Hotel',
            'Check-In Date': booking.checkIn || booking.startDate,
            'Check-Out Date': booking.checkOut || booking.endDate,
            'Nights': booking.nights || 'N/A',
            'Number of Guests': booking.guests || booking.noOfPersons,
            'Number of Rooms': booking.rooms || booking.noOfRooms,
            'Room Type': booking.roomTypeName || booking.roomType || booking.typeOfRoom,
            'Total Amount': booking.totalAmount ? `₹${booking.totalAmount}` : 'N/A',
            'Payment Status': booking.paymentStatus || 'N/A',
            'Booking Status': booking.bookingStatus || booking.status || 'confirmed',
            ...(tabValue === 2 && {
                'Cancellation Date': booking.cancelledAt || booking.cancellationDate || booking.lastModified || 'N/A',
                'Cancelled By': booking.cancelledBy || 'N/A',
                'Cancellation Reason': booking.cancellationReason || 'N/A'
            })
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Save as Excel file
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelFile], { type: 'application/octet-stream' }), fileName);
    };

    // Print the page (with filtering by current tab)
    const handlePrint = () => {
        const printContent = document.getElementById('printable-bookings');
        let title;
        if (tabValue === 0) {
            title = 'Active Bookings';
        } else if (tabValue === 1) {
            title = 'Booking History';
        } else {
            title = 'Cancelled Bookings';
        }
        
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .booking-card { border: 1px solid #ddd; margin: 10px; padding: 15px; border-radius: 5px; }
                        .no-print { display: none; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${title}</h2>
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Helper function to determine if booking is currently active (check-in has passed but check-out hasn't)
    const getBookingCurrentStatus = (booking) => {
        const today = new Date();
        const checkIn = new Date(booking.checkIn || booking.startDate);
        const checkOut = new Date(booking.checkOut || booking.endDate);
        
        if (today < checkIn) {
            return { status: 'upcoming', color: 'info', label: 'Upcoming' };
        } else if (today >= checkIn && today < checkOut) {
            return { status: 'current', color: 'success', label: 'Current Stay' };
        } else {
            return { status: 'completed', color: 'default', label: 'Completed' };
        }
    };

    // Render booking card component
    const renderBookingCard = (booking, isPastBooking = false, isCancelledBooking = false) => {
        const hotelName = booking.hotelName || hotelMap[String(booking.hotelId)] || 'Unknown Hotel';
        const isEnhancedBooking = booking.bookingReference;
        const currentStatus = getBookingCurrentStatus(booking);
        
        return (
            <div key={booking.id} className="col">
                <div className={`card h-100 shadow-sm ${isCancelledBooking ? 'border-danger' : ''}`}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{hotelName}</h5>
                            <div>
                                {isEnhancedBooking && (
                                    <span className={`badge ${isCancelledBooking ? 'bg-danger' : 'bg-primary'} me-2`}>
                                        {booking.bookingStatus || 'confirmed'}
                                    </span>
                                )}
                                <Chip 
                                    label={isCancelledBooking ? 'Cancelled' : currentStatus.label} 
                                    color={isCancelledBooking ? 'error' : currentStatus.color} 
                                    size="small"
                                />
                            </div>
                        </div>
                        
                        {/* Enhanced booking display */}
                        {isEnhancedBooking ? (
                            <>
                                <p className="text-muted mb-2">
                                    <small>Booking Reference: {booking.bookingReference}</small>
                                </p>
                                <div className="row">
                                    <div className="col-6">
                                        <p><b>Check-in:</b><br/>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                        <p><b>Check-out:</b><br/>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                        <p><b>Guests:</b> {booking.guests}</p>
                                    </div>
                                    <div className="col-6">
                                        <p><b>Nights:</b> {booking.nights}</p>
                                        <p><b>Rooms:</b> {booking.rooms}</p>
                                        <p><b>Room Type:</b><br/>{booking.roomTypeName}</p>
                                    </div>
                                </div>
                                
                                {/* Pricing Information */}
                                <div className="mt-3 p-2 bg-light rounded">
                                    <div className="d-flex justify-content-between">
                                        <span>Room Cost:</span>
                                        <span>₹{booking.totalRoomCost?.toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Taxes:</span>
                                        <span>₹{booking.taxes?.toLocaleString()}</span>
                                    </div>
                                    <hr className="my-1"/>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total Amount:</span>
                                        <span className="text-success">₹{booking.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    {booking.paymentStatus && (
                                        <div className="text-center mt-2">
                                            <span className={`badge ${
                                                booking.paymentStatus === 'paid' ? 'bg-success' : 
                                                booking.paymentStatus === 'partial' ? 'bg-warning' : 'bg-danger'
                                            }`}>
                                                Payment: {booking.paymentStatus}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Special Requests */}
                                {booking.specialRequests && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            <b>Special Requests:</b> {booking.specialRequests}
                                        </small>
                                    </div>
                                )}
                                
                                {/* Cancellation Info for enhanced bookings */}
                                {isCancelledBooking && (
                                    <div className="mt-2 p-2 bg-light border-start border-danger border-3">
                                        <small className="text-danger">
                                            <b>Cancellation Details:</b>
                                        </small>
                                        {booking.cancelledAt && (
                                            <div><small className="text-muted">Date: {new Date(booking.cancelledAt).toLocaleDateString()}</small></div>
                                        )}
                                        {booking.cancellationDate && !booking.cancelledAt && (
                                            <div><small className="text-muted">Date: {new Date(booking.cancellationDate).toLocaleDateString()}</small></div>
                                        )}
                                        {booking.cancelledBy && (
                                            <div><small className="text-muted">Cancelled by: {booking.cancelledBy}</small></div>
                                        )}
                                        {booking.cancellationReason && (
                                            <div><small className="text-muted">Reason: {booking.cancellationReason}</small></div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Legacy booking display */
                            <>
                                <p><b>Booking Id:</b> {booking.id}</p>
                                <p><b>Check-In Date:</b> {booking.checkIn || booking.startDate}</p>
                                <p><b>Check-Out Date:</b> {booking.checkOut || booking.endDate}</p>
                                <p><b>Number of Persons:</b> {booking.guests || booking.noOfPersons}</p>
                                <p><b>Number of Rooms:</b> {booking.noOfRooms}</p>
                                <p><b>Type of Room:</b> {booking.roomType || booking.typeOfRoom}</p>
                            </>
                        )}
                    </div>
                    <div className="card-footer">
                        <div className="d-grid gap-2">
                            {!isPastBooking && !isCancelledBooking && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => navigate(`/reschedule/${booking.id}`)}
                                >
                                    Reschedule Booking
                                </Button>
                            )}
                            {!isPastBooking && !isCancelledBooking && currentStatus.status !== 'completed' && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => openConfirmationDialog(booking.id)}
                                >
                                    Cancel Booking
                                </Button>
                            )}
                            {isPastBooking && (
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 1 }}>
                                    Booking Completed
                                </Typography>
                            )}
                            {isCancelledBooking && (
                                <Box sx={{ textAlign: 'center', py: 1 }}>
                                    <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                                        <strong>Booking Cancelled</strong>
                                    </Typography>
                                    {booking.cancelledAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            Cancelled on: {new Date(booking.cancelledAt).toLocaleDateString()}
                                        </Typography>
                                    )}
                                    {booking.cancellationDate && !booking.cancelledAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            Cancelled on: {new Date(booking.cancellationDate).toLocaleDateString()}
                                        </Typography>
                                    )}
                                    {booking.cancelledBy && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Cancelled by: {booking.cancelledBy}
                                        </Typography>
                                    )}
                                    {booking.cancellationReason && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Reason: {booking.cancellationReason}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container className="text-center">
            <Typography variant="h3" color="primary" gutterBottom>
                My Bookings
            </Typography>
            
            {cancelSuccess && <Alert severity="success" sx={{ mb: 2 }}>{cancelSuccess}</Alert>}
            {cancelError && <Alert severity="error" sx={{ mb: 2 }}>{cancelError}</Alert>}

            {/* Tabs for Active, Past, and Cancelled Bookings */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={(event, newValue) => setTabValue(newValue)}
                    centered
                >
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                Active Bookings 
                                {activeBookings.length > 0 && (
                                    <Chip label={activeBookings.length} size="small" color="primary" />
                                )}
                            </Box>
                        } 
                    />
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                Booking History 
                                {pastBookings.length > 0 && (
                                    <Chip label={pastBookings.length} size="small" color="default" />
                                )}
                            </Box>
                        } 
                    />
                    <Tab 
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                Cancelled Bookings 
                                {cancelledBookings.length > 0 && (
                                    <Chip label={cancelledBookings.length} size="small" color="error" />
                                )}
                            </Box>
                        } 
                    />
                </Tabs>
            </Box>

            {/* Export and Print buttons */}
            <Box sx={{ mb: 3 }}>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleExportExcel} 
                    sx={{ m: 1 }}
                    disabled={
                        (tabValue === 0 ? activeBookings.length : 
                         tabValue === 1 ? pastBookings.length : 
                         cancelledBookings.length) === 0
                    }
                >
                    Export to Excel ({tabValue === 0 ? 'Active' : tabValue === 1 ? 'History' : 'Cancelled'})
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handlePrint} 
                    sx={{ m: 1 }}
                    disabled={
                        (tabValue === 0 ? activeBookings.length : 
                         tabValue === 1 ? pastBookings.length : 
                         cancelledBookings.length) === 0
                    }
                >
                    Print {tabValue === 0 ? 'Active Bookings' : tabValue === 1 ? 'History' : 'Cancelled'}
                </Button>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && (
                /* Active Bookings Tab */
                <Box>
                    {activeBookings.length > 0 ? (
                        <div id="printable-bookings" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {activeBookings.map((booking) => renderBookingCard(booking, false))}
                        </div>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                No Active Bookings
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                You don't have any upcoming or current bookings.
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => navigate('/hotels')}
                            >
                                Book a Hotel
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            {tabValue === 1 && (
                /* Past Bookings Tab */
                <Box>
                    {pastBookings.length > 0 ? (
                        <div id="printable-bookings" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {pastBookings.map((booking) => renderBookingCard(booking, true))}
                        </div>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                No Booking History
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                You haven't completed any stays yet.
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => navigate('/hotels')}
                            >
                                Make Your First Booking
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            {tabValue === 2 && (
                /* Cancelled Bookings Tab */
                <Box>
                    {cancelledBookings.length > 0 ? (
                        <div id="printable-bookings" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {cancelledBookings.map((booking) => renderBookingCard(booking, false, true))}
                        </div>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                No Cancelled Bookings
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                You don't have any cancelled bookings.
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => navigate('/hotels')}
                            >
                                Book a Hotel
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={closeConfirmationDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" color="error">
                        Confirm Booking Cancellation
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                        Are you sure you want to cancel this booking?
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>Note:</strong> Once cancelled, this booking will be moved to your cancelled bookings list. 
                            Please check the cancellation policy for any applicable fees.
                        </Typography>
                    </Alert>
                    <TextField
                        fullWidth
                        label="Reason for Cancellation (Optional)"
                        placeholder="E.g., Change of plans, Emergency, etc."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        multiline
                        rows={3}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmationDialog} color="primary">
                        Keep Booking
                    </Button>
                    <Button
                        onClick={() => handleCancelBooking(selectedBookingId)}
                        color="error"
                        variant="contained"
                    >
                        Cancel Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Bookings;
