import React, {useState} from 'react';
import {Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Typography, useTheme} from '@mui/material';
import {DarkMode, History, Home, LightMode, Logout, Menu as MenuIcon, Search as SearchIcon} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {useUser} from "../../contexts/UserContext";


const UserMobile = ({
                        handleSearchDialogOpen,
                        toggleTheme,
                        searchOpen
                    }) => {
    const {user, logout} = useUser();
    const theme = useTheme();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);


    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <>
            <Box sx={{display: {xs: 'flex', md: 'none'}, alignItems: 'center', marginRight: '10px'}}>
                {!searchOpen && (
                    <>
                        {user && (
                            <Typography variant="body1" color="text.primary" sx={{marginRight: '10px'}}>
                                Hi, <Box component='span'
                                         color='primary.main'><strong>{user.name}</strong></Box>
                            </Typography>
                        )}
                        <IconButton onClick={toggleTheme} color="inherit">
                            {theme.palette.mode === 'dark' ? <LightMode/> : <DarkMode/>}
                        </IconButton>
                        {!user && (
                            <Button component={Link} to="/login" variant='contained'>LogIn</Button>
                        )}
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuClick}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                    </>
                )}

                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                >
                    {user && (
                        <>
                            <MenuItem>
                                <Avatar
                                    alt={user?.name}
                                    src={user?.picture}
                                    sx={{marginRight: '10px'}}
                                />
                                <Typography variant="body1" color="text.primary">
                                    {user.name}
                                </Typography>
                            </MenuItem>
                            <Divider/>
                        </>
                    )}
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                        <Home sx={{marginRight: '10px'}}/> Home
                    </MenuItem>
                    <MenuItem component={Link} to="/history" onClick={handleMenuClose}>
                        <History sx={{marginRight: '10px'}}/> History
                    </MenuItem>

                    {user && (
                        <>
                            <Divider/>
                            <MenuItem onClick={() => {
                                logout();
                                handleMenuClose();
                            }}>
                                <Logout sx={{marginRight: '10px'}}/> Logout
                            </MenuItem>
                        </>
                    )}
                </Menu>
            </Box>
        </>
    );
};

export default UserMobile;
