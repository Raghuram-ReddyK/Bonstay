import {
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    Paper,
} from '@mui/material';

const LoginForm = ({
    onSubmit,
    userType,
    setUserType,
    userIdOrEmail,
    setUserIdOrEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    acceptPrivacy,
    setAcceptPrivacy,
    onOpenPrivacyPolicy,
    onOpenForgotPassword,
    isLoading,
    emailLoading,
    idLoading,
    error,
    success
}) => {
    return (
        <Grid
            item
            xs={12}
            md={5}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 4,
                bgcolor: 'background.paper'
            }}
        >
            <Paper elevation={0} sx={{ p: 4, maxWidth: 400, mx: 'auto', width: '100%' }}>
                <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 600 }}>
                    Welcome Back
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Sign in to your Bonstay account
                </Typography>

                <Box component="form" onSubmit={onSubmit}>
                    {(isLoading || emailLoading || idLoading) && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Login As</InputLabel>
                        <Select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            label="Login As"
                        >
                            <MenuItem value="user">Normal User</MenuItem>
                            <MenuItem value="admin">Administrator</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="UserID or Email"
                        margin="normal"
                        required
                        value={userIdOrEmail}
                        onChange={(e) => setUserIdOrEmail(e.target.value)}
                        error={Boolean(error)}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(error)}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                        <FormControlLabel
                            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                            label="Remember me"
                        />
                        <Button variant="text" onClick={onOpenForgotPassword}>
                            Forgot Password?
                        </Button>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={acceptPrivacy}
                                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                            />
                        }
                        label={
                            <Typography variant="body2">
                                I agree to the{' '}
                                <Button variant="text" size="small" onClick={onOpenPrivacyPolicy}>
                                    Privacy Policy
                                </Button>
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!acceptPrivacy || isLoading || emailLoading || idLoading}
                        sx={{ py: 1.5, mb: 2 }}
                    >
                        {isLoading || emailLoading || idLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Box textAlign="center">
                        <Button variant="text" href="/Register">
                            Don't have an account? Sign Up
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
};

export default LoginForm;
