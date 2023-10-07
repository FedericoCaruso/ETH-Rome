"use client";

import Fade from "@mui/material/Fade";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMetaMask } from "metamask-react";
import Avvvatars from "avvvatars-react";
import { truncateString } from "../utils";
import { UserList } from "../components";
import { useEffect, useState } from "react";
import { checkKeyPairFromStorage } from "../components/key_pair_handling/key_pair_storage";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useBroadcastPublicKey } from "../hooks";
import PasswordForm from "../components/PasswordForm";
import { KeyPair } from "../utils/crypto";




import Image from 'next/image'

export default function Home() {
  const { status, connect, account, ethereum } = useMetaMask();
  const [alert, setAlert] = useState<boolean>(false);
  const [encryptionKeyPair, setEncryptionKeyPair] = useState<KeyPair>();
  const [loading, setLoading] = useState<boolean>(true);

  const [step, setStep] = useState<number>(
    (account && !encryptionKeyPair) ? 1 :
      (account && encryptionKeyPair) ? 2 :
        0
  );

  const [provider, setProvider] = useState<Web3Provider>();
  useEffect(() => {
    if (!window) return;

    const pr = new ethers.providers.Web3Provider((window as any).ethereum);
    setProvider(pr);
  }, [ethereum]);

  const signer = provider?.getSigner();

  const { isBroadcasting, publicKeyMsg } = useBroadcastPublicKey(
    undefined,
    account ?? undefined,
    signer
  );

  useEffect(() => {
    setLoading(true);
    const isStep1 = account && !encryptionKeyPair;
    const isStep2 = account && encryptionKeyPair;
    isStep1 ? setStep(1) : isStep2 ? setStep(2) : setStep(0);
    setLoading(false);
  }, [account, encryptionKeyPair]);

  useEffect(() => {
    status === "connecting" && setLoading(true);
    status === "connected" && setLoading(false);
  }, [status]);

  return (
    <main>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        

          <AppBar position="relative" style={{ background: '#000000' }} >
            <Toolbar>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Avatar
                    alt="Logo"
                    src="/images/logo.jpg"
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Box
                    component="img"
                    sx={{
                      width: '100%',
                    }}
                    alt="The house from the offer."
                    src="/images/dissident.png"
                  />

                </Grid>
              </Grid>


            </Toolbar>
          </AppBar>

          <Stack
          direction="row"
          width={"100%"}
          marginTop={3}
          maxWidth={900}
          alignItems="center"
          justifyContent='center'
          >
          {status === "notConnected" && (
            
            <Stack  direction="row" spacing={2}>
               <Typography fontSize={30}>Please connect your wallet</Typography>
              <Button onClick={connect} variant="contained" color="secondary">
                Connect
              </Button>
            </Stack>
          )}

          {status === "connected" && (
            <Stack direction="row"  alignItems="center" gap={1}>
              <Avvvatars style="shape" value={account} />
              <Typography fontSize={24}>
                {truncateString(account, 4, 4)}
              </Typography>
            </Stack>
          )}
        </Stack>
      

        {
            loading ?
              <Skeleton variant="rectangular" width={210} height={118} />
              :
              <>
                {account ? (
                  <>
                    {step === 0 ? (
                      <Button variant="contained" onClick={() => setStep(1)}>
                        Start
                      </Button>
                    ) : step === 1 ? (
                      <PasswordForm setEncryptionKeyPair={setEncryptionKeyPair} />
                    ) : (
                      <>
                        <UserList setAlert={setAlert} />

                        <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
                          <Alert
                            onClose={() => setAlert(false)}
                            sx={{ position: "absolute", bottom: 10, right: 10 }}
                            severity="success"
                          >
                            User added successfully
                          </Alert>
                        </Slide>
                      </>
                    )}
                  </>
                ) : (
                  <Stack
                  direction="row"
                  width={"100%"}
                  marginTop={3}
                  maxWidth={900}
                  alignItems="center"
                  justifyContent='center'
                  >
                    <Box
                    component="img"
                    sx={{
                      height: 400,
                    }}
                    alt="The house from the offer."
                    src="/images/metamask.png"
                    />
                   
                  </Stack>
                )}
              </>
          }


      </Container>
    </main>
  );
}
