
'use client'
import peanut from '@squirrel-labs/peanut-sdk';
import { ethers } from "ethers";


import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CircularProgress, Grid, Modal, TextField } from '@mui/material';
import {useRef} from 'react';
import style from 'styled-jsx/style';


const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Peanut() {

  const textRef = useRef();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loading, setLoading] = React.useState(false);


  const CHAINID = 5; // goerli
  const RPC_URL = 'https://rpc.ankr.com/eth_goerli';

  const [link, setLink] = React.useState("");

  async function startPeanut(){
    handleOpen();
    

    const pr = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer =   pr.getSigner();

    try {
      setLoading(true)

      const createLinkResponse = await peanut.createLink({
        structSigner: {
          signer: signer
        },
        linkDetails: {
          chainId: CHAINID,
          tokenAmount: parseFloat(textRef.current.value),
          tokenType: 0,  // 0 for ether, 1 for erc20, 2 for erc721, 3 for erc1155
        }
      });
      //console.log(createLinkResponse);
      console.log(createLinkResponse.createdLink.link[0]);
      setLink(createLinkResponse.createdLink.link[0]);
      

    } finally {
      setLoading(false)
    }
   
  }

  return (

<div>
    <Card sx={{ maxWidth: 450 }}>
    <CardMedia
      sx={{ height: 140 }}
      image="/images/peanut.png"
      title="peanut"
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Send Eth
      </Typography>
      <Typography variant="body2" color="text.secondary">
       Send Tokens with a Link to the Dissident
      </Typography>
    </CardContent>
    <CardActions >
    <Grid container spacing={1}>
      <Grid item xs={8}>
        <TextField
            id="outlined-helperText"
            label="Eth Amount"
            defaultValue="0.001"
            inputRef={textRef}
          />      

      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" onClick={startPeanut}>Sign</Button>
      </Grid>
               
    </Grid>

    </CardActions>
    </Card>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {loading? 

        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            FIRMA & ASPETTA
          </Typography>
          <CircularProgress />
     
        </Box>

      
      :
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Your link is ready!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {link}
          </Typography>
      </Box>
      }
        

      
    </Modal>

</div>
  
  
  )
}
