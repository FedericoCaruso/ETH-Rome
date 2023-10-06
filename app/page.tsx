import * as React from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <main style={{height: '100dvh', width: '100dvw'}}>
      <Box sx={{ display: 'flex', backgroundColor: 'lightcoral', height: '100%' }}>
        <Fade in={true} timeout={2000}>
          <Typography fontSize={60} fontWeight={700}>
            Dissident
          </Typography>
        </Fade>
      </Box>
    </main>
  )
}
