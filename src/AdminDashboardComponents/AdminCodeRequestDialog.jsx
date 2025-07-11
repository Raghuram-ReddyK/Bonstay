import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Grid,
    Chip,
    TextField,
} from '@mui/material';

const AdminCodeRequestDialog = ({
    requestDialogOpen,
    rejectDialogOpen,
    selectedRequest,
    rejectionReason,
    setRejectionReason,
    resetDialogStates,
    handleApproveRequest,
    handleRejectRequest,
    handleRejectWithReason,
}) => {
    return (
        <>
            {/* Admin Code Request Review Dialog */}
            <Dialog open={requestDialogOpen} onClose={() => resetDialogStates()} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedRequest?.status === 'pending'
                        ? 'Review Admin Code Request'
                        : 'Admin Code Request Details'}
                </DialogTitle>

                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Name:</strong> {selectedRequest.name}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Email:</strong> {selectedRequest.email}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Phone:</strong> {selectedRequest.phoneNo}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Organization:</strong> {selectedRequest.organization}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Position:</strong> {selectedRequest.position}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <strong>Department:</strong> {selectedRequest.department}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Request Date:</strong>{' '}
                                        {new Date(selectedRequest.requestDate).toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Status:</strong>{' '}
                                        <Chip
                                            label={selectedRequest.status}
                                            color={
                                                selectedRequest.status === 'approved'
                                                    ? 'success'
                                                    : selectedRequest.status === 'rejected'
                                                        ? 'error'
                                                        : 'warning'
                                            }
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Reason for Request:</strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            p: 2,
                                            bgcolor: 'background.paper',
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                        }}
                                    >
                                        {selectedRequest.reason}
                                    </Typography>
                                </Grid>

                                {selectedRequest.status === 'approved' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <Typography>
                                                <strong>Admin Code:</strong> {selectedRequest.adminCode}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography>
                                                <strong>Approved Date:</strong>{' '}
                                                {new Date(selectedRequest.approvedDate).toLocaleString()}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.status === 'rejected' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <Typography>
                                                <strong>Rejected Date:</strong>{' '}
                                                {new Date(selectedRequest.rejectedDate).toLocaleString()}
                                            </Typography>
                                        </Grid>

                                        {selectedRequest.rejectionReason && (
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <strong>Rejection Reason:</strong>
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {selectedRequest.rejectionReason}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    {selectedRequest?.status === 'pending' ? (
                        <>
                            <Button onClick={() => handleRejectRequest(selectedRequest)} color="error">
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleApproveRequest(selectedRequest)}
                                variant="contained"
                                color="success"
                            >
                                Approve & Send Code
                            </Button>
                            <Button onClick={resetDialogStates}>Cancel</Button>
                        </>
                    ) : (
                        <Button onClick={resetDialogStates}>Close</Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Rejection Reason Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => resetDialogStates()} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Admin Code Request</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please provide a reason for rejecting this admin code request:
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter the reason for rejection (e.g., Insufficient justification, Invalid organization, etc.)"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => resetDialogStates()}>Cancel</Button>
                    <Button
                        onClick={handleRejectWithReason}
                        variant="contained"
                        color="error"
                        disabled={!rejectionReason.trim()}
                    >
                        Reject Request
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminCodeRequestDialog;
