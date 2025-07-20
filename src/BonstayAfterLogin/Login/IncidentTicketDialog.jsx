import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Button,
    Alert
} from '@mui/material';

const IncidentTicketDialog = ({
    open,
    onClose,
    lockedUser,
    existingTicketStatus,
    onCreateTicket,
    onTryLoginAgain
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ff9800';
            case 'approved': return '#4caf50';
            case 'rejected': return '#f44336';
            default: return '#666';
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending':
                return "Your ticket is being reviewed by an administrator. Please wait for approval.";
            case 'rejected':
                return "Your previous ticket was rejected. You can create a new incident ticket below.";
            case 'approved':
                return "Your ticket was approved. Please try logging in again.";
            default:
                return "";
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ backgroundColor: '#f44336', color: 'white' }}>
                Account Locked - Create Incident Ticket
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Your account has been locked due to multiple failed login attempts.
                </Alert>
                <DialogContentText>
                    <strong>Account Details:</strong><br />
                    Name: {lockedUser?.name}<br />
                    Email: {lockedUser?.email}<br />
                    Failed Attempts: {lockedUser?.failedLoginAttempts || 3}<br />
                    Lockout Time: {new Date().toLocaleString()}<br /><br />

                    {existingTicketStatus ? (
                        <>
                            <strong>Existing Incident Ticket:</strong><br />
                            Ticket ID: {existingTicketStatus.id}<br />
                            Status: <span style={{
                                color: getStatusColor(existingTicketStatus.status),
                                fontWeight: 'bold'
                            }}>
                                {existingTicketStatus.status.toUpperCase()}
                            </span><br />
                            Created: {new Date(existingTicketStatus.createdAt).toLocaleString()}<br />
                            {existingTicketStatus.adminNotes && (
                                <>Admin Notes: {existingTicketStatus.adminNotes}<br /></>
                            )}
                            <br />
                            {getStatusMessage(existingTicketStatus.status)}
                        </>
                    ) : (
                        <>
                            To unlock your account, click "Create Incident Ticket" below.
                            An administrator will review your request and unlock your account if appropriate.
                            You will receive a confirmation message with your incident ticket ID.
                        </>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
                {(!existingTicketStatus || existingTicketStatus.status === 'rejected') && (
                    <Button
                        onClick={onCreateTicket}
                        variant="contained"
                        color="primary"
                    >
                        {existingTicketStatus?.status === 'rejected' ? 'Create New Incident Ticket' : 'Create Incident Ticket'}
                    </Button>
                )}
                {existingTicketStatus?.status === 'approved' && (
                    <Button
                        onClick={onTryLoginAgain}
                        variant="contained"
                        color="success"
                    >
                        Try Login Again
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default IncidentTicketDialog;
