import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import {IconButton, useTheme} from '@mui/material';
import {DarkMode, LightMode} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {ReactComponent as Logo} from '../images/logo.svg';

const Header = ({user, logout, toggleTheme}) => {
    const [anchorEl, setAnchorEl] = useState(null);
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
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                >
                    <MenuItem component={Link} to='/history'>History</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
