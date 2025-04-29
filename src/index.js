import ReactDOM          from 'react-dom/client';
import { ThemeProvider,
    createTheme,
    CssBaseline }   from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './api/queryClient';
import App             from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={createTheme()}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </ThemeProvider>
);