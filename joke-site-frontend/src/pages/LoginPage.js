import React from 'react';
import {GoogleLogin} from '@react-oauth/google';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";

const LoginPage = ({onSuccess, onError}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'default',
            }}
        >
            <Typography variant='h3' mb='16px'><strong>SignIn please</strong></Typography>
            <GoogleLogin onSuccess={onSuccess} onError={onError}/>
        </Box>
    );
};

export default LoginPage;
