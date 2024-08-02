import axios from 'axios';
import { API_BASE_URL } from '../config';

export const fetchUser = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/user`, {withCredentials: true});
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
                console.warn("User is not authenticated");
            } else {
                console.error("Failed to fetch user:", error);
            }
    }

};

export const authenticateUser = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/auth?token=${token}`, {withCredentials: true});
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.warn("Failed to authenticate: Unauthorized");
        } else {
            console.error("Failed to authenticate:", error);
        }
        throw error;
    }
};

export const fetchVotes = async (joke_id) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/joke/votes?joke_id=${joke_id}`, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch votes:", error);
        throw error;
    }
};

export const handleVote = async (jokeId, voteType) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/joke/votes`,
            { joke_id: jokeId, vote_type: voteType },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Error voting on joke:', error);
        throw error;
    }
};

export const fetchUserVote = async (jokeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/joke/user_vote?joke_id=${jokeId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching user vote:', error);
        throw error;
    }
};

export const fetchJoke = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/joke`, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch joke:", error);
        throw error;
    }
};

export const fetchJokeById = async (joke_id) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/joke/id?joke_id=${joke_id}`, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.error("Failed to fetch joke:", error);
        throw error;
    }
};

export const fetchJokeByCategory = async (tag) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/joke/category?tag=${tag}`, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.error('Error fetching joke:', error);
        throw error;
    }
};

export const searchJokes = async (query) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/jokes/search`, {params: {query}, withCredentials: true});
        return res.data;
    } catch (error) {
        console.error("Failed to search jokes:", error);
        throw error;
    }
};

export const fetchJokeHistory = async (page) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/joke/history`, {
            params: { offset: page * 10, limit: 10 },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching joke history:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/logout`, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.error("Failed to logout:", error);
        throw error;
    }
};