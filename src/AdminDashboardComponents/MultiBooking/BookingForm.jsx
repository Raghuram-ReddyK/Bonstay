import { useDispatch, useSelector } from 'react-redux';
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
    CircularProgress,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Add as AddIcon } from '@mui/icons-material';
import {
    setFormPart1,
    setFormPart2,
    clearForm,
    addAvailableBooking,
    setErrors,
} from '../../Slices/multiBookingSlice';

const BookingForm = () => {
    const dispatch = useDispatch();

    const {
        formPart1,
        formPart2,
        errors,
        users,
        hotels,
        loading,
    } = useSelector((state) => state.multiBooking);

    // Validation function
    const validateFormPart1 = () => {
        const newErrors = {
            userId: !formPart1.userId,
            hotelId: !formPart1.hotelId,
            checkIn: !formPart1.checkIn,
            checkOut: !formPart1.checkOut,
        };
        const hasErrors = Object.values(newErrors).some((error) => error);
        dispatch(setErrors({ formPart1: newErrors }));
        return hasErrors;
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
                formPart1: { ...errors.formPart1, checkOut: true }
            }));
            return false;
        }

        return true;
    };

    // Add booking to available bookings table
    const handleAddToAvailableBookings = () => {
        if (validateFormPart1() || !validateDates()) {
            return;
        }

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
            duration: Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
        };

        dispatch(addAvailableBooking(newBooking));
        dispatch(clearForm());
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Booking Form
            </Typography>

            {/* Part 1: Mandatory Fields */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Part 1: Mandatory Information*
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) =>
                                `${option.name} (${option.email}) ID: ${option.id}`
                            }
                            value={users.find(user => user.id === formPart1.userId) || null}
                            onChange={(_event, value) =>
                                dispatch(setFormPart1({
                                    userId: value?.id || '',
                                    userName: value?.name || ''
                                }))
                            }
                            loading={loading.users}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select User"
                                    required
                                    error={errors.formPart1.userId}
                                    helperText={errors.formPart1.userId ? "Please select a user" : "Choose the user for this booking"}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading.users ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Box>
                                        <Typography variant="body1">{option.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
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
                            value={hotels.find(hotel => hotel.id === formPart1.hotelId) || null}
                            onChange={(_event, value) =>
                                dispatch(setFormPart1({
                                    hotelId: value?.id || '',
                                    hotelName: value?.hotelName || ''
                                }))
                            }
                            loading={loading.hotels}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Hotel*"
                                    required
                                    error={errors.formPart1.hotelId}
                                    helperText={errors.formPart1.hotelId ? "Please select a hotel" : "Choose a hotel"}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading.hotels ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Box>
                                        <Typography variant="body1">{option.hotelName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {option.city} {option.phoneNo}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MobileDatePicker
                            label="Check In Date *"
                            value={formPart1.checkIn ? new Date(formPart1.checkIn) : null}
                            onChange={(newValue) => {
                                dispatch(setFormPart1({
                                    checkIn: newValue ? newValue.toISOString().split('T')[0] : ''
                                }));
                            }}
                            minDate={new Date()}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    error: errors.formPart1.checkIn,
                                    helperText: errors.formPart1.checkIn ? "Check-in date cannot be in the past" : "Check-in date (today or later)"
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
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    error: errors.formPart1.checkOut,
                                    helperText: errors.formPart1.checkOut ? "Check-out date must be after check-in" : "Check-out date (must be after check-in)"
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Part 2: Optional Fields */}
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
                                dispatch(setFormPart2({ guests: parseInt(e.target.value) || 1 }))
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
                                dispatch(setFormPart2({ rooms: parseInt(e.target.value) || 1 }))
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
                                dispatch(setFormPart2({ roomType: e.target.value }))
                            }
                            fullWidth
                            helperText="Select room type"
                        >
                            <MenuItem value="standard">Standard Room</MenuItem>
                            <MenuItem value="Deluxe">Deluxe Room</MenuItem>
                            <MenuItem value="Suite">Suite</MenuItem>
                            <MenuItem value="Executive">Executive Room</MenuItem>
                            <MenuItem value="Presidential">Presidential Suite</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddToAvailableBookings}
                    disabled={!formPart1.userId || !formPart1.hotelId || !formPart1.checkIn || !formPart1.checkOut}
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
    );
};

export default BookingForm;
