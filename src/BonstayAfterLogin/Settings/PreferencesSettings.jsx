import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Button,
    TextField
} from '@mui/material';

const PreferencesSettings = ({ theme, setTheme, language, setLanguage }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                App Preferences
            </Typography>
            <Stack spacing={3}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Theme
                        </Typography>
                        <Box display="flex" gap={2}>
                            <Button
                                variant={theme === 'light' ? 'contained' : 'outlined'}
                                onClick={() => setTheme('light')}
                                size="small"
                            >
                                Light
                            </Button>
                            <Button
                                variant={theme === 'dark' ? 'contained' : 'outlined'}
                                onClick={() => setTheme('dark')}
                                size="small"
                            >
                                Dark
                            </Button>
                            <Button
                                variant={theme === 'auto' ? 'contained' : 'outlined'}
                                onClick={() => setTheme('auto')}
                                size="small"
                            >
                                Auto
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Language
                        </Typography>
                        <TextField
                            select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            size="small"
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </TextField>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default PreferencesSettings;
