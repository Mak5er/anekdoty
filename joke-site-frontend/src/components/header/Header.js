import React, {useEffect, useState} from 'react';
import {
    alpha,
    AppBar,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogContent,
    IconButton,
    InputAdornment,
    InputBase,
    Toolbar,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {Close as CloseIcon, History, Home, Search as SearchIcon} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import UserMobile from "../header/UserMobile";

import {ReactComponent as LogoDesktop} from '../../images/logo.svg';
import {ReactComponent as LogoMobile} from '../../images/logo-mobile.svg';

import {useJoke} from "../../contexts/JokeContext";
import {useDebounce} from '../../hooks/useDebounce';
import UserDesktop from "./UserDesktop";

const Header = ({toggleTheme}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {fetchJokeData, searchJokesData, isLoading} = useJoke();
    const {searchResults, setSearchResults} = useJoke();


    const debouncedSearchTerm = useDebounce(searchTerm, 200);


    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (debouncedSearchTerm.length > 2) {
            searchJokesData(debouncedSearchTerm);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, searchJokesData, setSearchResults]);

    const handleSearchResultClick = (joke) => {
        fetchJokeData({joke_id: joke.id});
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
                        <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
                            <Button component={Link} to="/" sx={{color: 'text.primary', mr: 2}} startIcon={<Home/>}>
                                Home
                            </Button>
                            <Button component={Link} to="/history" sx={{color: 'text.primary', mr: 2}}
                                    startIcon={<History/>}>
                                History
                            </Button>
                            <Box sx={{display: 'flex', alignItems: 'center', position: 'relative'}}>
                                <IconButton
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    sx={{color: theme.palette.text.secondary}}
                                >
                                    <SearchIcon/>
                                </IconButton>

                                <Collapse in={searchOpen} orientation="horizontal"
                                          sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
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
                                                    <CircularProgress size={24}
                                                                      sx={{color: theme.palette.text.secondary}}/>
                                                </InputAdornment>
                                            ) : (
                                                searchResults.length > 0 && (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => {
                                                                setSearchOpen(false)
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
                                </Collapse>

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
                                                    setSearchOpen(false)
                                                    setSearchTerm(''); // Clear the search term
                                                }}
                                            >
                                                {truncateText(joke.text, 50)}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{display: {xs: 'flex', md: 'none'}, alignItems: 'center', marginLeft: '10px'}}>
                            <SearchIcon onClick={handleSearchDialogOpen}
                                        sx={{color: theme.palette.text.secondary}}/>
                        </Box>
                    </Box>

                    <UserDesktop toggleTheme={toggleTheme}/>
                    <UserMobile toggleTheme={toggleTheme} handleSearchDialogOpen={handleSearchDialogOpen}/>

                </Toolbar>
            </AppBar>

            <Dialog
                open={isSearchDialogOpen}
                onClose={() => {
                    handleSearchDialogClose();
                    setSearchTerm('');
                }}
                fullWidth
                maxWidth="sm"
                scroll="paper"
                sx={{
                    display: {md: 'none'},
                    "& .MuiDialog-container": {
                        alignItems: "flex-start",
                    },
                }}
                PaperProps={{sx: {mt: "52px"}}}
            >
                <DialogContent
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 1,
                    }}
                >
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            handleSearchDialogClose();
                            setSearchTerm('');
                        }}
                        sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            color: theme.palette.text.secondary,
                            float: 'right',
                            padding: 0,
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
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
                                width: '100%',
                                height: '40px',
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
