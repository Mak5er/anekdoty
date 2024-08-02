import React, {useEffect, useRef, useState} from 'react';
import {
    alpha,
    AppBar,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    InputAdornment,
    InputBase,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import {
    Close as CloseIcon,
    DarkMode,
    History,
    Home,
    LightMode,
    Logout,
    Menu as MenuIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {ReactComponent as Logo} from '../images/logo.svg';

import {useUser} from "../contexts/UserContext";
import {useJoke} from "../contexts/JokeContext";

const Header = ({toggleTheme}) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const theme = useTheme();
    const searchRef = useRef(null);
    const {user, logout} = useUser();
    const {fetchJokeByIdData, searchJokesData, isLoading} = useJoke();
    const {searchResults, setSearchResults} = useJoke();


    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    const handleSearchChange = async (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.length > 2) {
            await searchJokesData(term);
        } else {
            // Clear search results if term is less than 3 characters
            setSearchResults([]);
        }
    };

    const handleSearchResultClick = (joke) => {
        fetchJokeByIdData(joke.id);
        setSearchTerm('');
        setSearchResults([]);
        setIsSearchDialogOpen(false);
    };

    const handleSearchDialogOpen = () => {
        setIsSearchDialogOpen(true);
    };

    const handleSearchDialogClose = () => {
        setIsSearchDialogOpen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    return (
        <>
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
                            <Logo
                                alt="Logo"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    marginRight: '8px',
                                    fill: theme.palette.primary.main,
                                    stroke: theme.palette.primary.main
                                }}
                            />
                        </Link>
                        <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
                            <Button component={Link} to="/" sx={{color: 'text.primary', mr: 2}} startIcon={<Home/>}>
                                Home
                            </Button>
                            <Button component={Link} to="/history" sx={{color: 'text.primary', mr: 2}}
                                    startIcon={<History/>}>
                                History
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        {user && (
                            <Box
                                ref={searchRef}
                                sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center', position: 'relative'}}
                            >
                                <SearchIcon sx={{color: theme.palette.text.secondary, mr: 1}}/>
                                <InputBase
                                    sx={{
                                        color: 'inherit',
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? alpha(theme.palette.common.white, 0.15)
                                            : alpha(theme.palette.common.black, 0.05),
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.common.white, 0.25)
                                                : alpha(theme.palette.common.black, 0.1),
                                        },
                                        borderRadius: 1,
                                        padding: '0 8px',
                                        width: '300px',
                                        transition: theme.transitions.create(['width', 'background-color']),
                                    }}
                                    placeholder="Search…"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    endAdornment={
                                        isLoading ? (
                                            <InputAdornment position="end">
                                                <CircularProgress size={24} sx={{color: theme.palette.text.secondary}}/>
                                            </InputAdornment>
                                        ) : (
                                            searchResults.length > 0 && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => {
                                                            setSearchTerm('');
                                                            setSearchResults([]);
                                                        }}
                                                        sx={{color: theme.palette.text.secondary}}
                                                    >
                                                        <CloseIcon/>
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        )
                                    }
                                />
                                {isLoading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            position: 'absolute',
                                            right: '8px',
                                            color: theme.palette.text.secondary,
                                        }}
                                    />
                                )}
                                {searchResults.length > 0 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '40px',
                                            left: 0,
                                            width: '100%',
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            backgroundColor: theme.palette.background.default,
                                            boxShadow: theme.shadows[5],
                                            zIndex: 10,
                                            color: theme.palette.text.primary,
                                            padding: '8px',
                                            border: `1px solid ${theme.palette.primary.main}`,
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                        }}
                                    >

                                        {searchResults.map((joke) => (
                                            <Box
                                                key={joke.id}
                                                sx={{
                                                    padding: '8px',
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                }}
                                                onClick={() => {
                                                    handleSearchResultClick(joke);
                                                    setSearchTerm(''); // Clear the search term
                                                }}
                                            >
                                                {truncateText(joke.text, 50)}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}, alignItems: 'center', marginRight: '10px'}}>
                        {user && (
                            <>
                                <SearchIcon onClick={handleSearchDialogOpen} sx={{marginRight: '10px'}}/>
                                <Typography variant="body1" color="text.primary" sx={{marginRight: '10px'}}>
                                    Hi, <Box component='span' color='primary.main'><strong>{user.name}</strong></Box>
                                </Typography>
                            </>
                        )}
                        <IconButton onClick={toggleTheme} color="inherit">
                            {theme.palette.mode === 'dark' ? <LightMode/> : <DarkMode/>}
                        </IconButton>
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
                                <MenuItem onClick={handleSearchDialogOpen}>
                                    <SearchIcon sx={{marginRight: '10px'}}/> Search
                                </MenuItem>
                            )}


                            {user && (
                                <MenuItem onClick={logout}>
                                    <Logout sx={{marginRight: '10px'}}/> Logout
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                    <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
                        {user && (
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body1" color="text.primary" sx={{marginRight: '10px'}}>
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
                        <IconButton onClick={toggleTheme} color="inherit">
                            {theme.palette.mode === 'dark' ? <LightMode/> : <DarkMode/>}
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>

            <Dialog
                open={isSearchDialogOpen}
                onClose={() => {
                    handleSearchDialogClose();
                    setSearchTerm(''); // Clear the search term
                }}
                fullWidth
                maxWidth="sm"
                sx={{display: {md: 'none'}}}
            >
                <DialogContent
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 2
                    }}
                >
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            handleSearchDialogClose();
                            setSearchTerm(''); // Clear the search term
                        }}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            color: theme.palette.text.secondary,
                            float: 'right',
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            mt: '20px'
                        }}
                    >
                        <InputBase
                            sx={{
                                color: 'inherit',
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.common.white, 0.15)
                                    : alpha(theme.palette.common.black, 0.05),
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.25)
                                        : alpha(theme.palette.common.black, 0.1),
                                },
                                borderRadius: 1,
                                padding: '0 8px',
                                width: '300px',
                                transition: theme.transitions.create(['width', 'background-color']),
                            }}
                            placeholder="Search…"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    {isLoading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <Box sx={{flex: 1, overflowY: 'auto'}}>
                            {searchResults.map((joke) => (
                                <Box
                                    key={joke.id}
                                    sx={{
                                        padding: '8px',
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        },
                                    }}
                                    onClick={() => handleSearchResultClick(joke)}
                                >
                                    {truncateText(joke.text, 50)}
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Header;
