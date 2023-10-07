'use client'

import Fade from '@mui/material/Fade';
import { Alert, Button, Container, Slide, Stack, Typography } from '@mui/material';
import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from './utils';
import { UserList } from './components';
import { useState } from 'react';
import { useBroadcastPublicKey } from './hooks';

export default function Home() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [alert, setAlert] = useState<boolean>(false);


  return (

      <main>
        <Container 
          maxWidth="md" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <Stack direction='row' width={'100%'} marginTop={3} maxWidth={900} alignItems='center' justifyContent='space-between'>
            <Fade in={true} timeout={2000}>
              <Typography
                sx={{
                  backgroundImage: 'linear-gradient(120deg, #a6c0fe 0%, #f68084)',
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text' 
                }}
                variant='h6'
                component={'h1'}
                fontSize={22}
                fontWeight={700}
              >
                Dissident
              </Typography>
            </Fade>
            {
              status === "notConnected" &&
              <Button onClick={connect} variant='contained' color='secondary'>
                Connect
              </Button>
            }

            {
              status === "connected" &&
              <Stack direction='row' alignItems='center' gap={1}>
                <Avvvatars style='shape' value={account} />
                <Typography fontSize={12}>{truncateString(account, 4, 4)}</Typography>
              </Stack>
            }
          </Stack>
          <UserList setAlert={setAlert}/>

          <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
            <Alert onClose={() => setAlert(false)} sx={{position: 'absolute', bottom: 10, right: 10}} severity="success">User added successfully</Alert>
          </Slide>

        </Container>
      </main>
  )
}
