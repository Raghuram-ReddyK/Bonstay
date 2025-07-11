import { Autocomplete, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';

const CreateBooking = ({
    newBooking,
    setNewBooking,
    allUsers,
    allHotels,
    handleCreateBooking
}) => {
    return (
        <>
            <Typography variant='h5' gutterBottom>
                Create Booking for User
            </Typography>
            <Typography variant='body2' color="text.secondary" sx={{ mb: 3 }}>
                Use this form to create hotel bookings on behalf of users. All fields marked with * are required.
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={allUsers}
                            getOptionLabel={(option) => `${option.name} ${option.email} - ID: (${option.id})`}
                            value={allUsers.find(user => user.id === newBooking.userId) || null}
                            onChange={(_event, value) =>
                                setNewBooking(prev => ({ ...prev, userId: value?.id || '' }))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select User" required
                                    helperText="Choose the user for whom you're creating this booking"
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Box>
                                        <Typography variant='body1'>{option.name}</Typography>
                                        <Typography>
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
                            value={allHotels.find(hotel => hotel.id === newBooking.hotelId) || null}
                            onChange={(_event, value) => setNewBooking(prev => ({
                                ...prev,
                                hotelId: value?.id || '',
                                hotelName: value?.hotelName || ''
                            }))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Hotel"
                                    required
                                    helperText="Choose a hotel from available options"
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Box>
                                        <Typography variant="body1">{option.hotelName}</Typography>
                                        <Typography variant='body2' color='text.secondary'>
                                            {option.city} {option.phoneNo}
                                        </Typography>
                                        <Typography variant='caption' color='text.secondary'>
                                            {option.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
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
                            inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            helperText="Check-in date {today or later}"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Check Out Date"
                            type="date"
                            value={newBooking.checkOut}
                            onChange={(e) =>
                                setNewBooking(prev => ({ ...prev, checkOut: e.target.value }))
                            }
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: newBooking.checkIn ?
                                    new Date(new Date(newBooking.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                                    new Date().toISOString().split('T')[0]
                            }}
                            helperText="Check-out date (must be after check-in)"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Number of Guests"
                            type="number"
                            value={newBooking.guests}
                            onChange={(e) =>
                                setNewBooking(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))
                            }
                            fullWidth
                            inputProps={{ min: 1, max: 10 }}
                            helperText="Number of guests (1-10)"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Number of Rooms"
                            type='number'
                            value={newBooking.rooms}
                            onChange={(e) => setNewBooking(prev => ({ ...prev, rooms: parseInt(e.target.value) || 1 }))}
                            fullWidth
                            inputProps={{ min: 1, max: 5 }}
                            helperText="Number of rooms (1-5)"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Room Type"
                            value={newBooking.roomType}
                            onChange={(e) =>
                                setNewBooking(prev => ({ ...prev, roomType: e.target.value }))
                            }
                            fullWidth
                            helperText="Select the type of room" >
                            <MenuItem value='Standard'>Standard Room</MenuItem>
                            <MenuItem value='Deluxe'>Deluxe Room</MenuItem>
                            <MenuItem value='Suite'>Suite</MenuItem>
                            <MenuItem value='Executive'>Executive Room</MenuItem>
                            <MenuItem value='Presidential'>Presidential Room</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Summary Section */}
                    {newBooking.userId && newBooking.hotelId && newBooking.checkIn && newBooking.checkOut && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: 'background.paper',
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    mt: 2,
                                }}
                            >
                                <Typography variant="h6" gutterBottom>Booking Summary</Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography>
                                            <strong>User:</strong> {allUsers.find(u => u.id === newBooking.userId)?.name || 'Unknown'}
                                        </Typography>

                                        <Typography>
                                            <strong>Hotel:</strong>
                                            {(() => {
                                                const hotel = allHotels.find(h => h.id === newBooking.hotelId);
                                                return hotel ? `${hotel.hotelName} (${hotel.city})` : 'Unknown';
                                            })()}
                                        </Typography>

                                        <Typography><strong>Room Type:</strong> {newBooking.roomType}</Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography><strong>Check-in:</strong> {newBooking.checkIn}</Typography>
                                        <Typography><strong>Check-out:</strong> {newBooking.checkOut}</Typography>
                                        <Typography><strong>Guests:</strong> {newBooking.guests}</Typography>
                                        <Typography><strong>Rooms:</strong> {newBooking.rooms}</Typography>
                                        {newBooking.checkIn && newBooking.checkOut && (
                                            <Typography>
                                                <strong>Duration:</strong>{' '}
                                                {Math.ceil(
                                                    (new Date(newBooking.checkOut) - new Date(newBooking.checkIn)) /
                                                    (1000 * 60 * 60 * 24)
                                                )} night(s)
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleCreateBooking}
                                disabled={
                                    !newBooking.userId ||
                                    !newBooking.hotelId ||
                                    !newBooking.checkIn ||
                                    !newBooking.checkOut
                                }
                                size='large'
                            >
                                Create Booking
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setNewBooking({
                                        userId: '',
                                        hotelName: '',
                                        hotelId: '',
                                        checkIn: '',
                                        checkOut: '',
                                        guests: 1,
                                        rooms: 1,
                                        roomType: 'Standard',
                                    })
                                }
                                size="large"
                            >
                                Clear Form
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CreateBooking
