import { Alert } from '@mui/material';
export default function Error({ children }) {
    return <Alert severity="error" sx={{ mt:4 }}>{children}</Alert>;
}