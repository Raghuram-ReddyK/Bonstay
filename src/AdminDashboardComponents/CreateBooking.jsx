import { useEffect } from 'react';
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
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import CustomDataGrid from '../CommonComponents/CustomDataGrid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useDispatch, useSelector } from 'react-redux';
import {
    addAvailableBooking,
    clearForm,
    clearFormErrors,
    clearMessage,
    createMultipleBookings,
    fetchHotels,
    fetchUsers,
    moveBackToAvailable,
    moveToFinalization,
    setErrors,
    setFormPart1,
    setFormPart2,
    setSelectedAvailableBookings,
    setSelectedFinalizationBookings
} from '../Slices/multiBookingSlice';


const CreateBooking = () => {
    const dispatch = useDispatch();

    // Redux state
    const {
        formPart1,
        formPart2,
        users,
        hotels,
        availableBookings,
        selectedAvailableBookings,
        selectedForFinalization,
        selectedFinalizationBookings,
        errors,
        error,
        success,
        creationResults,
        loading,
    } = useSelector((state) => state.multiBooking);
    console.log('users: ', users);
    console.log('hotels: ', hotels);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchHotels());

        return () => {
            dispatch(clearMessage());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(clearFormErrors());
    }, [formPart1, dispatch]);

    const validateFormPart1 = () => {
        const newErrors = {
            userId: !formPart1.userId,
            hotelId: !formPart1.hotelId,
            checkIn: !formPart1.checkIn,
            checkOut: !formPart1.checkOut,
        };

        const hasErrors = Object.values(newErrors).some(error => error);

        dispatch(setErrors({ formPart1: newErrors }));
        return !hasErrors;
    };

    // Date validation
    const validateDates = () => {
        if (!formPart1.checkIn || !formPart1.checkOut) return false;

        const checkInDate = new Date(formPart1.checkIn);
        const checkOutDate = new Date(formPart1.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            dispatch(setErrors({
                formPart1: { ...errors.formPart1, checkIn: true }
            }));
            return false;
        }

        if (checkOutDate <= checkInDate) {
            dispatch(setErrors({
                formPart1: { ...errors.formPart1, checkIn: true }
            }));
            return false;
        }

        return true;
    };

    const handleAddToAvailableBookings = () => {
        if (!validateFormPart1() || !validateDates()) return;

        const checkInDate = new Date(formPart1.checkIn);
        const checkOutDate = new Date(formPart1.checkOut);

        const newBooking = {
            tempId: Date.now().toString(),
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
        };

        dispatch(addAvailableBooking(newBooking));
        dispatch(clearForm());
    };

    const handleMoveToFinalization = () => {
        if (selectedAvailableBookings.length === 0) return;
        dispatch(moveToFinalization());
    };

    const handleRemoveFromFinalization = () => {
        if (selectedFinalizationBookings.length === 0) return;
        dispatch(moveBackToAvailable());
    };

    const handleFinalizeBookings = async () => {
        if (selectedForFinalization.length === 0 || selectedFinalizationBookings.length === 0) {
            dispatch(setErrors({ finalization: true }));
            return;
        }

        dispatch(setErrors({ finalization: false }));

        const bookingsToFinalize = selectedForFinalization.filter((booking) =>
            selectedFinalizationBookings.includes(booking.tempId)
        );

        const bookingData = bookingsToFinalize.map(booking => ({
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
            tempId: booking.tempId,
        }));

        dispatch(createMultipleBookings(bookingData));
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Multi-Booking Management System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create multiple hotel bookings efficiently. Fill the form, add to available bookings, select desired bookings, and finalize them.
                </Typography>

                {/* Global Error Display*/}
                {error && (
                    <Alert severity='error' sx={{ mt: 2 }} onClose={() => dispatch(clearMessage())} >
                        {error}
                    </Alert>
                )}
            </Box>

            {/* Success Results Display*/}
            {success && creationResults.length > 0 && (
                <Alert severity='success' sx={{ mt: 2 }} onClose={() => dispatch(clearMessage())}>
                    <Typography variant='subtitle2' gutterBottom>
                        Booking Creation Results:
                    </Typography>
                    <Typography variant='body2'>
                        Successfully created: {creationResults.filter(r => r.success).length} bookings
                    </Typography>
                    {creationResults.filter(r => !r.success).length > 0 && (
                        <Typography>
                            Failed: {creationResults.filter(r => !r.success).length} bookings
                        </Typography>
                    )}
                </Alert>
            )}

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
                                options={users}
                                getOptionLabel={(option) => `${option.name} (${option.email}) ID: ${option.id}`}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={users.find(user => user.id === formPart1.userId) || null}
                                onChange={(_e, value) =>
                                    dispatch(setFormPart1({
                                        userId: value?.id || '',
                                        userName: value?.name || '',
                                    }))
                                }
                                loading={loading.users}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select User *"
                                        required
                                        error={errors.formPart1.userId}
                                        helperText={errors.formPart1.userId ? "Please select a user" : "Choose the user for this booking"}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading.users ? <CircularProgress color='inherit' size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
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
                                options={hotels}
                                getOptionLabel={(option) => `${option.hotelName} - ${option.city}`}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={hotels.find(hotel => hotel.id === formPart1.hotelId) || null}
                                onChange={(_e, value) =>
                                    dispatch(setFormPart1({
                                        hotelId: value?.id || '',
                                        hotelName: value?.hotelName || '',
                                    }))
                                }
                                loading={loading.hotels}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Hotel *"
                                        required
                                        error={errors.formPart1.hotelId}
                                        helperText={errors.formPart1.hotelId ? "Please select a hotel" : "Choose a hotel"}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading.hotels ? <CircularProgress color='inherit' size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
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
                            <MobileDatePicker
                                label="Check In Date"
                                value={formPart1.checkIn ? new Date(formPart1.checkIn) : null}
                                onChange={(newValue) => {
                                    dispatch(setFormPart1({
                                        checkIn: newValue ? newValue.toISOString().split('T')[0] : ''
                                    }));
                                }}
                                minDate={new Date()}
                                slots={{
                                    textField: TextField,
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                        error: errors.formPart1.checkIn,
                                        helperText: errors.formPart1.checkIn ?
                                            "Check-in date cannot be in the past past" : "Check-in date (today or later)"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MobileDatePicker
                                label="Check Out Date *"
                                value={formPart1.checkOut ? new Date(formPart1.checkOut) : null}
                                onChange={(newValue) => {
                                    dispatch(setFormPart1({
                                        checkOut: newValue ? newValue.toISOString().split('T')[0] : ''
                                    }));
                                }}
                                minDate={formPart1.checkIn ? new Date(new Date(formPart1.checkIn).getTime() + 24 * 60 * 60 * 1000) : new Date()}
                                slots={{
                                    textField: TextField,
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                        error: errors.formPart1.checkOut,
                                        helperText: errors.formPart1.checkOut ?
                                            "Check-out date must be after check-in" : "Check-out date (mus be after check-in)"
                                    }
                                }}
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
                                    dispatch(setFormPart2({
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
                                    dispatch(setFormPart2({
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
                                    dispatch(setFormPart2({
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
                        onClick={() => dispatch(clearForm())}
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
                    onSelectionChange={(newSelection) => dispatch(setSelectedAvailableBookings(newSelection))}
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
                            disabled={selectedFinalizationBookings.length === 0 || loading.creating}
                            sx={{ px: 3 }}
                        >
                            {
                                loading.creating ? (
                                    <>
                                        <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
                                        Creating...
                                    </>
                                ) : (
                                    `Finalized Selected (${selectedFinalizationBookings.length})`
                                )}
                        </Button>
                    </Box>
                </Box>
                {errors.finalization && (
                    <Alert severity='error' sx={{ mb: 2 }}>
                        {selectedForFinalization.length === 0
                            ? "No bookings available for finalization. Please add bookings to the finalization first."
                            : "Please select bookings from the first table below using the checkboxes before clicking finalize"}
                    </Alert>
                )}
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
                    onSelectionChange={(newSelection) => dispatch(setSelectedFinalizationBookings(newSelection))}
                    rowIdField="tempId"
                />
            </Paper>
        </LocalizationProvider>
    );
};

export default CreateBooking;
