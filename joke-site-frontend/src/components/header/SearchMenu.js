import React, {useEffect, useState} from 'react';
import {alpha, Box, CircularProgress, Grow, IconButton, InputAdornment, InputBase, useTheme} from '@mui/material';
import {Close as CloseIcon, Search as SearchIcon} from '@mui/icons-material';
import {useJoke} from "../../contexts/JokeContext";
import {useDebounce} from '../../hooks/useDebounce';

const SearchMenu = ({searchOpen, setSearchOpen}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const {fetchJokeData, searchJokesData, isLoading, searchResults, setSearchResults} = useJoke();
    const debouncedSearchTerm = useDebounce(searchTerm, 200);
    const theme = useTheme();

    useEffect(() => {
        if (debouncedSearchTerm.length > 2) {
            searchJokesData(debouncedSearchTerm);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, searchJokesData, setSearchResults]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchResultClick = (joke) => {
        fetchJokeData({joke_id: joke.id});
        setSearchTerm('');
        setSearchResults([]);
        setSearchOpen(false);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    return (
        <Box sx={{position: 'relative', display: 'flex', flexDirection: 'row', flexGrow: 1, maxWidth: '400px'}}>
            <IconButton
                onClick={() => {
                    setSearchOpen(!searchOpen);
                    setSearchTerm('');
                }}
                sx={{color: theme.palette.text.secondary}}
            >
                <SearchIcon/>
            </IconButton>
            <Box sx={{display: 'flex', flexGrow: 1}}>
                <Grow in={searchOpen} style={{
                    transformOrigin: 'left center',
                    width: searchOpen ? '100%' : 0,
                    height: searchOpen ? '100%' : 0,
                }}>
                    <InputBase
                        fullWidth
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
                            transition: theme.transitions.create(['background-color']),
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
                                                setSearchOpen(false);
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
                </Grow>
            </Box>
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
                                setSearchOpen(false);
                                setSearchTerm('');
                            }}
                        >
                            {truncateText(joke.text, 50)}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SearchMenu;
