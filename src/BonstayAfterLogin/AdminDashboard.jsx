import { useState, useEffect, useCallback, useMemo } from 'react';
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
    DialogActions,
    IconButton
} from '@mui/material';
import { AdminCodeUtils, emailService, smsService } from '../services/communicationServices';
import ClearIcon from '@mui/icons-material/Clear';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [, setBookingDialogOpen] = useState(false);
    const [adminCodeRequests, setAdminCodeRequests] = useState([]);
    const [requestDialogOpen, setRequestDialogOpen] = useState('');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedRequest, setSelectedRequest] = useState('');
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
        fetchAdminCodeRequests();
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

    const fetchAdminCodeRequests = async (forceRefresh = false) => {
        try {
            const timeStamp = Date.now();
            const url = forceRefresh ? `http://localhost:4000/admin-code-requests?_t=${timeStamp}&_nocache=true` :
                `http://localhost:4000/admin-code-requests?_t=${timeStamp}`
            console.log('url: ', url);
            const response = await axios.get(url, {
                headers: {
                    'Cache-control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            setAdminCodeRequests(response.data || [])
        } catch (error) {
            console.error("Error fetching admin code request:", error);
            console.error("Error details:", error.response?.data || error.message);
            setAdminCodeRequests([]);
        }
    };

    const generateAdminCode = () => {
        return AdminCodeUtils.generateAdminCode();
    };

    const sendSMS = async (phoneNo, adminCode, userName) => {
        try {
            const formattedPhone = smsService.formatPhoneNumber(phoneNo);
            const message = AdminCodeUtils.formatAdminCodeMessage(adminCode, userName);

            const result = await smsService.sendSMS(formattedPhone, message);
            return result;
        } catch (error) {
            console.error("Error sending sms:", error);
            return { success: false, error: error.message };
        }
    };

    const sendEmail = async (email, Subject, message) => {
        try {
            const result = await emailService.sendEmail(email, Subject, message);
            return result;
        } catch (error) {
            console.error("Error sending email", error);
        }
    };

    const handleApproveRequest = async (request) => {
        try {
            console.log(" Starting admin code approval process...");
            if (!admin || !admin.id) {
                alert('Admin Information Not Found. Please Login Again')
            }

            const adminCode = generateAdminCode();
            console.log(`Generated admin code: ${adminCode}`);

            const updatedRequest = {
                ...request,
                status: 'approved',
                adminCode: adminCode,
                approvedBy: admin.id,
                approvedDate: new Date().toISOString(),
                codeUsed: false,
                codeUsedDate: null,
                registeredUserId: null
            };
            console.log(`updating request in dataBase...`, updatedRequest);
            const updateResponse = await axios.put(`http://localhost:4000/admin-code-requests/${request.id}`, updatedRequest);
            console.log("Request updated Successfully", updateResponse.data);

            const adminCodeEntry = {
                code: adminCode,
                status: 'approved',
                isUsed: false,
                createdAt: new Date().toISOString(),
                approvedBy: admin.id,
                requestId: request.id
            }

            const codeResponse = await axios.post(`http://localhost:4000/admin-codes`, adminCodeEntry)
            console.log('codeResponse: ', codeResponse.data);

            console.log(" Sending sms... ");
            const smsResult = await sendSMS(request.phoneNo, adminCode, request.name);
            console.log('smsResult: ', smsResult);

            console.log(" Sending email... ");
            const emailContent = AdminCodeUtils.formatApprovalEmails(request.name, request.phoneNo);
            const emailResult = await sendEmail(request.email, emailContent.subject, emailContent.message);
            console.log("Email Result", emailResult);

            const successMessage = `Request approved successfully
            Admin Code: ${adminCode}
            User: ${request.name}
            Phone: ${request.phoneNo}
            Email: ${request.email}
            Notification Status: ${smsResult.success ? 'SMS sent successfully' : `SMS Failed: ${smsResult.error || 'unknown error'}`}
             ${emailResult.success ? 'Email sent successfully' : `Email Failed: ${emailResult.error || 'unknown error'}`}
            The user can now use this admin code for registration`;

            alert(successMessage);

            resetDialogStates();
            await fetchAdminCodeRequests(true);
            setAdminCodeRequests(false);
        } catch (error) {
            console.error(' Error approving request', error);
            alert(`Failed to approve request: ${error.response?.data?.message || error.message} || unknown error`)
        }
    };

    const handleRejectRequest = async (request, reason = '') => {
        if (!reason.trim()) {
            setRejectDialogOpen(true);
            return;
        }

        try {

            if (!admin || !admin.id) {
                alert('Admin Information no found. Please login again.');
                return
            }
            const updatedRequest = {
                ...request,
                status: 'rejected',
                rejectedBy: admin.id,
                rejectedDate: new Date().toISOString(),
                rejectionReason: reason
            };
            await axios.put(`http://localhost:4000/admin-code-requests/${request.id}`, updatedRequest);
            const emailContent = AdminCodeUtils.formatApprovalEmails(request.name, reason);

            const emailResult = await sendEmail(request.email, emailContent.subject, emailContent.message);
            console.log('emailResult: ', emailResult);

            const successMessage = `Request rejected successful!
            User: ${request.name}
            Email: ${request.email}
            Reason: ${request.reason}
            
            Notification Status: ${emailResult.success ? 'Email sent successfully' :
                    `Email Failed: ${emailResult.error || 'Unknown Error'}`} The user has been notified about the rejection`

            alert(successMessage);
            resetDialogStates();
            await fetchAdminCodeRequests(true);
            setRequestDialogOpen(false);
        } catch (error) {
            alert(`Failed to reject request: ${error.response?.message || error.message || 'Unknown Error'}`)
        }
    };

    const handleRejectWithReason = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection for reason.');
            return;
        }
        handleRejectRequest(selectedRequest, rejectionReason);
    }

    const handleTabChange = (_event, newValue) => {
        setTabValue(newValue);
        if (newValue === 3) {
            fetchAdminCodeRequests(true)
        }
    };

    const handleUserSearch = useCallback((_event, value) => {
        setSearchQuery(value || '')
    }, []);

    // Debounce filtering with useMemo
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) {
            return allUsers; // Show all users when no search query
        }

        const query = searchQuery.toLocaleLowerCase();
        return allUsers.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.id.toLowerCase().includes(query)
                (user.phoneNo && user.phoneNo.includes(query))
        );

    }, [allUsers, searchQuery])

    const clearSearch = () => {
        setSearchQuery('');
    }

    const resetDialogStates = () => {
        setSelectedRequest(null);
        setRequestDialogOpen(false);
        setRejectDialogOpen(false);
        setRejectionReason('');
    }

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
                    <Tab label="Admin Code Requests" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
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
                                onChange={(_event, value) =>
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

            <TabPanel value={tabValue} index={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Admin Code Requests
                    </Typography>
                </Box>
                <Button
                    variant='outlined'
                    onClick={() => fetchAdminCodeRequests(true)}
                    sx={{ ml: 2 }}
                >
                    Refresh
                </Button>

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
                                                <TableCell>{booking.hotelName || booking.hotelId}</TableCell>
                                                <TableCell>{booking.startDate}</TableCell>
                                                <TableCell>{booking.endDate}</TableCell>
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

            {/* Admin Code Request Review Dialog */}
            <Dialog
                open={requestDialogOpen}
                onClose={() => setRequestDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
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
                                    <Typography><strong>Name:</strong> {selectedRequest.name}</Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Email:</strong> {selectedRequest.email}</Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Phone:</strong> {selectedRequest.phoneNo}</Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Organization:</strong> {selectedRequest.organization}</Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Position:</strong> {selectedRequest.position}</Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Department:</strong> {selectedRequest.department}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Request Date:</strong>{' '}
                                        {new Date(selectedRequest.requestDate).toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Status:</strong>
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
                                    <Typography><strong>Reason for Request:</strong></Typography>
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
                                            <Typography><strong>Admin Code:</strong> {selectedRequest.adminCode}</Typography>
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
                                                <Typography><strong>Rejection Reason:</strong></Typography>
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
                            <Button
                                onClick={() => handleRejectRequest(selectedRequest)}
                                color="error"
                            >
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
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
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
                        placeholder="Enter the reason for rejection e.g., Insufficient justification, Invalid organization, etc."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        resetDialogStates();
                    }}>
                        Cancel
                    </Button>
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

        </Container>
    );

};

export default AdminDashboard;
