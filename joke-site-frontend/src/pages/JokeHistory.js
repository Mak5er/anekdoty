import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import {API_BASE_URL} from '../config';
import {useTheme} from '@mui/material/styles';

const JokeHistory = () => {
    const [jokes, setJokes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const observer = useRef();
    const theme = useTheme();

    const loadMoreJokes = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/joke/history`, {
                params: {offset: page * 10, limit: 10},
                withCredentials: true
            });

            if (response.data.length < 10) {
                setHasMore(false);
            }

            setJokes(prevJokes => {
                const newJokes = response.data.filter(joke => !prevJokes.some(prevJoke => prevJoke.id === joke.id));
                return [...prevJokes, ...newJokes];
            });
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error loading joke history:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

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
                            }}
                        >
                            <Typography variant="body1">{joke.text}</Typography>
                            <Typography variant="body2" color="textSecondary">{joke.tags}</Typography>
                        </Box>
                    );
                })}
                {loading && <CircularProgress/>}
            </Box>
        </Container>
    );
};

export default JokeHistory;