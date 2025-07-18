import {
    Box,
    Typography,
    Button,
    Chip,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FileDownload as ExportIcon } from '@mui/icons-material'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import CustomDataGrid from '../CommonComponents/CustomDataGrid'

const AdminCodeRequests = ({
    adminCodeRequests,
    fetchAdminCodeRequests,
    setSelectedRequest,
    setRequestDialogOpen,
}) => {

    const handleExportToExcel = () => {
        // Map the adminCodeRequests array to a new array of objects
        // where keys are user-friendly column headers and values are formatted data.
        const exportData = adminCodeRequests.map(request => ({
            'Request Date': new Date(request.requestDate).toLocaleDateString(), // Format date
            'Name': request.name,
            'Email': request.email,
            'Phone': request.phoneNo,
            'Organization': request.organization,
            'Status': request.status,
            'Reason': request.reason || 'N/A',
            'Admin Code': request.adminCode || 'N/A',
            'Approved By': request.approvedBy || 'N/A',
            'Approved Date': request.approvedDate ? new Date(request.approvedDate).toLocaleDateString() : 'N/A',
            'Rejected By': request.rejectedBy || 'N/A',
            'Rejected Date': request.rejectedDate ? new Date(request.rejectedDate).toLocaleDateString() : 'N/A',
            'Rejection Reason': request.rejectionReason || 'N/A'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData); // Convert JSON data to a worksheet
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Admin Code Requests'); // Append the worksheet to the workbook with a sheet name

        // Auto-size columns based on content length.
        // It iterates through the keys of the first data row (or an empty object if no data)
        // and sets a minimum column width of 15 or the length of the header, whichever is greater.
        const colWidths = [];
        Object.keys(exportData[0] || {}).forEach(key => {
            colWidths.push({ wch: Math.max(key.length, 15) });
        });
        ws['!cols'] = colWidths; // Apply column widths to the worksheet

        // Write the workbook to an array buffer.
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        // Create a Blob from the array buffer with the correct MIME type for Excel files.
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Save the Blob as an Excel file using file-saver, with a dynamic filename including the current date.
        saveAs(data, `Admin_Code_Requests_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

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
                        <Button
                            variant='outlined'
                            startIcon={<ExportIcon />}
                            onClick={handleExportToExcel}
                            color='primary'
                            sx={{ minWidth: 160 }}
                        >
                            Export to Excel
                        </Button>

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
