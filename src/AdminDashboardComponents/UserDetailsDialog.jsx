import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'

const UserDetailsDialog = ({
    userDialogOpen,
    setUserDialogOpen,
    selectedUser,
    getUserBookings,
    getHotelName,
    getRoomsCount
}) => {
    return (
        <Dialog
            open={userDialogOpen}
            onClose={() => setUserDialogOpen(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
                {selectedUser && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Phone:</strong> {selectedUser.phoneNo}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Address:</strong> {selectedUser.address}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Country:</strong> {selectedUser.country}</Typography>
                            </Grid>
                            {selectedUser.dateOfBirth && (
                                <Grid item xs={6}>
                                    <Typography><strong>Date of Birth:</strong> {selectedUser.dateOfBirth}</Typography>
                                </Grid>
                            )}
                            {selectedUser.gender && (
                                <Grid item xs={6}>
                                    <Typography><strong>Gender:</strong> {selectedUser.gender}</Typography>
                                </Grid>
                            )}
                            {selectedUser.occupation && (
                                <Grid item xs={6}>
                                    <Typography><strong>Occupation:</strong> {selectedUser.occupation}</Typography>
                                </Grid>
                            )}
                        </Grid>

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Booking History</Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Booking ID</TableCell>
                                        <TableCell>Hotel</TableCell>
                                        <TableCell>Check In</TableCell>
                                        <TableCell>Check Out</TableCell>
                                        <TableCell>Guests</TableCell>
                                        <TableCell>Rooms</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getUserBookings(selectedUser.id).map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>{booking.id}</TableCell>
                                            <TableCell>{getHotelName(booking)}</TableCell>
                                            <TableCell>{booking.checkIn || booking.startDate}</TableCell>
                                            <TableCell>{booking.checkOut || booking.endDate}</TableCell>
                                            <TableCell>{booking.guests || booking.noOfPersons || 1}</TableCell>
                                            <TableCell>{getRoomsCount(booking)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={booking.status || 'confirmed'}
                                                    color={booking.status === 'confirmed' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UserDetailsDialog
