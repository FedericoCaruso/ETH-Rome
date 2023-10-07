'use client'

import Fade from '@mui/material/Fade';
import { Alert, Button, Container, Slide, Stack, Typography } from '@mui/material';
import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from './utils';
import { UserList } from './components';
import { useEffect, useState } from 'react';
import { checkKeyPairFromStorage } from './components/key_pair_handling/key_pair_storage';

export default function Home() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [alert, setAlert] = useState<boolean>(false);
  const [keyExist, setKeyExist] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const isKeyPresent = async () => {
    if (!account) return;
    const iskeyPresent = await checkKeyPairFromStorage(account);
    setKeyExist(iskeyPresent);
  };

  useEffect(() => {
    isKeyPresent();
  }, [account])

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
                {
                  step === 0 ?
                  <Button variant='contained' onClick={() => setStep(1)}>Start</Button>
                  : 
                  <>
                    <UserList setAlert={setAlert}/>

                    <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
                      <Alert onClose={() => setAlert(false)} sx={{position: 'absolute', bottom: 10, right: 10}} severity="success">User added successfully</Alert>
                    </Slide>
                  </>
                }                

              </>
              : 
              <Typography fontSize={30}>Please connect your wallet</Typography>
            }

        </Container>
      </main>
  )
}
