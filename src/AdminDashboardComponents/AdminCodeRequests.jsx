import {
    Box,
    Typography,
    Button,
    Chip,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomDataGrid from '../CommonComponents/CustomDataGrid'

const AdminCodeRequests = ({
    adminCodeRequests,
    fetchAdminCodeRequests,
    setSelectedRequest,
    setRequestDialogOpen,
}) => {

    const adminCodeHeaders = [
        {
            field: 'requestName',
            headerName: 'Request Date',
            width: 130,
            sortable: true,
            valueGetter: ({ row }) => new Date(row.requestDate).toLocaleDateString(),
            sortValueGetter: ({ row }) => new Date(row.requestDate).getTime()
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            sortable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
            sortable: true,
        },
        {
            field: 'phoneNo',
            headerName: 'Phone',
            width: 130,
            sortable: true,
        },
        {
            field: 'organization',
            headerName: 'Organization',
            width: 150,
            sortable: true,
        },
        {
            field: '6',
            headerName: 'Status',
            width: 120,
            sortable: false,
            renderCell: ({ row }) => (
                <Chip
                    label={row.status}
                    color={
                        row.status === 'approved' ? 'success' :
                            row.status === 'rejected' ? 'error' : 'warning'
                    }
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 150,
            sortable: false,
            renderCell: ({ row }) => (
                <Box>
                    {row.status === 'pending' && (
                        <Button
                            variant='outlined'
                            size='small'
                            onClick={() => {
                                setSelectedRequest(row);
                                setRequestDialogOpen(true);
                            }}
                            sx={{ mr: 1 }}
                        >
                            Review
                        </Button>
                    )}
                    {row.status !== 'pending' && (
                        <Button
                            variant='text'
                            size='small'
                            onClick={() => {
                                setSelectedRequest(row);
                                setRequestDialogOpen(true);
                            }}
                        >
                            View Details
                        </Button>
                    )}

                </Box>
            )
        }
    ];

    return (
        <>
            <CustomDataGrid
                rows={adminCodeRequests}
                columns={adminCodeHeaders}
                pageSize={5}
                pageSizeOptions={[5, 10, 25]}
                loading={false}
                title="Admin Code Requests"
                subtitle="Manage admin code requests and approval process"
                actions={
                    <Tooltip title="Refresh Requests">
                        <Button variant='outlined' onClick={fetchAdminCodeRequests} sx={{ ml: 2 }}>
                            <RefreshIcon />
                            Refresh
                        </Button>
                    </Tooltip>

                }
            />

            {adminCodeRequests.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No admin code requests found
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default AdminCodeRequests;
