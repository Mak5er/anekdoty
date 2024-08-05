import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {authenticateUser, fetchUser, logout as apiLogout} from '../utils/api';
import {useNavigate} from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            const userData = await fetchUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setUserLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const requireLogin = () => {
        setShowLoginDialog(true);
    };

    const closeLoginDialog = () => {
        setShowLoginDialog(false);
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            window.location.reload()
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    const responseGoogle = async (response) => {
        if (response.credential) {
            try {
                const userData = await authenticateUser(response.credential);
                setUser(userData);
                navigate('/')
                window.location.reload()
            } catch (error) {
                console.error("Failed to authenticate:", error);
            }
        }
    };


    return (
        <UserContext.Provider value={{
            user,
            setUser,
            logout,
            responseGoogle,
            fetchUserData,
            requireLogin,
            closeLoginDialog,
            showLoginDialog,
            userLoading
        }}>
            {children}
        </UserContext.Provider>
    );
};
