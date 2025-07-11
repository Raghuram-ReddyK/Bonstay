import { Chip } from '@mui/material';
import CustomDataGrid from '../CommonComponents/CustomDataGrid';

const BookingManagement = ({ allBookings, isLoading, getHotelName, getRoomsCount }) => {
    return (
        <CustomDataGrid
            rows={allBookings}
            columns={[
                {
                    field: 'id',
                    headerName: 'Booking ID',
                    width: 130,
                    sortable: true,
                },
                {
                    field: 'userId',
                    headerName: 'User ID',
                    width: 120,
                    sortable: true,
                },
                {
                    field: 'hotelName',
                    headerName: 'Hotel',
                    width: 200,
                    sortable: true,
                    valueGetter: ({ row }) => getHotelName(row),
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
                            if (typeof dateValue === 'string' && dateValue.includes('T')) {
                                return new Date(dateValue).toLocaleDateString();
                            }
                            return dateValue;
                        } catch (error) {
                            return dateValue;
                        }
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
                            if (typeof dateValue === 'string' && dateValue.includes('T')) {
                                return new Date(dateValue).toLocaleDateString();
                            }
                            return dateValue;
                        } catch (error) {
                            return dateValue;
                        }
                    }
                },
                {
                    field: 'guests',
                    headerName: 'Guests',
                    width: 100,
                    sortable: true,
                    valueGetter: ({ row }) => row.guests || row.noOfPersons || 1,
                },
                {
                    field: 'rooms',
                    headerName: 'Rooms',
                    width: 100,
                    sortable: true,
                    valueGetter: ({ row }) => getRoomsCount(row),
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    width: 120,
                    sortable: true,
                    renderCell: ({ row }) => (
                        <Chip
                            label={row.status || 'confirmed'}
                            color={row.status === 'confirmed' ? 'success' : 'default'}
                            size="small"
                        />
                    ),
                },
            ]}
            pageSize={5}
            pageSizeOptions={[5, 10, 25]}
            loading={isLoading}
            title="Booking Management"
            subtitle="View and manage all hotel bookings. Sort by any column and use pagination to navigate through bookings."
        />
    );
};

export default BookingManagement;
