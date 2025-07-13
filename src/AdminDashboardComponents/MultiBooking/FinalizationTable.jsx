import { useDispatch, useSelector } from 'react-redux';
import {
    Typography,
    Box,
    Button,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import {
    setSelectedFinalizationBookings,
    moveBackToAvailable,
    createMultipleBookings,
    setErrors
} from '../../Slices/multiBookingSlice';
import CustomDataGrid from '../../CommonComponents/CustomDataGrid';

const FinalizationTable = () => {
    const dispatch = useDispatch();

    const {
        selectedForFinalization,
        selectedFinalizationBookings,
        errors,
        loading
    } = useSelector((state) => state.multiBooking);

    // Remove selected bookings from finalization back to available
    const handleRemoveFromFinalization = () => {
        if (selectedFinalizationBookings.length === 0) {
            return;
        }
        dispatch(moveBackToAvailable());
    };

    // Finalize selected bookings
    const handleFinalizeBookings = async () => {
        if (selectedForFinalization.length === 0 || selectedFinalizationBookings.length === 0) {
            dispatch(setErrors({ finalization: true }));
            return;
        }

        const bookingsToFinalize = selectedForFinalization.filter(
            booking => selectedFinalizationBookings.includes(booking.tempId)
        );

        const bookingsData = bookingsToFinalize.map(booking => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            userId: booking.userId,
            hotelId: booking.hotelId,
            hotelName: booking.hotelName,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            rooms: booking.rooms,
            roomType: booking.roomType,
            status: 'confirmed',
            bookingDate: new Date().toISOString().split('T')[0],
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            noOfPersons: booking.guests,
            noOfRooms: booking.rooms,
            typeOfRoom: booking.roomType,
            startDate: booking.checkIn,
            endDate: booking.checkOut,
            tempId: booking.tempId
        }));

        dispatch(createMultipleBookings(bookingsData));
    };

    // Column definitions for finalization table
    const finalizationColumns = [
        {
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
            width: 120
        },
        {
            field: 'checkout',
            headerName: 'Check Out',
            width: 120
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
            valueGetter: ({ row }) =>
                `${row.duration} night${row.duration > 1 ? 's' : ''}`
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            valueGetter: () => 'Ready'
        }
    ];

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Selected for Finalization ({selectedForFinalization.length})
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveFromFinalization}
                        disabled={selectedFinalizationBookings.length === 0}
                    >
                        Remove Selected ({selectedFinalizationBookings.length})
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleFinalizeBookings}
                        disabled={selectedFinalizationBookings.length === 0 || loading.creating}
                        sx={{ px: 3 }}
                    >
                        {loading.creating ? (
                            <>
                                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                Creating...
                            </>
                        ) : (
                            `Finalize Selected (${selectedFinalizationBookings.length})`
                        )}
                    </Button>
                </Box>
            </Box>

            {errors.finalization && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {selectedForFinalization.length === 0
                        ? "No bookings available for finalization. Please add bookings to the finalization table first."
                        : "Please select bookings from the table below using checkboxes before clicking finalize."}
                </Alert>
            )}

            <Alert severity="success" sx={{ mb: 2 }}>
                Select bookings to finalize using checkboxes, then click "Finalize Selected" to create the bookings.
            </Alert>

            <CustomDataGrid
                rows={selectedForFinalization}
                columns={finalizationColumns}
                pageSize={10}
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection={true}
                selectedRows={selectedFinalizationBookings}
                onSelectionChange={(newSelection) => dispatch(setSelectedFinalizationBookings(newSelection))}
                rowIdField="tempId"
            />
        </Paper>
    );
};

export default FinalizationTable;
