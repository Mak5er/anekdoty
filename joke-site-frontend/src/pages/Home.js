import React, {useEffect, useState} from 'react';
import axios from 'axios';
import GetJoke from '../components/GetJoke';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {API_BASE_URL} from "../config";

const Home = ({user}) => {
    const [joke, setJoke] = useState(null);
    const [votes, setVotes] = useState(null);
    const [disabled, setDisabled] = useState(false);


    const fetchJoke = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/joke`, {withCredentials: true});
            if (!res.data.error) {
                setJoke(res.data);
                fetchVotes(res.data.id);
            }
        } catch (error) {
            console.error("Failed to fetch joke:", error);
        }
    };

    const fetchVotes = async (joke_id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/joke/votes?joke_id=${joke_id}`, {withCredentials: true});
            if (!res.data.error) {
                setVotes(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch votes:", error);
        }
    };

    const newJoke = () => {
        if (disabled) return;
        setDisabled(true);
        fetchJoke();
        setTimeout(() => {
            setDisabled(false);
        }, 1000);
    };

    useEffect(() => {
        if (user) {
            fetchJoke();
        }
    }, [user]);


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
