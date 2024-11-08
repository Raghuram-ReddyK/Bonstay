import { createSlice } from "@reduxjs/toolkit";

// Define the color schemes (light, dark, blue, green, yellow)
const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        mode: 'dark', // Default theme
        colorScheme: 'default', // Default color scheme
    },
    reducers: {
        toggleTheme: (state) => {
            // Toggle between light and dark mode
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action) => {
            // Set the selected theme color
            state.colorScheme = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
