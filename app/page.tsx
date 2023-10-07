'use client'

import Fade from '@mui/material/Fade';
import { Button, Container, Stack, Typography } from '@mui/material';
import CustomStepper from './components/CustomStepper';
import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from './utils';

export default function Home() {

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  return (

      <main style={{height: '100dvh', width: '100dvw', backgroundColor: 'mediumpurple'}}>
        <Container 
          maxWidth="md" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <Stack direction='row' width={'100%'} marginTop={3} maxWidth={900} alignItems='center' justifyContent='space-between' position='fixed' top={0} zIndex={9999}>
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
          <CustomStepper/>
        </Container>
      </main>
  )
}
