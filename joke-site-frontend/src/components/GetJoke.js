import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTheme} from '@mui/material';
import axios from "axios";
import CategoryModal from './CategoryModal';
import {API_BASE_URL} from "../config";

const GetJoke = ({joke, setJoke, newJoke}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCategorySelect = async (tag) => {
            handleClose();
            try {
                const response = await axios.get(`${API_BASE_URL}/api/joke/category?tag=${tag}`,
                    {withCredentials: true});
                setJoke(response.data)
            } catch
                (error) {
                console.error('Error fetching joke:', error);
            }
        }
    ;

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <Typography variant='h3' color='secondary.main'><strong>Анекдоти <Box component='span'
                                                                                  color='primary.main'>Українською</Box></strong></Typography>
            <Grid container justifyContent="center" sx={{pt: '2rem'}}>
                <Grid item xs={12} md={10}>
                    <Box sx={{
                        p: 3,
                        border: '2px solid',
                        borderColor: theme.palette.primary.main,
                        borderRadius: '5px',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {joke && (
                            <>
                                <Typography variant="body1"
                                            sx={{
                                                color: theme.palette.text.primary,
                                                fontSize: '20px'
                                            }}>{joke.text}</Typography>
                                {joke.tags && joke.tags.length > 0 && (
                                    <Typography variant="body2"
                                                sx={{color: theme.palette.text.secondary, fontSize: '16px'}}>
                                        {joke.tags}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <Grid mt={1} container spacing={2} justifyContent="center"> {/* Додано spacing={2} */}
                <Grid item>
                    <Button color="secondary" size="large" variant="contained" onClick={newJoke}>
                        Новий анекдот
                    </Button>
                </Grid>
                <Grid item>
                    <Button color="secondary" size="large" variant="outlined" onClick={handleOpen}>
                        Обрати Категорію
                    </Button>
                </Grid>
            </Grid>
            <CategoryModal
                open={open}
                handleClose={handleClose}
                handleCategorySelect={handleCategorySelect}
            />
        </Container>
    );
};

export default GetJoke;
