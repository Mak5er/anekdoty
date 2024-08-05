import React from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {Backdrop, useTheme} from '@mui/material';
import Typography from "@mui/material/Typography";

const CategoryModal = ({open, handleClose, handleCategorySelect}) => {
    const theme = useTheme();

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: "50%",
                    left: "50%",
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '600px',
                    bgcolor: theme.palette.background.default,
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: '8px',
                    p: '20px',
                }}>
                    <IconButton style={{float: 'right', right: -5, top: -5}} onClick={handleClose}>
                        <ClearIcon sx={{color: '#3bd671', fontSize: '20px'}}/>
                    </IconButton>
                    <Typography variant='h5'><strong>Оберіть категорію:</strong></Typography>
                    <Grid container spacing={2} marginTop='16px'>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_гроші')}>
                                    💵Гроші
                                </Button>
                            </Grid>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_родину')}>
                                    👨‍👩‍👦‍👦Родина
                                </Button>
                            </Grid>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_білявок')}>
                                    👱‍♀️Блондинки
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_тещу')}>
                                    👵Теща
                                </Button>
                            </Grid>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_школу')}>
                                    🏫Школа
                                </Button>
                            </Grid>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_вовочку')}>
                                    👦Вовочка
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_медицину')}>
                                    🏥Медицина
                                </Button>
                            </Grid>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_студентів')}>
                                    🎓Студенти
                                </Button>
                            </Grid>
                            <Grid item mb={2}>
                                <Button color="secondary" size="large" variant="outlined"
                                        onClick={() => handleCategorySelect('про_роботу')}>
                                    🏢Робота
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </Modal>
    );
};

export default CategoryModal;
