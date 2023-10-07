import React, { useState } from 'react'
import { Chat, UserList } from '.'
import { Slide, Alert, Grid } from '@mui/material';
import { KeyPair } from '../utils/crypto';
import { Recipient } from '../utils/types';

export interface IChatContainer {
    encryptionKeyPair: KeyPair;
}

export const ChatContainer = ({ encryptionKeyPair }: IChatContainer) => {

    const [alert, setAlert] = useState<boolean>(false);
    const [recipient, setRecipient] = useState<Recipient>();

    return (
        <Grid container spacing={2}>

            <Grid item xs={12} md={4}>
                <UserList
                    setAlert={setAlert}
                    setRecipient={setRecipient}
                />
            </Grid>

            <Grid item xs={12} md={8}>
                {
                    encryptionKeyPair && recipient &&
                    <Chat
                        recipient={recipient}
                        encryptionKeyPair={encryptionKeyPair}
                    />
                }
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
