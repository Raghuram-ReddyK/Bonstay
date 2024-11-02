import { createTheme } from '@mui/material/styles';


const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#007bff',
        },
        secondary: {
            main: '#f06292',
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#007bff'
        },
        secondary: {
            main: '#f06292'
        }
    }
})

export { lightTheme, darkTheme };