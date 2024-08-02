import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import {CircularProgress, useTheme} from '@mui/material';
import CategoryModal from './CategoryModal';
import {useJoke} from "../contexts/JokeContext";

const GetJoke = ({newJoke}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const navigate = useNavigate();
    const {handleVoteData, votes, userVote, fetchUserVoteData} = useJoke();
    const {joke, fetchJokeByCategoryData} = useJoke();
    const {isJokeLoading} = useJoke();

    useEffect(() => {
        if (joke && joke.id) {
            const url = new URL(window.location.origin);
            url.pathname = '/joke';
            url.searchParams.set('id', joke.id);
            navigate(url.pathname + url.search, {replace: true});

            fetchUserVoteData(joke.id);
        }
    }, [fetchUserVoteData, joke, navigate]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCategorySelect = async (tag) => {
        handleClose();
        fetchJokeByCategoryData(tag);
    };

    const handleVote = async (voteType) => {
        handleVoteData(joke.id, voteType)
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
            <Grid container justifyContent="center" sx={{pt: '2rem'}}>
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
                        {isJokeLoading ? (
                            <CircularProgress/>
                        ) : joke ? (
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
                            <Typography variant="body1" sx={{color: theme.palette.text.primary, fontSize: '20px'}}>
                                Не знайдено анекдоту
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {isJokeLoading ? (
                <div></div>
            ) : votes ? (
                <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
                    <Grid item>
                        <IconButton color={userVote === 'like' ? 'primary' : 'default'}
                                    onClick={() => handleVote('like')}>
                            <ThumbUpIcon/>
                        </IconButton>
                        <Typography color={theme.palette.text.primary} variant="body2" display="inline"
                                    sx={{verticalAlign: 'middle', marginLeft: '4px'}}>
                            {votes.likes}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton color={userVote === 'dislike' ? 'primary' : 'default'}
                                    onClick={() => handleVote('dislike')}>
                            <ThumbDownIcon/>
                        </IconButton>
                        <Typography color={theme.palette.text.primary} variant="body2" display="inline"
                                    sx={{verticalAlign: 'middle', marginLeft: '4px'}}>
                            {votes.dislikes}
                        </Typography>
                    </Grid>
                    <Grid item sx={{position: 'relative'}}>
                        <IconButton color="primary" onClick={handleShare}>
                            <ShareIcon/>
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
            ) : (
                <Typography variant="body1" sx={{color: theme.palette.text.primary, fontSize: '20px'}}>
                    Не знайдено реакцій
                </Typography>
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
