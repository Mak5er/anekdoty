import React from 'react';
import {Grid, Box, Typography, IconButton} from '@mui/material';
import {GitHub, Telegram} from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            marginTop='1rem'
            width='100%'
            sx={{backgroundColor: 'footer.default', position: 'relative'}}
        >
            <Grid container alignItems="center" justifyContent="center"
                  style={{position: 'relative', zIndex: 1}}>
                <Grid item md={4} xs={12} textAlign='center'>
                    <Typography variant="body1">
                        Designed and Developed by <a href='https://github.com/Mak5er'
                                                     style={{color: 'inherit', textDecoration: 'none'}}>Maksym Reva</a>
                    </Typography>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{mt: 1}}>
                        {'Copyright © '}
                        <a href="https://ujokes.pp.ua" style={{color: 'inherit', textDecoration: 'none'}}>
                            UJokes
                        </a>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Grid>
                <Grid item md={4} xs={12} textAlign='center'>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}}>
                        <IconButton aria-label="GitHub" href="https://github.com/Mak5er/anekdoty">
                            <GitHub/>
                        </IconButton>
                        <IconButton aria-label="Telegram" href="https://t.me/anekdotyrobot">
                            <Telegram/>
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
        ;
};

export default Footer;