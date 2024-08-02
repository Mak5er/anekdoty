import React, {useEffect, useState} from 'react';
import GetJoke from '../components/GetJoke';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useUser} from "../contexts/UserContext";
import {useJoke} from '../contexts/JokeContext';

const Home = () => {
    const [disabled, setDisabled] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [jokeLoaded, setJokeLoaded] = useState(false);
    const {user} = useUser();
    const {fetchJokeData, fetchJokeByIdData} = useJoke();

    const newJoke = () => {
        if (disabled) return;
        setDisabled(true);
        fetchJokeData();
        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    };

    useEffect(() => {
        const jokeId = searchParams.get('id');
        if (jokeId && !jokeLoaded) {
            fetchJokeByIdData(jokeId).then(() => {
                setJokeLoaded(true);
            });
        } else if (user && !jokeLoaded) {
            fetchJokeData();
            setJokeLoaded(true);
        }
    }, [user, searchParams, fetchJokeByIdData, fetchJokeData, jokeLoaded, navigate]);

    return (
        <Container sx={{
            color: 'white', display: 'flex', flexDirection: 'column', pt: '9rem',
        }}>
            <Box sx={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <GetJoke newJoke={newJoke} disabled={disabled}/>
            </Box>
        </Container>
    );
};

export default Home;
