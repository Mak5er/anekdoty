import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchUser, authenticateUser, logout as apiLogout } from '../utils/api';
import {useNavigate} from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            const userData = await fetchUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }, []);

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    const responseGoogle = async (response) => {
        if (response.credential) {
            try {
                const userData = await authenticateUser(response.credential);
                setUser(userData);
                navigate('/');
            } catch (error) {
                console.error("Failed to authenticate:", error);
            }
        }
    };





    return (
        <UserContext.Provider value={{ user, setUser, logout, responseGoogle, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
};
