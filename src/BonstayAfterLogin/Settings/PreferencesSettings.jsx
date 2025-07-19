import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../Slices/themeSlice';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';

const PreferencesSettings = ({ language, setLanguage }) => {
    const dispatch = useDispatch();
    const colorScheme = useSelector((state) => state.theme.colorScheme);

    const handleThemeChange = (newTheme) => {
        dispatch(setTheme(newTheme));
    };

    const themeOptions = [
        { value: 'default', label: 'Default (Dark)', color: '#121212' },
        { value: 'blue', label: 'Blue', color: '#1976d2' },
        { value: 'red', label: 'Yellow', color: '#f57c00' },
        { value: 'green', label: 'Green', color: '#388e3c' },
        { value: 'light', label: 'Light', color: '#ffffff' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                App Preferences
            </Typography>
            <Stack spacing={3}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Theme Mode
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Choose your preferred color theme for the application
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={2}>
                            {themeOptions.map((theme) => (
                                <Button
                                    key={theme.value}
                                    variant={colorScheme === theme.value ? 'contained' : 'outlined'}
                                    onClick={() => handleThemeChange(theme.value)}
                                    size="small"
                                    sx={{
                                        minWidth: '100px',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: theme.color,
                                            border: theme.value === 'light' ? '1px solid #ccc' : 'none'
                                        },
                                        pl: 3
                                    }}
                                >
                                    {theme.label}
                                </Button>
                            ))}
                        </Box>
                        {colorScheme && (
                            <Box sx={{ mt: 2 }}>
                                <Chip 
                                    label={`Current: ${themeOptions.find(t => t.value === colorScheme)?.label || 'Default'}`}
                                    color="primary"
                                    size="small"
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Language
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select your preferred language for the interface
                        </Typography>
                        <FormControl fullWidth size="small">
                            <InputLabel>Language</InputLabel>
                            <Select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                label="Language"
                            >
                                <MenuItem value="en">🇺🇸 English</MenuItem>
                                <MenuItem value="hi">🇮🇳 Hindi (हिंदी)</MenuItem>
                                <MenuItem value="es">🇪🇸 Spanish (Español)</MenuItem>
                                <MenuItem value="fr">🇫🇷 French (Français)</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default PreferencesSettings;
