import { useState, useEffect } from 'react';

import axios from 'axios';

import {
    Container,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    TextField,
    Autocomplete,
    Box,
    Tab,
    Tabs,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    console.log('allBookings: ', allBookings.endDate);
    const [isLoading, setIsLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [, setBookingDialogOpen] = useState(false);
    const [newBooking, setNewBooking] = useState({
        userId: '',
        hotelName: '',
        checkIn: '',
        checkout: '',
        guests: 1,
        roomType: 'Standard'
    });

    useEffect(() => {
        fetchAdminData();
        fetchAllUsers();
        fetchAllBookings();
    }, []);

    const fetchAdminData = async () => {
        try {
            const adminId = sessionStorage.getItem('id');
            if (adminId) {
                const response = await axios.get(`http://localhost:4000/users/${adminId}`);
                setAdmin(response.data);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/users/`);
            const regularUsers = response.data.filter(user => user.userType !== 'admin');
            setAllUsers(regularUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllBookings = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/bookings`);
            setAllBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleTabChange = (_event, newValue) => { setTabValue(newValue); };

    const handleUserSearch = (_event, value) => { setSearchQuery(value); };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getUserBookings = (userId) => {
        return allBookings.filter(booking => booking.userId === userId);
    };

    const handleViewUserDetails = (user) => {
        setSelectedUser(user);
        setUserDialogOpen(true);
    };

    const handleCreateBooking = async () => {
        try {
            const bookingData = {
                ...newBooking,
                id: Date.now().toString(),
                status: 'confirmed',
                bookingDate: new Date().toISOString().split('T')[0]
            };
            await axios.post(`http://localhost:4000/bookings`, bookingData);
            setBookingDialogOpen(false);
            setNewBooking({
                userId: '',
                hotelName: '',
                checkIn: '',
                checkout: '',
                guests: 1,
                roomType: 'Standard'
            });
            fetchAllBookings();
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
                Admin Dashboard
            </Typography>

            {admin && (
                <Typography variant="h5" gutterBottom>
                    Welcome, {admin.name} ({admin.department})
                </Typography>
            )}

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Total Users</Typography>
                            <Typography variant="h4">{allUsers.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Total Bookings</Typography>
                            <Typography variant="h4">{allBookings.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Active Bookings</Typography>
                            <Typography variant="h4">{allBookings.filter(b => b.status === 'confirmed').length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="User Management" />
                    <Tab label="Booking Management" />
                    <Tab label="Create Booking" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 3 }}>
                    <Autocomplete
                        freeSolo
                        options={allUsers.map(user => `${user.name} (${user.email})`)}
                        onInputChange={handleUserSearch}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search users by name, email, or ID"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Bookings</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNo}</TableCell>
                                    <TableCell>
                                        <Chip label={getUserBookings(user.id).length} color="primary" />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewUserDetails(user)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Booking ID</TableCell>
                                <TableCell>User ID</TableCell>
                                <TableCell>Hotel</TableCell>
                                <TableCell>Check In</TableCell>
                                <TableCell>Check Out</TableCell>
                                <TableCell>Guests</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>{booking.userId}</TableCell>
                                    <TableCell>{booking.hotelName || booking.hotel}</TableCell>
                                    <TableCell>{booking.startDate}</TableCell>
                                    <TableCell>{booking.endDate}</TableCell>
                                    <TableCell>{booking.guests}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={booking.status || 'confirmed'}
                                            color={booking.status === 'confirmed' ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={allUsers}
                                getOptionLabel={(option) => `${option.name} (${option.id})`}
                                onChange={(event, value) =>
                                    setNewBooking(prev => ({ ...prev, userId: value?.id || '' }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Select User" required />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Hotel Name"
                                value={newBooking.hotelName}
                                onChange={(e) =>
                                    setNewBooking(prev => ({ ...prev, hotelName: e.target.value }))
                                }
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Check In Date"
                                type="date"
                                value={newBooking.checkIn}
                                onChange={(e) =>
                                    setNewBooking(prev => ({ ...prev, checkIn: e.target.value }))
                                }
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Check Out Date"
                                type="date"
                                value={newBooking.checkout}
                                onChange={(e) =>
                                    setNewBooking(prev => ({ ...prev, checkout: e.target.value }))
                                }
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Number of Guests"
                                type="number"
                                value={newBooking.guests}
                                onChange={(e) =>
                                    setNewBooking(prev => ({ ...prev, guests: parseInt(e.target.value) }))
                                }
                                fullWidth
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Room Type"
                                value={newBooking.roomType}
                                onChange={(e) =>
                                    setNewBooking(prev => ({ ...prev, roomType: e.target.value }))
                                }
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={handleCreateBooking}
                                disabled={
                                    !newBooking.userId ||
                                    !newBooking.hotelName ||
                                    !newBooking.checkIn ||
                                    !newBooking.checkout
                                }
                            >
                                Create Booking
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </TabPanel>

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
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getUserBookings(selectedUser.id).map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell>{booking.id}</TableCell>
                                                <TableCell>{booking.hotelName || booking.hotel}</TableCell>
                                                <TableCell>{booking.checkIn}</TableCell>
                                                <TableCell>{booking.checkOut}</TableCell>
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
        </Container>
    );

};

export default AdminDashboard;
