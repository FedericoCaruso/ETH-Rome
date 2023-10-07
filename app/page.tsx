"use client";

import Fade from "@mui/material/Fade";
import {
  Alert,
  Button,
  Container,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { useMetaMask } from "metamask-react";
import Avvvatars from "avvvatars-react";
import { truncateString } from "./utils";
import { UserList } from "./components";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useBroadcastPublicKey } from "./hooks";
import PasswordForm from "./components/PasswordForm";
import { KeyPair } from "./utils/crypto";

export default function Home() {
  const { status, connect, account, ethereum } = useMetaMask();
  const [alert, setAlert] = useState<boolean>(false);
  const [encryptionKeyPair, setEncryptionKeyPair] = useState<KeyPair>();

  const [step, setStep] = useState<number>(0);

  const [provider, setProvider] = useState<Web3Provider>();
  useEffect(() => {
    if (!window) return;

    const pr = new ethers.providers.Web3Provider((window as any).ethereum);
    setProvider(pr);
  }, [ethereum]);

  const signer = provider?.getSigner();

  const { isBroadcasting, publicKeyMsg } = useBroadcastPublicKey(
    encryptionKeyPair,
    account ?? undefined,
    signer
  );

  useEffect(() => {
    if (status === 'initializing' || status === 'connecting') return;
    const isStep1 = account && !encryptionKeyPair;
    const isStep2 = account && encryptionKeyPair;
    isStep1 ? setStep(1) : isStep2 ? setStep(2) : setStep(0);
  }, [account, encryptionKeyPair]);

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
        <Stack
          direction="row"
          width={"100%"}
          marginTop={3}
          maxWidth={900}
          alignItems="center"
          justifyContent="space-between"
        >
          <Fade in={true} timeout={2000}>
            <Typography
              sx={{
                backgroundImage: "linear-gradient(120deg, #a6c0fe 0%, #f68084)",
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
              }}
              variant="h6"
              component={"h1"}
              fontSize={22}
              fontWeight={700}
            >
              Dissident
            </Typography>
          </Fade>
          {status === "notConnected" && (
            <Button onClick={connect} variant="contained" color="secondary">
              Connect
            </Button>
          )}

          {status === "connected" && (
            <Stack direction="row" alignItems="center" gap={1}>
              <Avvvatars style="shape" value={account} />
              <Typography fontSize={12}>
                {truncateString(account, 4, 4)}
              </Typography>
            </Stack>
          )}
        </Stack>

        {
          status === 'initializing' || status === 'connecting' ?
          <Skeleton variant="rectangular" width={'100%'} height={118} />
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
          <Typography fontSize={30}>Please connect your wallet</Typography>
        )}
            </>
        }

        
      </Container>
    </main>
  );
}
