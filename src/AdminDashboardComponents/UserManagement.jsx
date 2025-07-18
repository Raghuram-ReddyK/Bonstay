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
import { FileDownload as ExportIcon } from '@mui/icons-material'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import CustomDataGrid from '../CommonComponents/CustomDataGrid'


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
    // Export to Excel functionality
    const handleExportToExcel = () => {
        const exportData = filteredUsers.map(user => ({
            'User Id': user.id,
            'Name': user.name,
            'Email': user.email,
            'Phone': user.phoneNo,
            'Address': user.address,
            'Date of Birth': user.dataOfBirth || 'N/A',
            'Gender': user.gender || 'N/A',
            'Occupation': user.occupation || 'N/A',
            'User Type': user.userType,
            'Total Bookings': getUserBookings(user.id).length,
            'Registration Date': user.registrationDate || 'N/A'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users Data');

        // Auto-Size Columns
        const colWidths = [];
        Object.keys(exportData[0] || {}).forEach(key => {
            colWidths.push({ wch: Math.max(key.length, 15) });
        });
        ws['!cols'] = colWidths;

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `Users_Data_Export_${new Date().toISOString().split('T')[0]}.xlsx`)

    }

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
                    <Button
                        variant='outlined'
                        startIcon={<ExportIcon />}
                        onClick={handleExportToExcel}
                        color='primary'
                        sx={{ minWidth: 160 }}
                    >
                        Export to Excel
                    </Button>
                }
            />
        </>
    )
}

export default UserManagement
