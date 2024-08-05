import React, {useEffect, useState} from 'react';
import GetJoke from '../components/getJoke/GetJoke';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useUser} from "../contexts/UserContext";
import {useJoke} from '../contexts/JokeContext';

const Home = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [jokeLoaded, setJokeLoaded] = useState(false);
    const {user} = useUser();
    const {fetchJokeData} = useJoke();


    useEffect(() => {
        const jokeId = searchParams.get('id');
        if (jokeId && !jokeLoaded) {
            fetchJokeData({joke_id: jokeId}).then(() => {
                setJokeLoaded(true);
            });
        } else if (!jokeLoaded) {
            fetchJokeData();
            setJokeLoaded(true);
        }
    }, [user, searchParams, fetchJokeData, jokeLoaded, navigate]);

    return (
        <Container sx={{
            color: 'white', display: 'flex', flexDirection: 'column',
        }}>
            <Box sx={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <GetJoke/>
            </Box>
        </Container>
    );
};

export default Home;
