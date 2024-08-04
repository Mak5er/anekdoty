import React, {useCallback, useEffect, useState} from 'react';
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
import {Skeleton, useTheme} from '@mui/material';
import CategoryModal from './CategoryModal';
import {useJoke} from "../contexts/JokeContext";

const GetJoke = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const navigate = useNavigate();

    const {
        handleVoteData, votes, userVote, fetchUserVoteData,
        joke, fetchJokeData, fetchJokeByCategoryData, isJokeLoading
    } = useJoke();

    const newJoke = useCallback(() => {
        if (disabled) return;
        setDisabled(true);
        fetchJokeData();
        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    }, [disabled, fetchJokeData]);

    useEffect(() => {
        if (joke && joke.id) {
            const url = new URL(window.location.origin);
            url.pathname = '/joke';
            url.searchParams.set('id', joke.id);
            navigate(url.pathname + url.search, {replace: true});
            fetchUserVoteData(joke.id);
        }
    }, [joke, navigate, fetchUserVoteData]);

    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);
    const handleCategorySelect = useCallback(async (tag) => {
        handleClose();
        fetchJokeByCategoryData(tag);
    }, [fetchJokeByCategoryData, handleClose]);

    const handleVote = useCallback(async (voteType) => {
        handleVoteData(joke.id, voteType);
    }, [handleVoteData, joke]);

    const handleShare = useCallback(() => {
        const jokeUrl = `${window.location.origin}/joke?id=${joke.id}`;
        navigator.clipboard.writeText(jokeUrl).then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => {
                setShowCopiedMessage(false);
            }, 2000);
        }).catch((error) => {
            console.error('Error copying URL:', error);
        });
    }, [joke]);

    const renderJokeContent = () => {
        if (isJokeLoading) {
            return (
                <>
                    <Skeleton variant="text" width="95%" height={30}/>
                    <Skeleton variant="text" width="100%" height={30}/>
                    <Skeleton variant="text" width="95%" height={30}/>
                </>
            );
        }

        if (joke) {
            return (
                <>
                    <Typography variant="body1" sx={{color: theme.palette.text.primary, fontSize: '20px'}}>
                        {joke.text}
                    </Typography>
                    {joke.tags?.length > 0 && (
                        <Typography variant="body2" sx={{color: theme.palette.text.secondary, fontSize: '16px'}}>
                            {joke.tags}
                        </Typography>
                    )}
                </>
            );
        }

        return <Typography variant="body1" sx={{color: theme.palette.text.primary, fontSize: '20px'}}>Не знайдено
            анекдоту</Typography>;
    };

    const renderVotes = () => {
        if (isJokeLoading) {
            return (
                <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
                    <VoteButton type="like" count={<Skeleton variant="text" width={20}/>}/>
                    <VoteButton type="dislike" count={<Skeleton variant="text" width={20}/>}/>
                    <Grid item sx={{position: 'relative'}}>
                        <IconButton color="default">
                            <ShareIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            );
        }

        if (votes) {
            return (
                <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
                    <VoteButton type="like" count={votes.likes} active={userVote === 'like'}
                                onClick={() => handleVote('like')}/>
                    <VoteButton type="dislike" count={votes.dislikes} active={userVote === 'dislike'}
                                onClick={() => handleVote('dislike')}/>
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
                                zIndex: 10
                            }}>
                                <Typography variant="body2" color="textPrimary">
                                    Copied to clipboard!
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            );
        }

        return <Typography variant="body1" sx={{color: theme.palette.text.primary, fontSize: '20px'}}>Не знайдено
            реакцій</Typography>;
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
                        alignItems: 'left'
                    }}>
                        {renderJokeContent()}
                    </Box>
                </Grid>
            </Grid>

            {renderVotes()}

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

            <CategoryModal open={open} handleClose={handleClose} handleCategorySelect={handleCategorySelect}/>
        </Container>
    );
};


const VoteButton = ({type, count, active, onClick}) => (
    <Grid item>
        <IconButton color={active ? 'primary' : 'default'} onClick={onClick}>
            {type === 'like' ? <ThumbUpIcon/> : <ThumbDownIcon/>}
        </IconButton>
        <Box sx={{display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle'}}>
            <Typography color='text.primary' variant="body2" display="block">
                {count}
            </Typography>
        </Box>
    </Grid>
);


export default GetJoke;
