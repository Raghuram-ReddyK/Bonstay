import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    IconButton
} from '@mui/material';
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

const SecuritySettings = ({ userInfo, showPassword, setShowPassword }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Security Settings
            </Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Password
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            value={userInfo?.password || ''}
                            disabled
                            fullWidth
                            size="small"
                        />
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        For security reasons, password changes require additional verification.
                    </Typography>
                </CardContent>
            </Card>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Account Security
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your account is protected with industry-standard security measures.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SecuritySettings;
