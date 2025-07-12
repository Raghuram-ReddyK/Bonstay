import { useState } from 'react';
import {
    Typography,
    Box,
    Grid,
    TextField,
    Autocomplete,
    Button,
    MenuItem,
    Paper,
    Divider,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import CustomDataGrid from '../CommonComponents/CustomDataGrid';

const CreateBooking = ({ allUsers, allHotels, handleCreateBooking }) => {
    const [formPart1, setFormPart1] = useState({
        userId: '',
        userName: '',
        hotelId: '',
        hotelName: '',
        checkIn: '',
        checkOut: '',
    });

    const [formPart2, setFormPart2] = useState({
        guests: 1,
        rooms: 1,
        roomType: 'Standard',
    });

    const [availableBookings, setAvailableBookings] = useState([]);
    const [selectedAvailableBookings, setSelectedAvailableBookings] = useState([]);
    const [selectedForFinalization, setSelectedForFinalization] = useState([]);
    const [selectedFinalizationBookings, setSelectedFinalizationBookings] = useState([]);

    const handleAddToAvailableBookings = () => {
        if (
            !formPart1.userId ||
            !formPart1.hotelId ||
            !formPart1.checkIn ||
            !formPart1.checkOut
        ) {
            alert('Please fill in all mandatory fields (User, Hotel, Check-in and Check-out dates)');
            return;
        }

        const checkInDate = new Date(formPart1.checkIn);
        const checkOutDate = new Date(formPart1.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            alert('Check-in date cannot be in the past');
            return;
        }

        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date');
            return;
        }

        const newBookingEntry = {
            tempId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            userId: formPart1.userId,
            userName: formPart1.userName,
            hotelId: formPart1.hotelId,
            hotelName: formPart1.hotelName,
            checkIn: formPart1.checkIn,
            checkOut: formPart1.checkOut,
            guests: formPart2.guests,
            rooms: formPart2.rooms,
            roomType: formPart2.roomType,
            duration: Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
            status: 'pending',
        };

        setAvailableBookings((prev) => [...prev, newBookingEntry]);

        setFormPart1({
            userId: '',
            userName: '',
            hotelId: '',
            hotelName: '',
            checkIn: '',
            checkOut: '',
        });

        setFormPart2({
            guests: 1,
            rooms: 1,
            roomType: 'Standard',
        });
    };

    const handleMoveToFinalization = () => {
        if (selectedAvailableBookings.length === 0) {
            alert('Please select bookings from the available bookings table');
            return;
        }

        const bookingsToMove = availableBookings.filter((booking) =>
            selectedAvailableBookings.includes(booking.tempId)
        );

        setSelectedForFinalization((prev) => [...prev, ...bookingsToMove]);
        setAvailableBookings((prev) =>
            prev.filter((booking) => !selectedAvailableBookings.includes(booking.tempId))
        );
        setSelectedAvailableBookings([]);
    };

    const handleRemoveFromFinalization = () => {
        if (selectedFinalizationBookings.length === 0) {
            alert('Please select bookings to remove');
            return;
        }

        setSelectedForFinalization((prev) =>
            prev.filter((booking) => !selectedFinalizationBookings.includes(booking.tempId))
        );
        setSelectedFinalizationBookings([]);
    };

    const handleFinalizeBookings = async () => {
        if (selectedFinalizationBookings.length === 0) {
            alert('Please select bookings to finalize');
            return;
        }

        try {
            let successCount = 0;
            let failureCount = 0;

            const bookingsToFinalize = selectedForFinalization.filter((booking) =>
                selectedFinalizationBookings.includes(booking.tempId)
            );

            for (const booking of bookingsToFinalize) {
                try {
                    const bookingData = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        userId: booking.userId,
                        hotelId: booking.hotelId,
                        hotelName: booking.hotelName,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                        guests: booking.guests,
                        rooms: booking.rooms,
                        roomType: booking.roomType,
                        status: 'confirmed',
                        bookingDate: new Date().toISOString().split('T')[0],
                        createdBy: 'admin',
                        createdAt: new Date().toISOString(),

                        noOfPersons: booking.guests,
                        noOfRooms: booking.rooms,
                        typeOfRoom: booking.roomType,
                        startDate: booking.checkIn,
                        endDate: booking.checkOut,
                    };

                    await handleCreateBooking(bookingData, false);
                    successCount++;
                } catch (error) {
                    console.error('Error creating booking:', error);
                    failureCount++;
                }
            }

            const summaryMessage = `Booking finalization complete!\n\nSummary:\nSuccessful: ${successCount} bookings\nFailed: ${failureCount} bookings\n${successCount > 0 ? 'Successful bookings are now visible in the Booking Management tab.' : ''
                }`;

            alert(summaryMessage);

            if (successCount > 0) {
                setSelectedForFinalization((prev) =>
                    prev.filter((booking) => !selectedFinalizationBookings.includes(booking.tempId))
                );
                setSelectedFinalizationBookings([]);
            }
        } catch (error) {
            console.error('Error finalizing bookings:', error);
            alert(`Error finalizing bookings: ${error.message}`);
        }
    };

    const columns = [
        {
            field: 'userName',
            headerName: 'User',
            width: 180,
            valueGetter: ({ row }) => row.userName || row.userId,
        },
        {
            field: 'hotelName',
            headerName: 'Hotel',
            width: 200,
        },
        {
            field: 'checkIn',
            headerName: 'Check In',
            width: 120,
        },
        {
            field: 'checkOut',
            headerName: 'Check Out',
            width: 120,
        },
        {
            field: 'guests',
            headerName: 'Guests',
            width: 80,
        },
        {
            field: 'rooms',
            headerName: 'Rooms',
            width: 80,
        },
        {
            field: 'roomType',
            headerName: 'Room Type',
            width: 120,
        },
        {
            field: 'duration',
            headerName: 'Duration',
            width: 100,
            valueGetter: ({ row }) => `${row.duration} night${row.duration > 1 ? 's' : ''}`,
        },
    ];

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Multi-Booking Management System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create multiple hotel bookings efficiently. Fill the form, add to available bookings, select desired bookings, and finalize them.
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Booking Form
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Part 1: Mandatory Information *
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={allUsers}
                                getOptionLabel={(option) => `${option.name} (${option.email}) ID: ${option.id}`}
                                value={allUsers.find((user) => user.id === formPart1.userId) || null}
                                onChange={(_e, value) =>
                                    setFormPart1((prev) => ({
                                        ...prev,
                                        userId: value?.id || '',
                                        userName: value?.name || '',
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Select User *" required helperText="Choose the user for this booking" />
                                )}
                                renderOption={(props, option) => (
                                    <Box component='li' {...props}>
                                        <Box>
                                            <Typography variant='body1'>{option.name}</Typography>
                                            <Typography variant='body2' color='text.secondary'>
                                                {option.email} ID: {option.id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={allHotels}
                                getOptionLabel={(option) => `${option.hotelName} - ${option.city}`}
                                value={allHotels.find((hotel) => hotel.id === formPart1.hotelId) || null}
                                onChange={(e, value) =>
                                    setFormPart1((prev) => ({
                                        ...prev,
                                        hotelId: value?.id || '',
                                        hotelName: value?.hotelName || '',
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Select Hotel *" required helperText="Choose a hotel" />
                                )}
                                renderOption={(props, option) => (
                                    <Box component='li' {...props}>
                                        <Box>
                                            <Typography variant='body1'>{option.hotelName}</Typography>
                                            <Typography variant='body2' color='text.secondary'>
                                                {option.city} ID: {option.phoneNo}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Check In Date *"
                                type="date"
                                value={formPart1.checkIn}
                                onChange={(e) => setFormPart1((prev) => ({ ...prev, checkIn: e.target.value }))}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: new Date().toISOString().split('T')[0],
                                }}
                                helperText="Check-in date (today or later)"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Check Out Date *"
                                type="date"
                                value={formPart1.checkOut}
                                onChange={(e) => setFormPart1((prev) => ({ ...prev, checkOut: e.target.value }))}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: formPart1.checkIn
                                        ? new Date(new Date(formPart1.checkIn).getTime() + 86400000).toISOString().split('T')[0]
                                        : new Date().toISOString().split('T')[0],
                                }}
                                helperText="Check-out date (must be after check-in)"
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Part 2: Additional Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                            <TextField
                                label="Number of Guests"
                                type="number"
                                value={formPart2.guests}
                                onChange={(e) =>
                                    setFormPart2((prev) => ({
                                        ...prev,
                                        guests: parseInt(e.target.value) || 1,
                                    }))
                                }
                                fullWidth
                                inputProps={{ min: 1, max: 10 }}
                                helperText="1-10 guests"
                            />
                        </Grid>

                        <Grid item xs={6} md={4}>
                            <TextField
                                label="Number of Rooms"
                                type="number"
                                value={formPart2.rooms}
                                onChange={(e) =>
                                    setFormPart2((prev) => ({
                                        ...prev,
                                        rooms: parseInt(e.target.value) || 1,
                                    }))
                                }
                                fullWidth
                                inputProps={{ min: 1, max: 5 }}
                                helperText="1-5 rooms"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                label="Room Type"
                                value={formPart2.roomType}
                                onChange={(e) =>
                                    setFormPart2((prev) => ({
                                        ...prev,
                                        roomType: e.target.value,
                                    }))
                                }
                                fullWidth
                                helperText="Select room type"
                            >
                                <MenuItem value="Standard">Standard Room</MenuItem>
                                <MenuItem value="Deluxe">Deluxe Room</MenuItem>
                                <MenuItem value="Suite">Suite</MenuItem>
                                <MenuItem value="Executive">Executive Room</MenuItem>
                                <MenuItem value="Presidential">Presidential Suite</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddToAvailableBookings}
                        disabled={
                            !formPart1.userId ||
                            !formPart1.hotelId ||
                            !formPart1.checkIn ||
                            !formPart1.checkOut
                        }
                    >
                        Add to Available Bookings
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFormPart1({
                                userId: '',
                                userName: '',
                                hotelId: '',
                                hotelName: '',
                                checkIn: '',
                                checkOut: '',
                            });
                            setFormPart2({
                                guests: 1,
                                rooms: 1,
                                roomType: 'Standard',
                            });
                        }}
                    >
                        Clear Form
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Available Bookings ({availableBookings.length})</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMoveToFinalization}
                        disabled={selectedAvailableBookings.length === 0}
                    >
                        Move Selected to Finalization ({selectedAvailableBookings.length})
                    </Button>
                </Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Select bookings from the table below using checkboxes, then click "Move Selected to Finalization" to proceed.
                </Alert>
                <CustomDataGrid
                    rows={availableBookings}
                    columns={columns}
                    pageSize={10}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    selectedRows={selectedAvailableBookings}
                    onSelectionChange={setSelectedAvailableBookings}
                    rowIdField="tempId"
                />
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Selected for Finalization ({selectedForFinalization.length})</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleRemoveFromFinalization}
                            disabled={selectedFinalizationBookings.length === 0}
                        >
                            Remove Selected ({selectedFinalizationBookings.length})
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleFinalizeBookings}
                            disabled={selectedFinalizationBookings.length === 0}
                            sx={{ px: 3 }}
                        >
                            Finalize Selected ({selectedFinalizationBookings.length})
                        </Button>
                    </Box>
                </Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                    Select bookings to finalize using checkboxes, then click "Finalize Selected" to create the bookings.
                </Alert>
                <CustomDataGrid
                    rows={selectedForFinalization}
                    columns={columns}
                    pageSize={10}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    selectedRows={selectedFinalizationBookings}
                    onSelectionChange={setSelectedFinalizationBookings}
                    rowIdField="tempId"
                />
            </Paper>
        </>
    );
};

export default CreateBooking;
