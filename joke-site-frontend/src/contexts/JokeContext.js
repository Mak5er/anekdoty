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


const JokeContext = createContext();

export const useJoke = () => useContext(JokeContext);

export const JokeProvider = ({children}) => {
    const [joke, setJoke] = useState(null);
    const [votes, setVotes] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isJokeLoading, setIsJokeLoading] = useState(false);

    const fetchJokeData = useCallback(async () => {
        setIsJokeLoading(true);
        try {
            const jokeData = await fetchJoke();
            setJoke(jokeData);
            const votesData = await fetchVotes(jokeData.id);
            setVotes(votesData);
        } catch (error) {
            console.error("Failed to fetch joke data:", error);
        } finally {
            setIsJokeLoading(false)
        }
    }, []);

    const fetchJokeByIdData = useCallback(async (joke_id) => {
        setIsJokeLoading(true);
        try {
            const jokeData = await fetchJokeById(joke_id);
            setJoke(jokeData);
            const votesData = await fetchVotes(jokeData.id);
            setVotes(votesData);
        } catch (error) {
            console.error("Failed to fetch joke by id:", error);
        } finally {
              setIsJokeLoading(false);
        }
    }, []);

    const fetchJokeByCategoryData = useCallback(async (tag) => {
        setIsJokeLoading(true);
        try {
            const jokeData = await fetchJokeByCategory(tag);
            setJoke(jokeData);
            const votesData = await fetchVotes(jokeData.id);
            setVotes(votesData);
        } catch (error) {
            console.error("Failed to fetch joke by id:", error);
        } finally {
            setIsJokeLoading(false);

        }
    }, []);

    const handleVoteData = useCallback (async (jokeId, voteType) => {
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
            fetchJokeByIdData,
            fetchJokeByCategoryData,
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
