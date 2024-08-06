import React, {useEffect, useState} from 'react';
import {AppBar, Box, Button, Toolbar, useMediaQuery, useTheme} from '@mui/material';
import {History, Home} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import UserMobile from "../header/UserMobile";
import {ReactComponent as LogoDesktop} from '../../images/logo.svg';
import {ReactComponent as LogoMobile} from '../../images/logo-mobile.svg';
import UserDesktop from "./UserDesktop";
import SearchMenu from './SearchMenu'; // Import the shared search component

const Header = ({toggleTheme}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
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
                <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
                        {isMobile ? (
                            <LogoMobile
                                alt="Mobile Logo"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    marginRight: '8px',
                                    fill: theme.palette.primary.main,
                                    stroke: theme.palette.primary.main
                                }}
                            />
                        ) : (
                            <LogoDesktop
                                alt="Desktop Logo"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    marginRight: '8px',
                                    fill: theme.palette.primary.main,
                                    stroke: theme.palette.primary.main
                                }}
                            />
                        )}
                    </Link>
                    <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                        <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
                            <Button component={Link} to="/" sx={{color: 'text.primary', mr: 2}} startIcon={<Home/>}>
                                Home
                            </Button>
                            <Button component={Link} to="/history" sx={{color: 'text.primary', mr: 2}}
                                    startIcon={<History/>}>
                                History
                            </Button>
                        </Box>
                        <Box sx={{display:'flex', alignItems: 'center', flexGrow: 1}}>
                            <SearchMenu searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <UserDesktop toggleTheme={toggleTheme}/>
                    <UserMobile toggleTheme={toggleTheme} searchOpen={searchOpen}/>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
