'use client'

import Fade from '@mui/material/Fade';
import { Alert, Button, Container, Slide, Stack, Typography } from '@mui/material';
import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from './utils';
import { UserList } from './components';
import { useEffect, useState } from 'react';
import { useBroadcastPublicKey } from './hooks';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

export default function Home() {

  const { status, connect, account, ethereum } = useMetaMask();
  const [alert, setAlert] = useState<boolean>(false);

  const [provider, setProvider] = useState<Web3Provider>()
  useEffect(() => {
    if (!window) return;

    const pr = new ethers.providers.Web3Provider((window as any).ethereum);
    setProvider(pr);
  }, [ethereum])

  const signer = provider?.getSigner();

  const { isBroadcasting, publicKeyMsg } = useBroadcastPublicKey(
    undefined,
    account ?? undefined,
    signer
  );

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

            {
              account ?
              <>
                <UserList setAlert={setAlert}/>

                <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
                  <Alert onClose={() => setAlert(false)} sx={{position: 'absolute', bottom: 10, right: 10}} severity="success">User added successfully</Alert>
                </Slide>
              </>
              : 
              <Typography fontSize={30}>Please connect your wallet</Typography>
            }

        </Container>
      </main>
  )
}
