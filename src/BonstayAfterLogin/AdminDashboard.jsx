import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

import {
    Container,
    CircularProgress,
    Box,
    Tab,
    Tabs,
} from '@mui/material';
import { AdminCodeUtils, emailService, smsService } from '../services/communicationServices';
// import AdminHeader from '../AdminDashboardComponents/AdminHeader';
import UserManagement from '../AdminDashboardComponents/UserManagement';
import BookingManagement from '../AdminDashboardComponents/BookingManagement';
import CreateBooking from '../AdminDashboardComponents/CreateBooking';
import AdminCodeRequests from '../AdminDashboardComponents/AdminCodeRequests';
import AdminCodeRequestDialog from '../AdminDashboardComponents/AdminCodeRequestDialog';
import UserDetailsDialog from '../AdminDashboardComponents/UserDetailsDialog';
import AdminQuickActions from '../AdminDashboardComponents/AdminQuickActions';
import AdminAnalytics from '../AdminDashboardComponents/AdminAnalytics';
import AdminSystemMonitoring from '../AdminDashboardComponents/AdminSystemMonitoring';
import AdminActivityLogs from '../AdminDashboardComponents/AdminActivityLogs';
import AdminNotificationCenter from '../AdminDashboardComponents/AdminNotificationCenter';
import { getApiUrl } from '../config/apiConfig';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [allHotels, setAllHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [adminCodeRequests, setAdminCodeRequests] = useState([]);
    const [requestDialogOpen, setRequestDialogOpen] = useState('');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedRequest, setSelectedRequest] = useState('');

    useEffect(() => {
        fetchAdminData();
        fetchAllUsers();
        fetchAllBookings();
        fetchAllHotels();
        fetchAdminCodeRequests();
    }, []);

    const fetchAdminData = async () => {
        try {
            const adminId = sessionStorage.getItem('id');
            if (adminId) {
                const response = await axios.get(getApiUrl(`/users/${adminId}`));
                setAdmin(response.data);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(getApiUrl(`/users`));
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
            const response = await axios.get(getApiUrl(`/bookings`));
            setAllBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchAllHotels = async () => {
        try {
            const response = await axios.get(getApiUrl(`/hotels`));
            setAllHotels(response.data);
        } catch (error) {
            console.error("Error fetching hotels", error);
        }
    }

    const fetchAdminCodeRequests = async (forceRefresh = false) => {
        try {
            const timeStamp = Date.now();
            const url = forceRefresh ? getApiUrl(`/admin-code-requests?_t=${timeStamp}&_nocache=true`) :
                getApiUrl(`admin-code-requests?_t=${timeStamp}`)
            const response = await axios.get(url, {
                headers: {
                    'Cache-control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            setAdminCodeRequests(response.data || [])
        } catch (error) {
            console.error("Error fetching admin code request:", error);
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
            const updateResponse = await axios.put(getApiUrl(`/admin-code-requests/${request.id}`), updatedRequest);
            console.log("Request updated Successfully", updateResponse.data);

            const adminCodeEntry = {
                code: adminCode,
                status: 'approved',
                isUsed: false,
                createdAt: new Date().toISOString(),
                approvedBy: admin.id,
                requestId: request.id
            }

            const codeResponse = await axios.post(getApiUrl(`/admin-codes`), adminCodeEntry)
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
            await fetchAdminCodeRequests();
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
            await axios.put(getApiUrl(`/admin-code-requests/${request.id}`), updatedRequest);
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
        if (newValue === 5) {
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

    const getHotelName = (booking) => {
        if (booking.hotelName)
            return booking.hotelName;
        if (booking.hotel)
            return booking.hotel;

        if (booking.hotelId && allHotels.length > 0) {
            const hotel = allHotels.find(h => h.id === booking.hotelId);
            if (hotel)
                return hotel.hotelName;
        }

        return 'Unknown Hotel';
    }

    const getRoomsCount = (booking) => {
        return booking.rooms || booking.noOfPersons || 1;
    };

    const handleViewUserDetails = (user) => {
        setSelectedUser(user);
        setUserDialogOpen(true);
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
            {/* <AdminHeader
                admin={admin}
                allUsers={allUsers}
                allBookings={allBookings}
                allHotels={allHotels}
            /> */}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Analytics" />
                    <Tab label="User Management" />
                    <Tab label="Booking Management" />
                    <Tab label="Create Booking" />
                    <Tab label="Admin Code Requests" />
                    <Tab label="System Monitoring " />
                    <Tab label="Activity Logs" />
                    <Tab label="Notifications" />

                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <AdminQuickActions
                    onTabChange={handleTabChange}
                    admin={admin}
                    allUsers={allUsers}
                    allBookings={allBookings}
                    allHotels={allHotels}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <AdminAnalytics
                    allUsers={allUsers}
                    allBookings={allBookings}
                    allHotels={allHotels}
                    onRefresh={() => {
                        fetchAllUsers();
                        fetchAllBookings();
                        fetchAllHotels();
                    }}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <UserManagement
                    allUsers={allUsers}
                    searchQuery={searchQuery}
                    filteredUsers={filteredUsers}
                    isLoading={isLoading}
                    handleUserSearch={handleUserSearch}
                    clearSearch={clearSearch}
                    getUserBookings={getUserBookings}
                    handleViewUserDetails={handleViewUserDetails}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <BookingManagement
                    allBookings={allBookings}
                    isLoading={isLoading}
                    getHotelName={getHotelName}
                    getRoomsCount={getRoomsCount}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <CreateBooking />
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
                <AdminCodeRequests
                    adminCodeRequests={adminCodeRequests}
                    fetchAdminCodeRequests={fetchAdminCodeRequests}
                    setSelectedRequest={setSelectedRequest}
                    setRequestDialogOpen={setRequestDialogOpen}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={6}>
                <AdminSystemMonitoring />
            </TabPanel>

            <TabPanel value={tabValue} index={7}>
                <AdminActivityLogs />
            </TabPanel>

            <TabPanel value={tabValue} index={8}>
                <AdminNotificationCenter />
            </TabPanel>

            <UserDetailsDialog
                userDialogOpen={userDialogOpen}
                setUserDialogOpen={setUserDialogOpen}
                selectedUser={selectedUser}
                getUserBookings={getUserBookings}
                getHotelName={getHotelName}
                getRoomsCount={getRoomsCount}
            />

            <AdminCodeRequestDialog
                requestDialogOpen={requestDialogOpen}
                rejectDialogOpen={rejectDialogOpen}
                selectedRequest={selectedRequest}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                resetDialogStates={resetDialogStates}
                handleApproveRequest={handleApproveRequest}
                handleRejectRequest={handleRejectRequest}
                handleRejectWithReason={handleRejectWithReason}
            />

        </Container >
    );

};

export default AdminDashboard;
