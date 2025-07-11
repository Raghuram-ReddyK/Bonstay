import { Typography, Grid, Card, CardContent } from '@mui/material';

const AdminHeader = ({ admin, allUsers, allBookings, allHotels }) => {
    return (
        <>
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
                            <Typography variant="h6" color="primary">
                                Total Users
                            </Typography>
                            <Typography variant="h4">{allUsers.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Total Bookings
                            </Typography>
                            <Typography variant="h4">{allBookings.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Available Hotels
                            </Typography>
                            <Typography variant="h4">{allHotels.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Active Bookings
                            </Typography>
                            <Typography variant="h4">{allBookings.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default AdminHeader;
