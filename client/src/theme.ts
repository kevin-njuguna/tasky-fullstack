import { createTheme } from "@mui/material";

const softTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7C4DFF", 
    },
    secondary: {
      main: "#B39DDB", 
    },
    background: {
      default: "#f5f6fa", 
      paper: "#ffffff",
    },
    text: {
      primary: "#2e2e2e",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(to right, #7C4DFF, #B39DDB)",
          color: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

export default softTheme;
