import React from 'react';
import {Grid, Box, Typography} from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            marginTop='1rem'
            width='100%'
            minHeight="2vh"
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
            </Grid>
        </Box>
    )
        ;
};

export default Footer;