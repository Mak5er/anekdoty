import React, {useEffect, useState} from 'react';
import GetJoke from '../components/GetJoke';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {useSearchParams, useNavigate} from 'react-router-dom';

const Home = ({user, setJoke, joke, votes, fetchVotes, fetchJoke, fetchJokeById}) => {
    const [disabled, setDisabled] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [jokeLoaded, setJokeLoaded] = useState(false);

    const newJoke = () => {
        if (disabled) return;
        setDisabled(true);
        fetchJoke();
        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    };

    useEffect(() => {
        const jokeId = searchParams.get('id');
        if (jokeId && !jokeLoaded) {
            fetchJokeById(jokeId).then(() => {
                setJokeLoaded(true);
                navigate('/');
            });
        } else if (user && !jokeLoaded) {
            fetchJoke();
            setJokeLoaded(true);
        }
    }, [user, searchParams, fetchJokeById, fetchJoke, jokeLoaded, navigate]);

    return (
        <Container sx={{
            color: 'white', display: 'flex', flexDirection: 'column', pt: '9rem',
        }}>
            <Box sx={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <GetJoke joke={joke} newJoke={newJoke} setJoke={setJoke} votes={votes} disabled={disabled}
                         fetchVotes={fetchVotes}/>
            </Box>
        </Container>
    );
};

export default Home;
