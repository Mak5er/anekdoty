import React from 'react';
import {Avatar, Box, Button, IconButton, Typography} from '@mui/material';
import {DarkMode, LightMode, Logout} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import {useUser} from "../../contexts/UserContext";


const UserDesktop = ({toggleTheme}) => {
    const {user, logout} = useUser();
    const theme = useTheme();

    return (
        <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
            {user && (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="body1" color="text.primary" sx={{marginRight: '10px', marginLeft: '10px'}}>
                        Hi, <Box component='span' color='primary.main'><strong>{user.name}</strong></Box>
                    </Typography>
                    <Avatar
                        alt={user?.name}
                        src={user?.picture}
                        sx={{display: {xs: 'none', md: 'block'}}}
                    />
                    <IconButton onClick={logout} color="inherit">
                        <Logout/>
                    </IconButton>
                </Box>
            )}
            {!user && (
                <>
                    <Button component={Link} to="/login" variant='contained'>LogIn</Button>
                </>
            )}
            <IconButton onClick={toggleTheme} color="inherit">
                {theme.palette.mode === 'dark' ? <LightMode/> : <DarkMode/>}
            </IconButton>
        </Box>


    );
};

export default UserDesktop;
