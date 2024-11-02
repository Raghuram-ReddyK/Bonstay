import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../Slices/themeSlice';
import { Switch } from '@mui/material';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const themeMode = useSelector((state) => state.theme.mode);

    const handleToggle = () => {
        dispatch(toggleTheme());
    }
    return (
        <div>
            <span>{themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
            <Switch checked={themeMode === 'dark'} onChange={handleToggle} />
        </div>
    )
}

export default ThemeToggle