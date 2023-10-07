import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import type { LightNode } from "@waku/interfaces";
import { createEncoder } from "@waku/message-encryption/ecies";
import { hexToBytes } from "@waku/utils/bytes";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { getDynamicPrivateMessageContentTopic } from "@/app/utils/waku";
import { PrivateMessage } from "@/app/utils/wire";

export interface Props {
  waku: LightNode | undefined;
  // address, public key
  address: string;
  recipients: Map<string, Uint8Array>;
  onChangeRecipient: React.Dispatch<React.SetStateAction<string | undefined>>
}

export default function SendMessage({ waku, recipients, onChangeRecipient, address }: Props) {
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>();

  const handleRecipientChange = (event: any) => {
    console.log(event.target.value)
    setRecipient(event.target.value as string);
    onChangeRecipient(event.target.value as string);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const items = Array.from(recipients.keys()).map((recipient) => {
    return (
      <MenuItem key={recipient} value={recipient}>
        {recipient}
      </MenuItem>
    );
  });

  const keyDownHandler = async (event: KeyboardEvent<HTMLInputElement>) => {

    // debugger
    if (
      event.key === "Enter" &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.shiftKey
    ) {
      if (!waku) return;
      if (!recipient) return;
      if (!message) return;
      const publicKey = recipients.get(recipient);
      if (!publicKey) return;

      console.log("send")

      sendMessage(waku, address, recipient, publicKey, message, (res) => {
        if (res) {
          console.log("callback called with", res);
          setMessage("");
        }
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <FormControl>
        <InputLabel id="select-recipient-label">Recipient</InputLabel>
        <Select
          labelId="select-recipient"
          id="select-recipient"
          value={recipient}
          onChange={handleRecipientChange}
        >
          {items}
        </Select>
      </FormControl>
      {/* <TextField
        id="select-recipient"
        label="Recipient"
        variant="filled"
        onChange={handleRecipientChange}
        value={recipient}
      /> */}
      <TextField
        id="message-input"
        label="Message"
        variant="filled"
        onChange={handleMessageChange}
        onKeyDown={keyDownHandler}
        value={message}
      />
    </div>
  );
}

async function sendMessage(
  waku: LightNode,
  address: string,
  recipientAddress: string,
  recipientPublicKey: Uint8Array,
  message: string,
  callback: (res: boolean) => void
) {
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
