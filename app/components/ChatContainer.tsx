import React, { Dispatch, SetStateAction, useState } from 'react'
import { Chat, UserList } from '.'
import { Slide, Alert, Container, Grid } from '@mui/material';

export const ChatContainer = () => {

  const [alert, setAlert] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>

        <Grid item xs={12} md={3}>
            <UserList setAlert={setAlert} />
        </Grid>

        <Grid item xs={12} md={9}>
            <Chat />
        </Grid>

        <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
            <Alert
                onClose={() => setAlert(false)}
                sx={{ position: "absolute", bottom: 10, right: 10 }}
                severity="success"
            >
                User added successfully
            </Alert>
        </Slide>
    </Grid>
  )
}
