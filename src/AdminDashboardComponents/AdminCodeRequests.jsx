import {
    Box,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Chip,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const AdminCodeRequests = ({
    adminCodeRequests,
    fetchAdminCodeRequests,
    setSelectedRequest,
    setRequestDialogOpen,
}) => {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Admin Code Requests</Typography>

                <Tooltip title="Refresh Requests">
                    <Button variant="outlined" onClick={fetchAdminCodeRequests} sx={{ ml: 2 }}>
                        <RefreshIcon />
                        Refresh
                    </Button>
                </Tooltip>

            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Request Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Organization</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {adminCodeRequests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                                <TableCell>{request.name}</TableCell>
                                <TableCell>{request.email}</TableCell>
                                <TableCell>{request.phoneNo}</TableCell>
                                <TableCell>{request.organization}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={request.status}
                                        color={
                                            request.status === 'approved'
                                                ? 'success'
                                                : request.status === 'rejected'
                                                    ? 'error'
                                                    : 'warning'
                                        }
                                    />
                                </TableCell>

                                <TableCell>
                                    {request.status === 'pending' && (
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setRequestDialogOpen(true);
                                                }}
                                                sx={{ mr: 1 }}
                                            >
                                                Review
                                            </Button>
                                        </Box>
                                    )}

                                    {request.status !== 'pending' && (
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setRequestDialogOpen(true);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
