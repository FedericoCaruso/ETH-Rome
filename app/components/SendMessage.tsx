import React, { ChangeEvent, KeyboardEvent, useContext, useState } from "react";
import type { LightNode } from "@waku/interfaces";
import { createEncoder } from "@waku/message-encryption/ecies";
import { hexToBytes } from "@waku/utils/bytes";
import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import { getDynamicPrivateMessageContentTopic } from "@/app/utils/waku";
import { PrivateMessage } from "@/app/utils/wire";
import SendIcon from '@mui/icons-material/Send';
import { useMetaMask } from "metamask-react";
import { WakuContext } from "../hooks/useWakuContext";
import { Recipient } from "../utils/types";

export interface Props {
  recipient: Recipient;
}

export default function SendMessage({ recipient }: Props) {
  console.log("Recipient passed to SendMessage")
  console.dir(recipient)

  const [message, setMessage] = useState<string>();

  const { account } = useMetaMask();
  const waku = useContext(WakuContext);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const keyDownHandler = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.shiftKey
    ) {
      prepareAndSend(waku, account, recipient, message, setMessage);
    }
  };

  const clickHandler = async () => {
    prepareAndSend(waku, account, recipient, message, setMessage);
  };

  return (
    <TextField
      value={message}
      onChange={handleMessageChange}
      onKeyDown={keyDownHandler}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => clickHandler()}
              edge="end"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant='outlined'
      placeholder='Insert a contract address'
    />
  );
}

function prepareAndSend(
  waku: LightNode | undefined,
  account: string | null,
  recipient: Recipient,
  message: string | undefined,
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>) {
  if (!waku) return;
  if (!recipient) return;
  if (!message) return;
  if (!recipient) return;
  if (!recipient.address) return;
  if (!recipient.pubKey) return;

  console.log("send")

  sendMessage(waku, account ?? '', recipient.address, recipient.pubKey, message, (res) => {
    if (res) {
      console.log("callback called with", res);
      setMessage("");
    }
  });
}

async function sendMessage(
  waku: LightNode,
  address: string,
  recipientAddress: string,
  recipientPublicKey: Uint8Array,
  message: string,
  callback: (res: boolean) => void
) {
  debugger
  const privateMessage = new PrivateMessage({
    toAddress: hexToBytes(recipientAddress),
    message: message,
  });
  const payload = privateMessage.encode();

  const encoder = createEncoder({
    contentTopic: getDynamicPrivateMessageContentTopic(recipientAddress, address),
    publicKey: recipientPublicKey,
    ephemeral: false,
  });

  console.log("pushing");
  const res = await waku.lightPush.send(encoder, { payload });
  console.log("Message sent", res);
  callback(Boolean(res.recipients.length));
}
