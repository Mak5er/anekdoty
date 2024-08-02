import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../contexts/UserContext';
import { fetchJokeHistory } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const JokeHistory = () => {
    const [jokes, setJokes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const observer = useRef();
    const theme = useTheme();
    const { user } = useUser();
    const navigate = useNavigate(); // Hook for navigation

    const loadMoreJokes = useCallback(async () => {
        if (loading || !hasMore || !user) return;
        setLoading(true);
        try {
            const response = await fetchJokeHistory(page);

            if (response.length < 10) {
                setHasMore(false);
            }

            setJokes(prevJokes => {
                const newJokes = response.filter(joke => !prevJokes.some(prevJoke => prevJoke.id === joke.id));
                return [...prevJokes, ...newJokes];
            });
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error loading joke history:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, user]);

    useEffect(() => {
        loadMoreJokes();
    }, [loadMoreJokes]);

    const lastJokeElementRef = useCallback(node => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMoreJokes();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMoreJokes]);

    const handleJokeClick = (id) => {
        navigate(`/joke?id=${id}`);
    };

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: '9rem',
        }}>
            <Typography variant="h3" color='text.primary'>
                <strong>Історія</strong>
            </Typography>
            <Box pt='2rem'>
                {jokes.map((joke, index) => {
                    const isLastJoke = jokes.length === index + 1;

                    return (
                        <Box
                            key={joke.id}
                            ref={isLastJoke ? lastJokeElementRef : null}
                            onClick={() => handleJokeClick(joke.id)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: 2,
                                marginBottom: 2,
                                border: '1px solid',
                                borderColor: 'primary.main',
                                borderRadius: 4,
                                backgroundColor: theme.palette.background.default,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <Typography variant="body1" color={theme.palette.text.primary}>
                                {joke.text}
                            </Typography>
                        </Box>
                    );
                })}
                {loading && <CircularProgress />}
            </Box>
        </Container>
    );
};

export default JokeHistory;
