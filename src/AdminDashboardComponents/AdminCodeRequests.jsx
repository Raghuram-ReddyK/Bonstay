import {
    Box,
    Typography,
    Button,
    Chip,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomDataGrid from '../CommonComponents/CustomDataGrid'
import ExcelExport from '../CommonComponents/ExcelExport';

const AdminCodeRequests = ({
    adminCodeRequests,
    fetchAdminCodeRequests,
    setSelectedRequest,
    setRequestDialogOpen,
}) => {

    // Excel export headers configuration for Admin Code Requests
    // This array defines the columns and their properties for exporting admin code request data to an Excel file.
    // Each object in the array represents a column in the Excel sheet.
    const adminCodeRequestsExportHeaders = [
        {
            key: 'requestDate', // The key in the data object that holds the request date.
            label: 'Request Date', // The header text for this column in the Excel file.
            // A transform function to format the date value.
            // It converts the date string to a localized date string (e.g., "M/D/YYYY").
            transform: (value) => new Date(value).toLocaleDateString()
        },
        { key: 'name', label: 'Name' }, // Maps 'name' from data to 'Name' column.
        { key: 'email', label: 'Email' }, // Maps 'email' from data to 'Email' column.
        { key: 'phoneNo', label: 'Phone' }, // Maps 'phoneNo' from data to 'Phone' column.
        { key: 'organization', label: 'Organization' }, // Maps 'organization' from data to 'Organization' column.
        { key: 'status', label: 'Status' }, // Maps 'status' from data to 'Status' column.
        {
            key: 'reason',
            label: 'Reason',
            // Transforms the value: if it's null or undefined, it defaults to 'N/A'.
            transform: (value) => value || 'N/A'
        },
        {
            key: 'adminCode',
            label: 'Admin Code',
            // Transforms the value: if it's null or undefined, it defaults to 'N/A'.
            transform: (value) => value || 'N/A'
        },
        {
            key: 'approvedBy',
            label: 'Approved By',
            // Transforms the value: if it's null or undefined, it defaults to 'N/A'.
            transform: (value) => value || 'N/A'
        },
        {
            key: 'approvedDate',
            label: 'Approved Date',
            // Transforms the value: if a date exists, it formats it to a localized date string; otherwise, 'N/A'.
            transform: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            key: 'rejectedBy',
            label: 'Rejected By',
            // Transforms the value: if it's null or undefined, it defaults to 'N/A'.
            transform: (value) => value || 'N/A'
        },
        {
            key: 'rejectedDate',
            label: 'Rejected Date',
            // Transforms the value: if a date exists, it formats it to a localized date string; otherwise, 'N/A'.
            transform: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            key: 'rejectionReason',
            label: 'Rejection Reason',
            // Transforms the value: if it's null or undefined, it defaults to 'N/A'.
            transform: (value) => value || 'N/A'
        }
    ];


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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ExcelExport
                            data={adminCodeRequests}
                            headers={adminCodeRequestsExportHeaders}
                            filename='Admin_Code_Requests_Export'
                            sheetName='Admin Code Requests'
                            buttonText='Export to Excel'
                            onExport={(info) => console.log('Exported', info)}
                        />

                        <Tooltip title="Refresh Requests">
                            <Button variant='outlined' onClick={fetchAdminCodeRequests} sx={{ ml: 2 }}>
                                <RefreshIcon />
                                Refresh
                            </Button>
                        </Tooltip>
                    </Box>
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
