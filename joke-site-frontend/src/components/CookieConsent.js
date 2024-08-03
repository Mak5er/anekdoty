import React, {useEffect, useState} from 'react';
import {Button, DialogActions, Link, Paper, Typography} from '@mui/material';

const CookieConsent = ({onAccept}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const consentGiven = localStorage.getItem('cookieConsent');
        if (consentGiven !== 'accepted') {
            setOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setOpen(false);
        onAccept();
    };


    if (!open) return null;

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                margin: 2,
                padding: 2,
                width: 'calc(100% - 16px)',
                maxWidth: '320px',
                zIndex: 1301,
                '@media (min-width: 600px)': {
                    width: 'auto',
                    maxWidth: '320px',
                },
            }}
        >
            <Typography variant="h6">Cookie Policy</Typography>
            <Typography variant="body1">
                We use cookies to improve your experience on our site. By accepting cookies, you accept our{' '}
                <Link href="/privacy-policy" target="_blank" rel="noopener">
                    Privacy Policy
                </Link>.
            </Typography>
            <DialogActions>
                <Button onClick={handleAccept} color="primary">
                    Accept
                </Button>
            </DialogActions>
        </Paper>
    );
};

export default CookieConsent;
