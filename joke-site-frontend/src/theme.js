import {createTheme} from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#59c174',
        },
        secondary: {
            main: '#2c2e48',
        },
        background: {
            default: '#fafafa',
        },
        text: {
            primary: '#2c2e48',
            secondary: '#878585',

        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#59c174',
        },
        secondary: {
            main: '#fafafa',
        },
        background: {
            default: '#2c2e48',
        },
        text: {
            primary: '#fafafa',
            secondary: '#878585',
        },
    },

    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});
