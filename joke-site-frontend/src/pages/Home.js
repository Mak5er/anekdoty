import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GetJoke from '../components/GetJoke';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {API_BASE_URL} from "../config";

const Home = ({user}) => {
    const [joke, setJoke] = useState(null);
    const [disabled, setDisabled] = useState(false);


    const fetchJoke = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/joke`, {withCredentials: true});
            if (!res.data.error) {
                setJoke(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch joke:", error);
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
                <GetJoke joke={joke} newJoke={newJoke} setJoke={setJoke} disabled={disabled}/>
            </Box>
        </Container>
    );
};

export default Home;
