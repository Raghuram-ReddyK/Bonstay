import { createTheme } from '@mui/material/styles';
import { blue, pink, red, green, grey } from '@mui/material/colors';

// Light Theme
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue[500], // Primary color is blue
        },
        secondary: {
            main: pink[500], // Secondary color is pink
        },
        background: {
            default: grey[100], // Light grey background for the whole app
            paper: '#ffffff',   // White background for paper components like Card, Paper, etc.
        },
        text: {
            primary: '#000000', // Primary text color is black
            secondary: grey[700], // Secondary text color is a darker grey
        },
    },
});

// Black Theme (customized as a "dark" mode with black background)
const blackTheme = createTheme({
    palette: {
        mode: 'dark', // We're still using 'dark' as the base mode
        primary: {
            main: blue[500], // Primary color is blue
        },
        secondary: {
            main: pink[500], // Secondary color is pink
        },
        background: {
            default: '#000000', // Black background for the whole app
            paper: '#121212',   // A slightly lighter black for paper components
        },
        text: {
            primary: '#ffffff', // Primary text color is white
            secondary: grey[300], // Secondary text color is a lighter grey
        },
    },
});

// Custom Color Themes
const blueTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue[700], // Darker blue for primary color
        },
        secondary: {
            main: blue[300], // Lighter blue for secondary color
        },
        background: {
            default: '#e3f2fd', // Light blue background
            paper: '#ffffff',   // White background for paper components
        },
    },
});

const redTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: red[700], // Dark red for primary color
        },
        secondary: {
            main: red[300], // Lighter red for secondary color
        },
        background: {
            default: '#ffebee', // Light red background
            paper: '#ffffff',   // White background for paper components
        },
    },
});

const greenTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: green[700], // Dark green for primary color
        },
        secondary: {
            main: green[300], // Lighter green for secondary color
        },
        background: {
            default: '#e8f5e9', // Light green background
            paper: '#ffffff',   // White background for paper components
        },
    },
});

// Export themes
export { lightTheme, blackTheme, blueTheme, redTheme, greenTheme };
