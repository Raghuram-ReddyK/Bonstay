import { useDispatch, useSelector } from 'react-redux';
import {
    Typography,
    Box,
    Button,
    Paper,
    Alert
} from '@mui/material';
import {
    setSelectedAvailableBookings,
    moveToFinalization
} from '../../Slices/multiBookingSlice';
import CustomDataGrid from '../../CommonComponents/CustomDataGrid';

const AvailableBookingsTable = () => {
    const dispatch = useDispatch();

    const {
        availableBookings,
        selectedAvailableBookings
    } = useSelector((state) => state.multiBooking);

    // Move selected bookings from available to finalization
    const handleMoveToFinalization = () => {
        if (selectedAvailableBookings.length === 0) {
            return;
        }
        dispatch(moveToFinalization());
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
            width: 120
        },
        {
            field: 'checkOut',
            headerName: 'Check out',
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
        </Paper>
    );
};

export default AvailableBookingsTable;
