'use client';

import { createTheme } from '@mui/material/styles';
import { Space_Grotesk, Outfit, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00F0FF', // Neon Cyan
    },
    background: {
      default: '#0A0A0C', // Deep Obsidian
      paper: '#16161A',   // Graphite
    },
    text: {
      primary: '#E4E4E7', // Off-white
      secondary: '#71717A', // Slate
    },
    success: {
      main: '#00E599',
    },
    error: {
      main: '#FF3366',
    },
    divider: '#27272A',
  },
  typography: {
    fontFamily: outfit.style.fontFamily,
    h1: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 700,
    },
    h2: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 700,
    },
    h3: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 700,
    },
    h4: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 600,
    },
    h5: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 600,
    },
    h6: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 600,
    },
    button: {
      fontFamily: spaceGrotesk.style.fontFamily,
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: outfit.style.fontFamily,
    },
    overline: {
      fontFamily: jetBrainsMono.style.fontFamily,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
