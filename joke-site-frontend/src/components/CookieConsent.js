import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography } from '@mui/material';

const CookieConsent = ({ onAccept, onReject }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if the user has already responded to the cookie consent
        const consentGiven = localStorage.getItem('cookieConsent');
        if (!consentGiven) {
            setOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setOpen(false);
        onAccept();
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        setOpen(false);
        onReject();
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Cookie Consent</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    We use cookies to improve your experience on our site. By accepting cookies, you accept our{' '}
                    <Link href="/privacy-policy" target="_blank" rel="noopener">
                        Privacy Policy
                    </Link>.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReject} color="primary">
                    Reject
                </Button>
                <Button onClick={handleAccept} color="primary">
                    Accept
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CookieConsent;
