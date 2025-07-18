import {
    Autocomplete,
    Box,
    Button,
    Chip,
    IconButton,
    TextField,
    Typography
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CustomDataGrid from '../CommonComponents/CustomDataGrid'
import ExcelExport from '../CommonComponents/ExcelExport'


const UserManagement = ({
    allUsers,
    searchQuery,
    filteredUsers,
    isLoading,
    handleUserSearch,
    clearSearch,
    getUserBookings,
    handleViewUserDetails
}) => {
    const userExportHeaders = [
        { key: 'id', label: 'User ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNo', label: 'Phone' },
        { key: 'address', label: 'Address' },
        {
            key: 'dateOfBirth',
            label: 'Date of Birth',
            transform: (value) => value || 'N/A'
        },
        {
            key: 'gender',
            label: 'Gender',
            transform: (value) => value || 'N/A'
        },
        {
            key: 'occupation',
            label: 'Occupation',
            transform: (value) => value || 'N/A'
        },
        {
            key: 'userType',
            label: 'User Type',
            transform: (value) => value || 'user'
        },
        {
            key: 'bookingsCount',
            label: 'Total Bookings',
            transform: (_value, item) => getUserBookings(item.id).length
        },
        {
            key: 'registrationDate',
            label: 'Registration Date',
            transform: (value) => value || 'N/A'
        }
    ];


    const userManagementHeaders = [
        {
            field: 'id',
            headerName: 'User ID',
            width: 120,
            sortable: true,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            sortable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            sortable: true,
        },
        {
            field: 'phoneNo',
            headerName: 'Phone',
            width: 150,
            sortable: true,
        },
        {
            field: 'bookingsCount',
            headerName: 'Bookings',
            width: 120,
            sortable: true,
            valueGetter: ({ row }) => getUserBookings(row.id).length,
            sortValueGetter: ({ row }) => Number(getUserBookings(row.id).length),
            renderCell: ({ row }) => (
                <Chip
                    label={getUserBookings(row.id).length}
                    color="primary"
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: ({ row }) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewUserDetails(row)}
                >
                    View Details
                </Button>
            ),
        },
    ]

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Autocomplete
                        freeSolo
                        fullWidth
                        value={searchQuery}
                        options={allUsers.map(user => `${user.name} (${user.email})`)}
                        onInputChange={handleUserSearch}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search users by name, email, or ID"
                                variant="outlined"
                                placeholder='Start typing to search users...'
                                fullWidth
                            />
                        )}
                    />
                    {searchQuery && (
                        <IconButton
                            onClick={clearSearch}
                            color='primary'
                            title='Clear Search'
                        >
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>
                <Typography>
                    Showing {filteredUsers.length} of {allUsers.length} users
                    {searchQuery && ` (filtered By: "${searchQuery}")`}
                </Typography>
            </Box>

            <CustomDataGrid
                rows={filteredUsers}
                columns={userManagementHeaders}
                pageSize={5}
                pageSizeOptions={[5, 10, 25]}
                loading={isLoading}
                title="User Management"
                subtitle="Manage all registered users and view their booking history"
                actions={
                    <ExcelExport
                        data={filteredUsers}
                        headers={userExportHeaders}
                        filename='Users_Export'
                        sheetName='Users'
                        buttonText='Export to Export'
                    />
                }
            />
        </>
    )
}

export default UserManagement
