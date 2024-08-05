import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const LoginDialog = ({open, onClose}) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle
                sx={{backgroundColor: 'background.default'}}
            >Authentication Required</DialogTitle>
            <DialogContent
                sx={{backgroundColor: 'background.default'}}
            >
                You need to log in to perform this action.
            </DialogContent>
            <DialogActions
                sx={{backgroundColor: 'background.default'}}
            >
                <Button variant='contained' onClick={handleLogin}>Login</Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;
