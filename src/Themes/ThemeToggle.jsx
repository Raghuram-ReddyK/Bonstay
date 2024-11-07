import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../Slices/themeSlice';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';


const ThemeToggle = () => {
    const dispatch = useDispatch();
    const colorScheme = useSelector((state) => state.theme.colorScheme);

    const handleColorChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            
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
                    <MenuItem value="red">Yellow</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default ThemeToggle;
