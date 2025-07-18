import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Grid,
    Snackbar 
} from '@mui/material'; 
import {
    Refresh as RefreshIcon, 
    Visibility as ViewIcon, 
    CheckCircle as ApproveIcon, 
    Cancel as RejectIcon, 
    Lock as LockIcon, 
    LockOpen as UnlockIcon 
} from '@mui/icons-material'; 
import useSWR, { mutate } from 'swr'; 
import axios from 'axios'; 
import { getApiUrl } from '../config/apiConfig'; 
import ExcelExport from '../CommonComponents/ExcelExport';

const fetcher = (url) => axios.get(url).then(res => res.data);

const IncidentTickets = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const { data: tickets = [], error: ticketsError, isLoading: ticketsLoading } = useSWR(
        getApiUrl('/incidentTickets'), 
        fetcher, 
        { refreshInterval: 30000 } 
    );

    const { data: users = [] } = useSWR(getApiUrl('/users'), fetcher);

    /**
     * Determines the Material-UI Chip color based on the ticket status.
     * @param {string} status - The status of the incident ticket (e.g., 'pending', 'approved', 'rejected', 'resolved').
     * @returns {string} The Material-UI color string.
     */
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'; // Yellow for pending
            case 'approved': return 'success'; // Green for approved
            case 'rejected': return 'error'; // Red for rejected
            case 'resolved': return 'info'; // Blue for resolved
            default: return 'default'; // Grey for unknown status
        }
    };

    /**
     * Handles opening the ticket details dialog.
     * Sets the selected ticket and initializes admin notes from the ticket.
     * @param {Object} ticket - The ticket object to display.
     */
    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket); // Store the selected ticket
        setAdminNotes(ticket.adminNotes || ''); // Initialize admin notes from ticket data
        setDialogOpen(true); // Open the dialog
    };

    /**
     * Handles approving or rejecting an incident ticket.
     * Updates the ticket status in the backend and, if approved, unlocks the associated user account.
     * Also triggers data revalidation and shows a Snackbar notification.
     * @param {boolean} approve - True to approve, false to reject.
     */
    const handleApproveTicket = async (approve = true) => {
        if (!selectedTicket) return; // Do nothing if no ticket is selected

        setLoading(true); // Set loading state to true
        try {
            // Prepare the updated ticket object with new status and resolution details.
            const updatedTicket = {
                ...selectedTicket,
                status: approve ? 'approved' : 'rejected',
                resolvedBy: 'admin01', 
                resolvedAt: new Date().toISOString(), 
                adminNotes: adminNotes, 
                updatedAt: new Date().toISOString() 
            };

            await axios.put(getApiUrl(`/incidentTickets/${selectedTicket.id}`), updatedTicket);

            if (approve) {
                const user = users.find(u => u.id === selectedTicket.userId); 
                if (user) {
                    // Prepare the updated user object to unlock the account.
                    const unlockedUser = {
                        ...user,
                        isLocked: false, 
                        failedLoginAttempts: 0, 
                        lockoutTime: null 
                    };
                    await axios.put(getApiUrl(`/users/${user.id}`), unlockedUser);
                }
            }

            mutate(getApiUrl('/incidentTickets'));
            mutate(getApiUrl('/users'));

            setSnackbar({
                open: true,
                message: `Ticket ${approve ? 'approved' : 'rejected'} successfully. ${approve ? 'User account has been unlocked.' : ''}`,
                severity: 'success'
            });

            setDialogOpen(false);
            setSelectedTicket(null);
            setAdminNotes('');
        } catch (error) {
            console.error('Error updating ticket:', error); 
            setSnackbar({
                open: true,
                message: 'Failed to update ticket. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        mutate(getApiUrl('/incidentTickets')); // Revalidate tickets
        mutate(getApiUrl('/users')); // Revalidate users
    };

    /**
     * Formats a date string into a localized date and time string.
     * @param {string} dateString - The date string to format (e.g., ISO string).
     * @returns {string} Formatted date and time string.
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    /**
     * Calculates statistics for incident tickets (total, pending, approved, rejected).
     * @returns {Object} An object containing the counts for different ticket statuses.
     */
    const getTicketStats = () => {
        const pending = tickets.filter(t => t.status === 'pending').length;
        const approved = tickets.filter(t => t.status === 'approved').length;
        const rejected = tickets.filter(t => t.status === 'rejected').length;
        const total = tickets.length;

        return { pending, approved, rejected, total };
    };

    const stats = getTicketStats();

    const excelHeaders = [
        { key: 'id', label: 'Ticket ID' },
        { key: 'userName', label: 'User Name' },
        { key: 'userEmail', label: 'User Email' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'failedAttempts', label: 'Failed Attempts' },
        { key: 'lockoutTime', label: 'Lockout Time', transform: (value) => value ? formatDate(value) : '' },
        { key: 'createdAt', label: 'Created At', transform: (value) => formatDate(value) },
        { key: 'resolvedBy', label: 'Resolved By', transform: (value) => value || '' },
        { key: 'resolvedAt', label: 'Resolved At', transform: (value) => value ? formatDate(value) : '' },
        { key: 'adminNotes', label: 'Admin Notes', transform: (value) => value || '' }
    ];


    if (ticketsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography>Loading incident tickets...</Typography>
            </Box>
        );
    }

    if (ticketsError) {
        return (
            <Alert severity="error">
                Failed to load incident tickets. Please try again.
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}> {/* Main container with padding */}
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Incident Tickets Management 
                </Typography>
                <Box display="flex" gap={2}>
                    <ExcelExport
                        data={tickets} 
                        headers={excelHeaders} 
                        filename="incident-tickets" 
                    />
                    {/* Refresh Button */}
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />} 
                        onClick={refreshData} 
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Total Tickets Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Tickets
                            </Typography>
                            <Typography variant="h4">
                                {stats.total} {/* Display total tickets count */}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Pending Tickets Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {stats.pending} {/* Display pending tickets count with warning color */}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Approved Tickets Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Approved
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {stats.approved} {/* Display approved tickets count with success color */}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Rejected Tickets Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Rejected
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {stats.rejected} {/* Display rejected tickets count with error color */}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tickets Table */}
            <Paper> {/* Paper component for elevated table appearance */}
                <TableContainer> {/* Container for scrollable table */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ticket ID</TableCell>
                                <TableCell>User Details</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Failed Attempts</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Map through tickets to render each row */}
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}> {/* Unique key for each row */}
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {ticket.id} {/* Ticket ID */}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {ticket.userName} {/* User Name */}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {ticket.userEmail} {/* User Email */}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={<LockIcon />} // Lock icon for ticket type
                                            label={ticket.type.replace('_', ' ').toUpperCase()} // Format type (e.g., 'ACCOUNT_LOCKOUT' to 'ACCOUNT LOCKOUT')
                                            size="small"
                                            color="default"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ticket.status.toUpperCase()} // Display status in uppercase
                                            size="small"
                                            color={getStatusColor(ticket.status)} // Dynamic color based on status
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="error">
                                            {ticket.failedAttempts} attempts {/* Number of failed attempts */}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(ticket.createdAt)} {/* Formatted creation date */}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            {/* View Details Button */}
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewTicket(ticket)} // Open details dialog
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {/* Quick Approve/Unlock Button (only for pending tickets) */}
                                            {ticket.status === 'pending' && (
                                                <>
                                                    <Tooltip title="Quick Approve & Unlock Account">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => {
                                                                setSelectedTicket(ticket); // Set selected ticket
                                                                setAdminNotes('Account unlocked - approved by admin'); // Default notes for quick action
                                                                handleApproveTicket(true); // Approve and unlock
                                                            }}
                                                        >
                                                            <UnlockIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Message when no tickets are found */}
                {tickets.length === 0 && (
                    <Box p={4} textAlign="center">
                        <Typography variant="body1" color="textSecondary">
                            No incident tickets found.
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Ticket Details Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)} // Close dialog on backdrop click or Escape key
                maxWidth="md" // Max width of the dialog
                fullWidth // Dialog takes full width up to maxWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LockIcon /> {/* Icon in dialog title */}
                        Incident Ticket Details - {selectedTicket?.id} {/* Ticket ID in title */}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedTicket && ( // Render content only if a ticket is selected
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">User Name</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedTicket.userName}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedTicket.userEmail}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                                    <Chip
                                        label={selectedTicket.status.toUpperCase()}
                                        color={getStatusColor(selectedTicket.status)}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Failed Attempts</Typography>
                                    <Typography variant="body1" gutterBottom color="error">
                                        {selectedTicket.failedAttempts} attempts
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Lockout Time</Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {formatDate(selectedTicket.lockoutTime)} {/* Formatted lockout time */}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {formatDate(selectedTicket.createdAt)} {/* Formatted creation time */}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                    <Typography variant="body1" gutterBottom>{selectedTicket.description}</Typography>
                                </Grid>

                                {selectedTicket.resolvedBy && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="textSecondary">Resolved By</Typography>
                                            <Typography variant="body1" gutterBottom>{selectedTicket.resolvedBy}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="textSecondary">Resolved At</Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {formatDate(selectedTicket.resolvedAt)} {/* Formatted resolution time */}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Admin Notes"
                                        multiline
                                        rows={4}
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        disabled={selectedTicket.status !== 'pending'}
                                        helperText={selectedTicket.status !== 'pending' ? 'This ticket has already been resolved' : 'Add notes about the resolution'}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}> 
                        Close
                    </Button>
                    {/* Action buttons (Reject/Approve) only for pending tickets */}
                    {selectedTicket?.status === 'pending' && (
                        <>
                            <Button
                                onClick={() => handleApproveTicket(false)} // Reject ticket
                                color="error"
                                variant="outlined"
                                startIcon={<RejectIcon />}
                                disabled={loading} 
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleApproveTicket(true)} 
                                color="success"
                                variant="contained"
                                startIcon={<ApproveIcon />}
                                disabled={loading} 
                            >
                                Approve & Unlock Account
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default IncidentTickets;
