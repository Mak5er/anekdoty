import React, {lazy, Suspense, useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {CssBaseline, ThemeProvider} from '@mui/material';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import CookieConsent from './components/CookieConsent';
import {darkTheme, lightTheme} from './theme';
import './App.css';
import axios from "axios";
import {API_BASE_URL} from "./config";

const Home = lazy(() => import('./pages/Home'));
const JokeHistory = lazy(() => import('./pages/JokeHistory'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const App = () => {
    const [theme, setTheme] = useState(darkTheme);
    const [user, setUser] = useState(null);

    const toggleTheme = () => {
        setTheme(theme === lightTheme ? darkTheme : lightTheme);
    };

    const fetchUser = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/user`, {withCredentials: true});
            if (!res.data.error) {
                setUser(res.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("User is not authenticated");
            } else {
                console.error("Failed to fetch user:", error);
            }
        }
    }, []);

    const responseGoogle = async (response) => {
        if (response.credential) {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/auth?token=${response.credential}`, {withCredentials: true});
                if (!res.data.error) {
                    setUser(res.data);
                    window.location.reload();
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn("Failed to authenticate: Unauthorized");
                } else {
                    console.error("Failed to authenticate:", error);
                }
            }
        }
    };

    const logout = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/logout`, {withCredentials: true});
            if (res.data.message) {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };
    const handleAcceptCookies = () => {
        console.log('Cookies accepted');
    };

    const handleRejectCookies = () => {
        window.location.href = 'https://www.google.com';
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <div className="app-container">
                    <Header user={user} logout={logout} toggleTheme={toggleTheme}/>
                    <div className="content">
                        <Suspense fallback={<LoadingSpinner/>}>
                            <Routes>
                                <Route path="/" element={user ? <Home user={user}/> :
                                    <LoginPage onSuccess={responseGoogle} onError={responseGoogle}/>}/>
                                <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
                                <Route path="/history" element={<JokeHistory/>} />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
                <CookieConsent onAccept={handleAcceptCookies} onReject={handleRejectCookies}/>
            </Router>
        </ThemeProvider>
    );
};

export default App;
