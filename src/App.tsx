import React from 'react';
import { ThemeProvider, createTheme, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import TodoList from './components/TodoList';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (min-width: 600px)': {
            padding: '24px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 2 }}>
        <TodoList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
