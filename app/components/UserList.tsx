import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListSubheader,
} from "@mui/material";
import Avvvatars from "avvvatars-react";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { truncateString } from "../utils";
import { Decoder, PageDirection } from "@waku/sdk";
import { DecodedMessage } from "@waku/message-encryption/ecies";
import { createDecoder as createSymmetricDecoder } from "@waku/message-encryption/symmetric";
import { useMetaMask } from 'metamask-react';
import { useStoreMessages } from '@waku/react';
import { WakuContext } from "../hooks/useWakuContext";
import { handlePublicKeyMessage } from "../utils/waku";
import { PublicKeyContentTopic, SevenDaysAgo } from "../utils/constants";
import { PublicKeyMessageEncryptionKey } from "../utils/crypto";

export interface IUserList {
  setAlert: Dispatch<SetStateAction<boolean>>;
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
}

export const UserList = ({ setAlert, setRecipient }: IUserList) => {

  const [symmDecoder, setSymmDecoder] = useState<Decoder>();
  const [publicKeys, setPublicKeys] = useState<Map<string, Uint8Array>>(
    new Map()
  );

  const { account } = useMetaMask();
  const waku = useContext(WakuContext);
  const observerPublicKeyMessage = handlePublicKeyMessage.bind(
    {},
    account ?? undefined,
    setPublicKeys
  );

  // init decoder fo symmetrically encrypted key exchange messages
  useEffect(() => {
    if (!waku) return;

    const publicKeyMessageDecoder = createSymmetricDecoder(
      PublicKeyContentTopic,
      PublicKeyMessageEncryptionKey
    );

    setSymmDecoder(publicKeyMessageDecoder);
  }, [waku, account])

  // fetch key exchange from waku's store protocol
  const keysExchangeStore = useStoreMessages({
    decoder: symmDecoder,
    node: waku,
    options: {
      pageDirection: PageDirection.FORWARD,
      timeFilter: { startTime: new Date(SevenDaysAgo), endTime: new Date() },
    }
  })

  // map pub key messages to pub key dictionary
  useEffect(() => {
    const keys = keysExchangeStore.messages;
    if (keys.length <= 0) return;

    keys.map(x => observerPublicKeyMessage(x as DecodedMessage))
  }, [keysExchangeStore.messages])

  const users = Array.from(publicKeys.keys());

  return (
    <Stack gap={2} alignItems="center">
      {/* <Paper>
        <TextField
          onChange={(event) => setContractAddress(event.target.value)}
          error={contractAddress.length !== 42 && contractAddress.length !== 0}
          helperText={
            contractAddress.length !== 42 &&
            contractAddress.length !== 0 && (
              <Typography>Please insert a valid contract address</Typography>
            )
          }
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={setUserToLocalStorage}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          placeholder="Insert a contract address"
        />
      </Paper> */}

      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Typography variant="h6" align="center" gutterBottom>
              📢 Active dissidents
            </Typography>
          </ListSubheader>
        }
      >
        {users.map((user, index) => (
          <React.Fragment key={user}>
            <ListItem
              sx={{ "&:last-child": { border: 0 } }}
              button // Add the 'button' property to make the ListItem clickable
              onClick={() => {
                // Handle the click event here
                console.log("Selected recipient: " + user);
                setRecipient(user);
              }}
            >
              <ListItemAvatar>
                <Avvvatars style="shape" value={user} />
              </ListItemAvatar>
              <ListItemText primary={truncateString(user, 8, 6)} />
            </ListItem>
            {index < users.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Stack>
  );
};
