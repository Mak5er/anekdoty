import React, {createContext, useCallback, useContext, useState} from 'react';
import {
    fetchJoke,
    fetchJokeByCategory,
    fetchJokeById,
    fetchUserVote,
    fetchVotes,
    handleVote,
    searchJokes
} from '../utils/api';
import {useNavigate} from "react-router-dom";

const JokeContext = createContext();

export const useJoke = () => useContext(JokeContext);

export const JokeProvider = ({children}) => {
    const [joke, setJoke] = useState(null);
    const [votes, setVotes] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isJokeLoading, setIsJokeLoading] = useState(false);
    const navigate = useNavigate();

    const fetchJokeData = useCallback(async ({joke_id = null, tag = null} = {}) => {
        setIsJokeLoading(true);
        try {
            let jokeData;
            if (joke_id) {
                jokeData = await fetchJokeById(joke_id);
            } else if (tag) {
                jokeData = await fetchJokeByCategory(tag);
            } else {
                jokeData = await fetchJoke();
            }
            setJoke(jokeData);
            navigate(`/joke?id=${jokeData.id}`)
            const votesData = await fetchVotes(jokeData.id);
            setVotes(votesData);
        } catch (error) {
            console.error("Failed to fetch joke data:", error);
        } finally {
            setIsJokeLoading(false);
        }
    }, [navigate]);

    const handleVoteData = useCallback(async (jokeId, voteType) => {
        try {
            const response = await handleVote(jokeId, voteType);
            const votesData = await fetchVotes(jokeId);
            setVotes(votesData);
            setUserVote(response.action === 'removed' ? null : voteType);
        } catch (error) {
            console.error('Error voting on joke:', error);
        }
    }, []);

    const fetchUserVoteData = useCallback(async (jokeId) => {
        try {
            const response = await fetchUserVote(jokeId);
            if (!response.error) {
                setUserVote(response.vote_type);
            }
        } catch (error) {
            console.error('Error fetching user vote:', error);
        }
    }, []);

    const searchJokesData = useCallback(async (query) => {
        setIsLoading(true);
        try {
            const results = await searchJokes(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Failed to search jokes:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);


    return (
        <JokeContext.Provider value={{
            joke,
            votes,
            searchResults,
            setSearchResults,
            isLoading,
            isJokeLoading,
            fetchJokeData,
            fetchVotes,
            searchJokesData,
            handleVoteData,
            fetchUserVoteData,
            userVote,
            setUserVote,
        }}>
            {children}
        </JokeContext.Provider>
    );
};
