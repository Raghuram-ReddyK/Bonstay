import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, toggleTheme } from '../Slices/themeSlice';
import { MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme.mode);
    const colorScheme = useSelector((state) => state.theme.colorScheme);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleColorChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Theme Mode Toggle Button */}
            <IconButton onClick={handleThemeToggle} color="inherit">
                {themeMode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            {/* Theme Color Picker Dropdown */}
            <FormControl variant="outlined" sx={{ marginLeft: 2 }}>
                <InputLabel id="color-scheme-label">Theme Mode</InputLabel>
                <Select
                    labelId="color-scheme-label"
                    value={colorScheme}
                    onChange={handleColorChange}
                    label="Color Scheme"
                    autoWidth
                >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="blue">Blue</MenuItem>
                    <MenuItem value="red">Red</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default ThemeToggle;
