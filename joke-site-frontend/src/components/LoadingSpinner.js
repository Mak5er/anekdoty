import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
}));

const LoadingSpinner = () => {
    return (
        <LoadingContainer>
            <CircularProgress color="primary" />
        </LoadingContainer>
    );
};

export default LoadingSpinner;