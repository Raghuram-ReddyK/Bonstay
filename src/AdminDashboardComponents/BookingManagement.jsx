import React, { useState } from 'react';
import {
    Chip,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Alert,
    Box,
    TextField,
    Grid,
    Paper,
    InputAdornment,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import CustomDataGrid from '../CommonComponents/CustomDataGrid';
import ExcelExport from '../CommonComponents/ExcelExport';
import { getApiUrl } from '../config/apiConfig';

const BookingManagement = ({ allBookings, isLoading, getHotelName, getRoomsCount, onBookingCancelled }) => {
    const [cancelDialog, setCancelDialog] = useState(false);
    const [rescheduleDialog, setRescheduleDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState('');
    const [cancelError, setCancelError] = useState('');
    const [rescheduleSuccess, setRescheduleSuccess] = useState('');
    const [rescheduleError, setRescheduleError] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [rescheduling, setRescheduling] = useState(false);
    const [newCheckIn, setNewCheckIn] = useState('');
    const [newCheckOut, setNewCheckOut] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Debug: Log the bookings data
    console.log('BookingManagement - All Bookings:', allBookings);
    console.log('BookingManagement - Bookings Count:', allBookings?.length || 0);

    // Filter bookings based on search and status
    const filteredBookings = React.useMemo(() => {
        if (!allBookings) return [];

        return allBookings.filter(booking => {
            // Status filter
            if (statusFilter !== 'all') {
                const bookingStatus = booking.bookingStatus || booking.status || 'confirmed';
                if (statusFilter !== bookingStatus.toLowerCase()) return false;
            }

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const searchableFields = [
                    booking.id,
                    booking.bookingReference,
                    booking.userId,
                    booking.userName,
                    booking.userEmail,
                    getHotelName(booking),
                    booking.roomTypeName,
                    booking.bookingStatus || booking.status
                ].filter(Boolean).map(field => String(field).toLowerCase());

                return searchableFields.some(field => field.includes(searchLower));
            }

            return true;
        });
    }, [allBookings, searchTerm, statusFilter, getHotelName]);


    // Calculate new nights and costs preview
    const calculateNewBookingDetails = () => {
        if (!newCheckIn || !newCheckOut || !selectedBooking) return null;

        const checkInDate = new Date(newCheckIn);
        const checkOutDate = new Date(newCheckOut);
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const newNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const pricePerNight = selectedBooking.pricePerNight || 0;
        const rooms = selectedBooking.rooms || 1;
        const newTotalRoomCost = pricePerNight * newNights * rooms;
        const taxRate = selectedBooking.taxes && selectedBooking.totalRoomCost
            ? selectedBooking.taxes / selectedBooking.totalRoomCost
            : 0.18;
        const newTaxes = Math.round(newTotalRoomCost * taxRate);
        const newTotalAmount = newTotalRoomCost + newTaxes;

        return {
            nights: newNights,
            totalRoomCost: newTotalRoomCost,
            taxes: newTaxes,
            totalAmount: newTotalAmount
        };
    };

    // Excel export headers configuration
    const bookingExportHeaders = [
        { key: 'id', label: 'Booking ID' },
        { key: 'userId', label: 'User ID' },
        {
            key: 'hotelName',
            label: 'Hotel Name',
            transform: (value, item) => getHotelName(item)
        },
        {
            key: 'checkIn',
            label: 'Check-in Date',
            transform: (value, item) => item.checkIn || item.startDate || 'N/A'
        },
        {
            key: 'checkOut',
            label: 'Check-out Date',
            transform: (value, item) => item.checkOut || item.endDate || 'N/A'
        },
        {
            key: 'nights',
            label: 'Number of Nights',
            transform: (value, item) => {
                if (item.nights) return item.nights;
                const checkIn = item.checkIn || item.startDate;
                const checkOut = item.checkOut || item.endDate;
                if (checkIn && checkOut) {
                    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
                    return Math.ceil(diff / (1000 * 3600 * 24));
                }
                return 'N/A';
            }
        },
        {
            key: 'guests',
            label: 'Number of Guests',
            transform: (value, item) => item.guests || item.noOfPersons || 1
        },
        {
            key: 'rooms',
            label: 'Number of Rooms',
            transform: (value, item) => getRoomsCount(item)
        },
        {
            key: 'roomType',
            label: 'Room Type',
            transform: (value, item) => item.roomType || item.typeOfRoom || 'N/A'
        },
        {
            key: 'totalAmount',
            label: 'Total Amount',
            transform: (value, item) => item.totalAmount ? `₹${item.totalAmount.toLocaleString()}` : 'N/A'
        },
        {
            key: 'status',
            label: 'Status',
            transform: (value, item) => item.bookingStatus || item.status || 'confirmed'
        },
        {
            key: 'bookingDate',
            label: 'Booking Date',
            transform: (value, item) => item.bookingDate || item.createdAt || 'N/A'
        },
        {
            key: 'createdBy',
            label: 'Created By',
            transform: (value, item) => item.createdBy || 'user'
        },
        {
            key: 'cancelledAt',
            label: 'Cancellation Date',
            transform: (value, item) => {
                const status = item.bookingStatus || item.status || 'confirmed';
                if (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled') {
                    return item.cancelledAt || item.cancellationDate || 'N/A';
                }
                return '';
            }
        },
        {
            key: 'cancelledBy',
            label: 'Cancelled By',
            transform: (value, item) => {
                const status = item.bookingStatus || item.status || 'confirmed';
                if (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled') {
                    return item.cancelledBy || 'N/A';
                }
                return '';
            }
        },
        {
            key: 'cancellationReason',
            label: 'Cancellation Reason',
            transform: (value, item) => {
                const status = item.bookingStatus || item.status || 'confirmed';
                if (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled') {
                    return item.cancellationReason || 'N/A';
                }
                return '';
            }
        }

    ];

    // Open cancel confirmation dialog
    const openCancelDialog = (booking) => {
        setSelectedBooking(booking);
        setCancelDialog(true);
        setCancelSuccess('');
        setCancelError('');
    };

    // Open reschedule dialog
    const openRescheduleDialog = (booking) => {
        setSelectedBooking(booking);
        setRescheduleDialog(true);
        setRescheduleSuccess('');
        setRescheduleError('');

        // Set current dates as default values
        const checkInDate = booking.checkIn || booking.startDate;
        const checkOutDate = booking.checkOut || booking.endDate;

        if (checkInDate) {
            setNewCheckIn(new Date(checkInDate).toISOString().split('T')[0]);
        }
        if (checkOutDate) {
            setNewCheckOut(new Date(checkOutDate).toISOString().split('T')[0]);
        }
    };

    // Close cancel confirmation dialog
    const closeCancelDialog = () => {
        setCancelDialog(false);
        setSelectedBooking(null);
    };

    // Close reschedule dialog
    const closeRescheduleDialog = () => {
        setRescheduleDialog(false);
        setSelectedBooking(null);
        setNewCheckIn('');
        setNewCheckOut('');
    };

    // Handle admin booking cancellation
    const handleAdminCancelBooking = async () => {
        if (!selectedBooking) return;

        setCancelling(true);
        try {
            // Instead of deleting, update the booking status to cancelled
            const updatedBooking = {
                ...selectedBooking,
                bookingStatus: 'cancelled',
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'admin',
                lastModified: new Date().toISOString(),
                cancellationReason: 'Cancelled by admin'
            };

            await axios.put(getApiUrl(`/bookings/${selectedBooking.id}`), updatedBooking);

            setCancelSuccess(`Booking ${selectedBooking.id} cancelled successfully by admin!`);
            setCancelDialog(false);
            setSelectedBooking(null);

            // Refresh bookings data using SWR mutate
            if (onBookingCancelled) {
                onBookingCancelled();
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setCancelError('Failed to cancel booking. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    // Handle admin booking reschedule
    const handleAdminRescheduleBooking = async () => {
        if (!selectedBooking || !newCheckIn || !newCheckOut) return;

        // Validate dates
        if (new Date(newCheckIn) >= new Date(newCheckOut)) {
            setRescheduleError('Check-out date must be after check-in date.');
            return;
        }

        if (new Date(newCheckIn) < new Date()) {
            setRescheduleError('Check-in date cannot be in the past.');
            return;
        }

        setRescheduling(true);
        try {
            // Calculate new number of nights
            const checkInDate = new Date(newCheckIn);
            const checkOutDate = new Date(newCheckOut);
            const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
            const newNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // Calculate new total costs based on new nights
            const pricePerNight = selectedBooking.pricePerNight || 0;
            const newTotalRoomCost = pricePerNight * newNights * (selectedBooking.rooms || 1);
            const taxRate = selectedBooking.taxes && selectedBooking.totalRoomCost
                ? selectedBooking.taxes / selectedBooking.totalRoomCost
                : 0.18; // Default 18% tax
            const newTaxes = Math.round(newTotalRoomCost * taxRate);
            const newTotalAmount = newTotalRoomCost + newTaxes;

            const updatedBooking = {
                ...selectedBooking,
                checkIn: newCheckIn,
                checkOut: newCheckOut,
                startDate: newCheckIn, // Handle both field names
                endDate: newCheckOut,
                nights: newNights,
                totalRoomCost: newTotalRoomCost,
                taxes: newTaxes,
                totalAmount: newTotalAmount,
                lastModified: new Date().toISOString(),
                modifiedBy: 'admin',
                rescheduleReason: 'Admin rescheduled on user request'
            };

            await axios.put(getApiUrl(`/bookings/${selectedBooking.id}`), updatedBooking);

            // Dynamic success message with user information
            const userInfo = selectedBooking.userName || `User ${selectedBooking.userId}`;
            const oldNights = selectedBooking.nights || 0;
            setRescheduleSuccess(
                `Booking ${selectedBooking.id} successfully rescheduled for ${userInfo}! ` +
                `Updated from ${oldNights} nights to ${newNights} nights. ` +
                `New total: ₹${newTotalAmount.toLocaleString()}`
            );

            setRescheduleDialog(false);
            setSelectedBooking(null);
            setNewCheckIn('');
            setNewCheckOut('');

            // Refresh bookings data to show updated information
            if (onBookingCancelled) {
                onBookingCancelled();
            }
        } catch (error) {
            console.error('Error rescheduling booking:', error);
            setRescheduleError('Failed to reschedule booking. Please try again.');
        } finally {
            setRescheduling(false);
        }
    };
    return (
        <Box>
            {/* Debug Information */}
            {process.env.NODE_ENV === 'development' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Debug Info:</strong> Total bookings in database: {allBookings?.length || 0},
                    Filtered bookings: {filteredBookings.length},
                    Loading: {isLoading ? 'Yes' : 'No'}
                </Alert>
            )}

            {/* Success/Error Messages */}
            {cancelSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setCancelSuccess('')}>
                    {cancelSuccess}
                </Alert>
            )}
            {cancelError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setCancelError('')}>
                    {cancelError}
                </Alert>
            )}
            {rescheduleSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setRescheduleSuccess('')}>
                    {rescheduleSuccess}
                </Alert>
            )}
            {rescheduleError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setRescheduleError('')}>
                    {rescheduleError}
                </Alert>
            )}

            {/* Search and Filter Controls */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search by Booking ID, User, Email, Hotel, or Status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <Button
                                            size="small"
                                            onClick={() => setSearchTerm('')}
                                            sx={{ minWidth: 'auto', p: 0.5 }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </Button>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status Filter"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {filteredBookings.length} of {allBookings?.length || 0} bookings
                            </Typography>
                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    sx={{ mt: 0.5 }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Empty State */}
            {!isLoading && filteredBookings.length === 0 && (
                <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {allBookings?.length === 0 ? 'No Bookings Found' : 'No Results Found'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {allBookings?.length === 0
                            ? 'There are no bookings in the system yet.'
                            : 'Try adjusting your search terms or filters to find bookings.'
                        }
                    </Typography>
                    {(searchTerm || statusFilter !== 'all') && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </Paper>
            )}


            <CustomDataGrid
                rows={filteredBookings}
                columns={[
                    {
                        field: 'id',
                        headerName: 'Booking ID',
                        width: 130,
                        sortable: true
                    },
                    {
                        field: 'userId',
                        headerName: 'User ID',
                        width: 120,
                        sortable: true
                    },
                    {
                        field: 'hotelName',
                        headerName: 'Hotel',
                        width: 200,
                        sortable: true,
                        valueGetter: ({ row }) => getHotelName(row)
                    },
                    {
                        field: 'checkIn',
                        headerName: 'Check In',
                        width: 130,
                        sortable: true,
                        valueGetter: ({ row }) => {
                            const dateValue = row.checkIn || row.startDate;
                            if (!dateValue) return 'N/A';

                            try {
                                // If it's an ISO string, format it to readable date
                                if (typeof dateValue === 'string' && dateValue.includes('T')) {
                                    return new Date(dateValue).toLocaleDateString();
                                }
                                return dateValue;
                            } catch (error) {
                                return dateValue;
                            }
                        },
                        sortValueGetter: ({ row }) => {
                            // For sorting, use the raw date value
                            const dateValue = row.checkIn || row.startDate;
                            return dateValue || '';
                        }
                    },
                    {
                        field: 'checkOut',
                        headerName: 'Check Out',
                        width: 130,
                        sortable: true,
                        valueGetter: ({ row }) => {
                            const dateValue = row.checkOut || row.endDate;
                            if (!dateValue) return 'N/A';

                            try {
                                // If it's an ISO string, format it to readable date
                                if (typeof dateValue === 'string' && dateValue.includes('T')) {
                                    return new Date(dateValue).toLocaleDateString();
                                }
                                return dateValue;
                            } catch (error) {
                                return dateValue;
                            }
                        },
                        sortValueGetter: ({ row }) => {
                            // For sorting, use the raw date value
                            const dateValue = row.checkOut || row.endDate;
                            return dateValue || '';
                        }
                    },
                    {
                        field: 'guests',
                        headerName: 'Guests',
                        width: 100,
                        sortable: true,
                        valueGetter: ({ row }) => row.guests || row.noOfPersons || 1,
                        sortValueGetter: ({ row }) => Number(row.guests || row.noOfPersons || 1)
                    },
                    {
                        field: 'rooms',
                        headerName: 'Rooms',
                        width: 80,
                        sortable: true,
                        valueGetter: ({ row }) => getRoomsCount(row),
                        sortValueGetter: ({ row }) => Number(getRoomsCount(row))
                    },
                    {
                        field: 'nights',
                        headerName: 'Nights',
                        width: 80,
                        sortable: true,
                        valueGetter: ({ row }) => {
                            if (row.nights) return row.nights;
                            // Calculate nights if not available
                            const checkIn = row.checkIn || row.startDate;
                            const checkOut = row.checkOut || row.endDate;
                            if (checkIn && checkOut) {
                                const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
                                return Math.ceil(diff / (1000 * 3600 * 24));
                            }
                            return 'N/A';
                        },
                        sortValueGetter: ({ row }) => Number(row.nights || 0)
                    },
                    {
                        field: 'status',
                        headerName: 'Status',
                        width: 120,
                        sortable: true,
                        renderCell: ({ row }) => {
                            const status = row.bookingStatus || row.status || 'confirmed';
                            const getStatusColor = (status) => {
                                switch (status.toLowerCase()) {
                                    case 'confirmed': return 'success';
                                    case 'pending': return 'warning';
                                    case 'cancelled': return 'error';
                                    case 'canceled': return 'error';
                                    default: return 'default';
                                }
                            };

                            return (
                                <Chip
                                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                                    color={getStatusColor(status)}
                                    size="small"
                                />
                            );
                        }
                    },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        width: 180,
                        sortable: false,
                        renderCell: ({ row }) => {
                            const bookingStatus = row.bookingStatus || row.status || 'confirmed';
                            const isCancelled = bookingStatus.toLowerCase() === 'cancelled' || bookingStatus.toLowerCase() === 'canceled';

                            if (isCancelled) {
                                const cancellationDetails = [
                                    row.cancelledAt && `Cancelled: ${new Date(row.cancelledAt).toLocaleDateString()}`,
                                    row.cancellationDate && !row.cancelledAt && `Cancelled: ${new Date(row.cancellationDate).toLocaleDateString()}`,
                                    row.cancelledBy && `By: ${row.cancelledBy}`,
                                    row.cancellationReason && `Reason: ${row.cancellationReason}`
                                ].filter(Boolean).join('\n');

                                return (
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip
                                            label="Cancelled"
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                        />
                                        {cancellationDetails && (
                                            <Tooltip title={cancellationDetails} arrow>
                                                <IconButton size="small" color="info">
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                );
                            }

                            return (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => openRescheduleDialog(row)}
                                        sx={{
                                            minWidth: 80,
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => openCancelDialog(row)}
                                        sx={{
                                            minWidth: 80,
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            );
                        }
                    }
                ]}
                pageSize={5}
                pageSizeOptions={[5, 10, 25]}
                loading={isLoading}
                title="Booking Management"
                subtitle={`View and manage all hotel bookings Use search and filters to find specific bookings. Total bookings: ${allBookings?.length || 0}. ${filteredBookings.length !== allBookings?.length ? `Showing ${filteredBookings.length} filtered bookings.` : ''}`}
                actions={
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Total: {filteredBookings.length} bookings
                        </Typography>
                        <ExcelExport
                            data={filteredBookings}
                            headers={bookingExportHeaders}
                            filename="Bookings_Export"
                            sheetName="Bookings"
                            buttonText="Export Filtered Data"
                            onExport={(info) => console.log('Exported:', info)}
                        />
                    </Box>
                }
            />

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialog} onClose={closeCancelDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" color="error">
                        Cancel Booking Confirmation
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to cancel this booking?
                    </Typography>
                    {selectedBooking && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2"><strong>Booking ID:</strong> {selectedBooking.id}</Typography>
                            <Typography variant="body2"><strong>User ID:</strong> {selectedBooking.userId}</Typography>
                            <Typography variant="body2"><strong>Hotel:</strong> {getHotelName(selectedBooking)}</Typography>
                            <Typography variant="body2">
                                <strong>Check-in:</strong> {
                                    selectedBooking.checkIn || selectedBooking.startDate
                                        ? new Date(selectedBooking.checkIn || selectedBooking.startDate).toLocaleDateString()
                                        : 'N/A'
                                }
                            </Typography>
                            <Typography variant="body2">
                                <strong>Check-out:</strong> {
                                    selectedBooking.checkOut || selectedBooking.endDate
                                        ? new Date(selectedBooking.checkOut || selectedBooking.endDate).toLocaleDateString()
                                        : 'N/A'
                                }
                            </Typography>
                        </Box>
                    )}
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Note:</strong> This will mark the booking as cancelled. The booking record will be preserved for reference, but the user will no longer be able to use this booking
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCancelDialog} color="primary">
                        No, Keep Booking
                    </Button>
                    <Button
                        onClick={handleAdminCancelBooking}
                        color="error"
                        variant="contained"
                        disabled={cancelling}
                    >
                        {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reschedule Dialog */}
            <Dialog open={rescheduleDialog} onClose={closeRescheduleDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" color="primary">
                        Reschedule Booking
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                        Update the check-in and check-out dates for this booking:
                    </Typography>

                    {selectedBooking && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2"><strong>Booking ID:</strong> {selectedBooking.id}</Typography>
                            <Typography variant="body2"><strong>User ID:</strong> {selectedBooking.userId}</Typography>
                            <Typography variant="body2"><strong>Hotel:</strong> {getHotelName(selectedBooking)}</Typography>
                            <Typography variant="body2"><strong>Guests:</strong> {selectedBooking.guests || selectedBooking.noOfPersons || 1}</Typography>
                            <Typography variant="body2"><strong>Rooms:</strong> {getRoomsCount(selectedBooking)}</Typography>
                        </Box>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="New Check-in Date"
                                type="date"
                                value={newCheckIn}
                                onChange={(e) => setNewCheckIn(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: new Date().toISOString().split('T')[0], // Minimum today
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="New Check-out Date"
                                type="date"
                                value={newCheckOut}
                                onChange={(e) => setNewCheckOut(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: newCheckIn || new Date().toISOString().split('T')[0], // Minimum check-in date
                                }}
                                required
                            />
                        </Grid>
                    </Grid>

                    {selectedBooking && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                            <Typography variant="caption" color="info.dark">
                                <strong>Current Dates:</strong> {
                                    selectedBooking.checkIn || selectedBooking.startDate
                                        ? new Date(selectedBooking.checkIn || selectedBooking.startDate).toLocaleDateString()
                                        : 'N/A'
                                } to {
                                    selectedBooking.checkOut || selectedBooking.endDate
                                        ? new Date(selectedBooking.checkOut || selectedBooking.endDate).toLocaleDateString()
                                        : 'N/A'
                                } ({selectedBooking.nights || 'N/A'} nights)
                            </Typography>
                        </Box>
                    )}

                    {/* Live Preview of New Booking Details */}
                    {newCheckIn && newCheckOut && (() => {
                        const newDetails = calculateNewBookingDetails();
                        return newDetails ? (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1, border: '1px solid', borderColor: 'success.main' }}>
                                <Typography variant="subtitle2" color="success.dark" gutterBottom>
                                    📋 New Booking Preview:
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="success.dark">
                                            <strong>New Nights:</strong> {newDetails.nights}
                                        </Typography>
                                        <Typography variant="body2" color="success.dark">
                                            <strong>Room Cost:</strong> ₹{newDetails.totalRoomCost.toLocaleString()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="success.dark">
                                            <strong>Taxes:</strong> ₹{newDetails.taxes.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="success.dark">
                                            <strong>New Total:</strong> ₹{newDetails.totalAmount.toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="caption" color="success.dark" sx={{ mt: 1, display: 'block' }}>
                                    {newDetails.nights > (selectedBooking.nights || 0) ? '📈' : '📉'}
                                    {' '}Cost change: ₹{(newDetails.totalAmount - (selectedBooking.totalAmount || 0)).toLocaleString()}
                                </Typography>
                            </Box>
                        ) : null;
                    })()}

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Note:</strong> The user will be notified of the date changes. Make sure the new dates are available and the user has confirmed the reschedule request.
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeRescheduleDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdminRescheduleBooking}
                        color="primary"
                        variant="contained"
                        disabled={rescheduling || !newCheckIn || !newCheckOut}
                    >
                        {rescheduling ? 'Rescheduling...' : 'Reschedule Booking'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookingManagement;
