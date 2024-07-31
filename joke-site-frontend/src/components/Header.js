import React, {useEffect, useState} from 'react';
import {AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme} from '@mui/material';
import {DarkMode, History, Home, LightMode, Menu as MenuIcon} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {ReactComponent as Logo} from '../images/logo.svg';

const Header = ({user, logout, toggleTheme}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const theme = useTheme();

    // Handle menu click
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Handle menu close
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle hamburger menu click
    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    // Handle hamburger menu close
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // Handle scroll event to add shadow to AppBar
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    useEffect(() => {
        // Attach scroll event listener
        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'transparent',
                boxShadow: isScrolled ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                transition: 'background-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s',
            }}
        >
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
                        <Logo alt="Logo"
                              style={{
                                  height: '40px',
                                  width: 'auto',
                                  marginRight: '8px',
                                  fill: theme.palette.primary.main,
                                  stroke: theme.palette.primary.main
                              }}/>
                    </Link>
                    <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
                        <Button component={Link} to="/" sx={{color: 'text.primary', mr: 2}} startIcon={<Home/>}>
                            Home
                        </Button>
                        <Button component={Link} to="/history" sx={{color: 'text.primary', mr: 2}} startIcon={<History/>}>
                            History
                        </Button>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {user && (
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Typography variant="body1" color="text.primary" sx={{marginRight: '10px'}}>
                                Hi, <Box component='span' color='primary.main'><strong>{user.name}</strong></Box>
                            </Typography>
                            <Avatar
                                alt={user?.name}
                                src={user?.picture} // Use URL with timestamp to force reload
                                onClick={handleClick}
                                sx={{marginRight: '10px'}}
                                loading={'lazy'}/>
                            <IconButton
                                title="Change Theme"
                                onClick={toggleTheme}
                                sx={{p: 0, color: 'text.secondary'}}
                            >
                                {theme.palette.mode === 'light' ? <DarkMode/> : <LightMode/>}
                            </IconButton>
                        </Box>
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
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                            <Home sx={{marginRight: '10px'}}/> Home
                        </MenuItem>
                        <MenuItem component={Link} to="/history" onClick={handleMenuClose}>
                            <History sx={{marginRight: '10px'}}/> History
                        </MenuItem>
                        <MenuItem onClick={logout}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                >
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
