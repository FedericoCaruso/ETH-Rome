import { useEffect, useState } from "react";
import { IDecoder, LightNode, PageDirection } from "@waku/interfaces";
import type { DecodedMessage } from "@waku/message-encryption";
import { useStoreMessages } from "@waku/react";
import { createDecoder } from "@waku/message-encryption/ecies";
import { KeyPair } from "@/app/utils/crypto";
import { getDynamicPrivateMessageContentTopic, handlePrivateMessage } from "@/app/utils/waku";
import { List, ListItem, ListItemText } from "@mui/material";

/**
 * Clear text message
 */
export interface Message {
  text: string;
  timestamp: Date;
}

export interface Props {
  address: string;
  recipient: string;
  encryptionKeyPair: KeyPair;
  waku: LightNode;
}

const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

export default function Messages({ address, recipient, encryptionKeyPair, waku }: Props) {
  const [privateMessageDecoder, setPrivateMessageDecoder] = useState<IDecoder<DecodedMessage>>();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const dynamicContentTopic = getDynamicPrivateMessageContentTopic(address, recipient);

  const observerPrivateMessage = handlePrivateMessage.bind(
    {},
    setChatMessages,
    address
  );

  // init msg decoder dynamically
  useEffect(() => {
    if (!encryptionKeyPair) return;

    setPrivateMessageDecoder(
      createDecoder(dynamicContentTopic, encryptionKeyPair.privateKey)
    );
  }, [encryptionKeyPair]);

  // fetch priv messages from store filtering from dynamic content topic
  const privateMessagesStore = useStoreMessages({
    decoder: privateMessageDecoder,
    node: waku,
    options: {
      pageDirection: PageDirection.FORWARD,
      timeFilter: { startTime: new Date(sevenDaysAgo), endTime: new Date() },
    }
  })

  // map pub key messages to pub key dictionary
  useEffect(() => {
    const keys = privateMessagesStore.messages;
    if (keys.length <= 0) return;

    keys.map(privMsg => observerPrivateMessage(privMsg as DecodedMessage))
  }, [privateMessagesStore.messages])


  return <List dense={true}>{generate(chatMessages)}</List>;
}

function generate(messages: Message[]) {
  return messages.map((msg) => {
    const text = `<${formatDisplayDate(msg.timestamp)}> ${msg.text}`;

    return (
      <ListItem>
        <ListItemText key={formatDisplayDate(msg.timestamp)} primary={text} />
      </ListItem>
    );
  });
}

function formatDisplayDate(timestamp: Date): string {
  return timestamp.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}