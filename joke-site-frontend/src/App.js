import React, {lazy, Suspense, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {CssBaseline, ThemeProvider} from '@mui/material';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import CookieConsent from './components/CookieConsent';
import {darkTheme, lightTheme} from './theme';
import './App.css';
import {UserProvider} from './contexts/UserContext';
import {JokeProvider} from './contexts/JokeContext';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const JokeHistory = lazy(() => import('./pages/JokeHistory'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const App = () => {
    // Retrieve the theme from localStorage or default to darkTheme
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'light' ? lightTheme : darkTheme;
        }
        // Default to dark theme if no preference is saved
        return darkTheme;
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const [joke, setJoke] = useState(null);

    // Toggle theme and save preference to localStorage
    const toggleTheme = () => {
        const newTheme = theme === lightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme === lightTheme ? 'light' : 'dark');
    };

    const handleAcceptCookies = () => {
        console.log('Cookies accepted');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <UserProvider>
                    <JokeProvider>
                        <div className="app-container">
                            <Header setJoke={setJoke} toggleTheme={toggleTheme}/>
                            <div className="content">
                                <Suspense fallback={<LoadingSpinner/>}>
                                    <Routes>
                                        <Route path="/" element={<ProtectedRoute element={<Home joke={joke} setJoke={setJoke}/>}/>}/>
                                        <Route path="/history" element={<ProtectedRoute element={<JokeHistory/>}/>}/>
                                        <Route path="/joke" element={<ProtectedRoute element={<Home joke={joke} setJoke={setJoke}/>}/>}/>
                                        <Route path="/login" element={<LoginPage/>}/>
                                        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                                    </Routes>
                                </Suspense>
                            </div>
                        </div>
                        <CookieConsent onAccept={handleAcceptCookies} onReject={handleRejectCookies}/>
                    </JokeProvider>
                </UserProvider>
            </Router>
        </ThemeProvider>
    );
};

export default App;
