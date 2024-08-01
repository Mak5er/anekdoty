import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import { useTheme } from '@mui/material';
import axios from 'axios';
import CategoryModal from './CategoryModal';
import { API_BASE_URL } from '../config';

const GetJoke = ({ joke, setJoke, newJoke, votes, fetchVotes }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (joke && joke.id) {
            const url = new URL(window.location.origin);
            url.pathname = '/joke';
            url.searchParams.set('id', joke.id);
            navigate(url.pathname + url.search, { replace: true });        }
    }, [joke, navigate]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCategorySelect = async (tag) => {
        handleClose();
        try {
            const response = await axios.get(`${API_BASE_URL}/api/joke/category?tag=${tag}`, { withCredentials: true });
            if (!response.data.error) {
                setJoke(response.data);
                fetchVotes(response.data.id);
            }
        } catch (error) {
            console.error('Error fetching joke:', error);
        }
    };

    const handleVote = async (voteType) => {
        if (!joke || !joke.id) return;
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/joke/votes`,
                { joke_id: joke.id, vote_type: voteType },
                { withCredentials: true }
            );
            if (!response.data.error) {
                fetchVotes(joke.id);
            }
        } catch (error) {
            console.error('Error voting on joke:', error);
        }
    };

    const handleShare = () => {
        const jokeUrl = `${window.location.origin}/joke?id=${joke.id}`;
        navigator.clipboard.writeText(jokeUrl).then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => {
                setShowCopiedMessage(false);
            }, 2000);
        }).catch((error) => {
            console.error('Error copying URL:', error);
        });
    };

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <Typography variant='h3' color='secondary.main'>
                <strong>Анекдоти <Box component='span' color='primary.main'>Українською</Box></strong>
            </Typography>
            <Grid container justifyContent="center" sx={{ pt: '2rem' }}>
                <Grid item xs={12} md={10}>
                    <Box sx={{
                        p: 3,
                        border: '2px solid',
                        borderColor: theme.palette.primary.main,
                        borderRadius: '5px',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {joke ? (
                            <>
                                <Typography variant="body1" sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: '20px'
                                }}>{joke.text}</Typography>
                                {joke.tags && joke.tags.length > 0 && (
                                    <Typography variant="body2" sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: '16px'
                                    }}>
                                        {joke.tags}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontSize: '20px' }}>
                                Не знайдено анекдоту
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {votes && (
                <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
                    <Grid item>
                        <IconButton color="primary" onClick={() => handleVote('like')}>
                            <ThumbUpIcon />
                        </IconButton>
                        <Typography color={theme.palette.text.primary} variant="body2" display="inline" sx={{ verticalAlign: 'middle', marginLeft: '4px' }}>
                            {votes.likes}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton color="primary" onClick={() => handleVote('dislike')}>
                            <ThumbDownIcon />
                        </IconButton>
                        <Typography color={theme.palette.text.primary} variant="body2" display="inline" sx={{ verticalAlign: 'middle', marginLeft: '4px' }}>
                            {votes.dislikes}
                        </Typography>
                    </Grid>
                    <Grid item sx={{ position: 'relative' }}>
                        <IconButton color="primary" onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>
                        {showCopiedMessage && (
                            <Box sx={{
                                position: 'absolute',
                                top: '-30px',
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '5px',
                                padding: '5px 10px',
                                boxShadow: theme.shadows[3],
                                zIndex: 10,
                            }}>
                                <Typography variant="body2" color="textPrimary">
                                    Copied to clipboard!
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            )}

            <Grid mt={1} container spacing={2} justifyContent="center">
                <Grid item>
                    <Button color="secondary" size="large" variant="contained" onClick={newJoke}>
                        Новий анекдот
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="secondary" size="large" variant="outlined" onClick={handleOpen}>
                        Обрати Категорію
                    </Button>
                </Grid>
            </Grid>

            <CategoryModal
                open={open}
                handleClose={handleClose}
                handleCategorySelect={handleCategorySelect}
            />
        </Container>
    );
};

export default GetJoke;
