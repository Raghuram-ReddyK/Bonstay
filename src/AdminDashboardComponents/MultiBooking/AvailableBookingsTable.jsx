import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography,
    Box,
    Button,
    Paper,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import CustomDataGrid from '../../CommonComponents/CustomDataGrid';
import {
    setSelectedAvailableBookings,
    moveToFinalization,
    updateBookingDate
} from '../../Slices/multiBookingSlice';

const AvailableBookingsTable = () => {
    const dispatch = useDispatch();
    const {
        availableBookings,
        selectedAvailableBookings
    } = useSelector((state) => state.multiBooking);

    // State for date editing dialog
    const [editDialog, setEditDialog] = useState({
        open: false,
        bookingId: null,
        dateType: '', // 'checkIn' or 'checkOut'
        currentDate: '',
        newDate: '',
        error: ''
    });

    // Move selected bookings from available to finalization
    const handleMoveToFinalization = () => {
        if (selectedAvailableBookings.length === 0) {
            return;
        }
        dispatch(moveToFinalization());
    };

    // Open date edit dialog
    const handleEditDate = (bookingId, dateType, currentDate) => {
        setEditDialog({
            open: true,
            bookingId,
            dateType,
            currentDate,
            newDate: currentDate,
            error: ''
        });
    };

    // Close date edit dialog
    const handleCloseDialog = () => {
        setEditDialog({
            open: false,
            bookingId: null,
            dateType: '',
            currentDate: '',
            newDate: '',
            error: ''
        });
    };

    // Validate date changes
    const validateDate = (newDate, dateType, bookingId) => {
        const today = new Date().toISOString().split('T')[0];
        const selectedDate = new Date(newDate);
        const todayDate = new Date(today);

        // Find the current booking to get the other date for comparison
        const currentBooking = availableBookings.find(booking => booking.tempId === bookingId);

        if (!currentBooking) {
            return 'Booking not found';
        }

        // Check if date is in the past
        if (selectedDate < todayDate) {
            return 'Date cannot be in the past';
        }

        // Check if check-in is after check-out or vice versa
        if (dateType === 'checkIn') {
            const checkOutDate = new Date(currentBooking.checkOut);
            if (selectedDate >= checkOutDate) {
                return 'Check-in date must be before check-out date';
            }
        } else if (dateType === 'checkOut') {
            const checkInDate = new Date(currentBooking.checkIn);
            if (selectedDate <= checkInDate) {
                return 'Check-out date must be after check-in date';
            }
        }

        return '';
    };

    // Handle date input change with validation
    const handleDateChange = (newDate) => {
        const error = validateDate(newDate, editDialog.dateType, editDialog.bookingId);
        setEditDialog(prev => ({
            ...prev,
            newDate,
            error
        }));
    };

    // Save date changes
    const handleSaveDate = () => {
        const error = validateDate(editDialog.newDate, editDialog.dateType, editDialog.bookingId);

        if (error) {
            setEditDialog(prev => ({ ...prev, error }));
            return;
        }

        // Dispatch action to update the booking date in the store
        dispatch(updateBookingDate({
            bookingId: editDialog.bookingId,
            dateType: editDialog.dateType,
            newDate: editDialog.newDate
        }));

        handleCloseDialog();
    };

    // Column definitions for available bookings table
    const availableBookingsColumns = [
        {
            field: 'userName',
            headerName: 'User',
            width: 180,
            valueGetter: ({ row }) => row.userName || row.userId
        },
        {
            field: 'hotelName',
            headerName: 'Hotel',
            width: 200
        },
        {
            field: 'checkIn',
            headerName: 'Check In',
            width: 150,
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{row.checkIn}</span>
                    <IconButton
                        size="small"
                        onClick={() => handleEditDate(row.tempId, 'checkIn', row.checkIn)}
                        sx={{ p: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        },
        {
            field: 'checkOut',
            headerName: 'Check Out',
            width: 150,
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{row.checkOut}</span>
                    <IconButton
                        size="small"
                        onClick={() => handleEditDate(row.tempId, 'checkOut', row.checkOut)}
                        sx={{ p: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        },
        {
            field: 'guests',
            headerName: 'Guests',
            width: 80,
            align: 'center'
        },
        {
            field: 'rooms',
            headerName: 'Rooms',
            width: 80,
            align: 'center'
        },
        {
            field: 'roomType',
            headerName: 'Room Type',
            width: 120
        },
        {
            field: 'duration',
            headerName: 'Duration',
            width: 100,
            valueGetter: ({ row }) => `${row.duration} night${row.duration > 1 ? 's' : ''}`
        }
    ];

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Available Bookings ({availableBookings.length})
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMoveToFinalization}
                    disabled={selectedAvailableBookings.length === 0}
                >
                    Move Selected to Finalization ({selectedAvailableBookings.length})
                </Button>
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
                Select bookings from the table below using checkboxes, then click "Move Selected to Finalization" to proceed.
            </Alert>
            <CustomDataGrid
                rows={availableBookings}
                columns={availableBookingsColumns}
                pageSize={10}
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection={true}
                selectedRows={selectedAvailableBookings}
                onSelectionChange={(newSelection) => dispatch(setSelectedAvailableBookings(newSelection))}
                rowIdField="tempId"
            />

            {/* Date Edit Dialog */}
            <Dialog open={editDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit {editDialog.dateType === 'checkIn' ? 'Check In' : 'Check Out'} Date
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label={`Current ${editDialog.dateType === 'checkIn' ? 'Check In' : 'Check Out'} Date`}
                            value={editDialog.currentDate}
                            disabled
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label={`New ${editDialog.dateType === 'checkIn' ? 'Check In' : 'Check Out'} Date`}
                            type="date"
                            value={editDialog.newDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            fullWidth
                            error={!!editDialog.error}
                            helperText={editDialog.error}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveDate}
                        color="primary"
                        variant="contained"
                        disabled={!editDialog.newDate || editDialog.newDate === editDialog.currentDate || !!editDialog.error}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AvailableBookingsTable;

