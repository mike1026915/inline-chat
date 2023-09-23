'use client'

import { ThemeOptions, createTheme } from '@mui/material/styles';

const green = "#0D4969";
const orange = "#FF6E06";

export const themeOptions: ThemeOptions =  createTheme({
    palette: {
        primary: {
            main: orange,
        },
        secondary: {
            main: green,
        }
    }
});