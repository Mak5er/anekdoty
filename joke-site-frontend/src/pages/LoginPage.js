import React from 'react';
import {GoogleLogin} from '@react-oauth/google';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import {useUser} from "../contexts/UserContext";

const LoginPage = () => {
    const { responseGoogle } = useUser();

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
            <Typography variant='h3' mb='16px'><strong>Log In</strong></Typography>
            <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle}/>
        </Box>
    );
};

export default LoginPage;
