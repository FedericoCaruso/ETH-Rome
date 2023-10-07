import Messages, { Message } from "./Messages";
import type { LightNode } from "@waku/interfaces";
import SendMessage from "./SendMessage";
import { useState } from "react";
import { KeyPair } from "@/app/utils/crypto";

interface Props {
  waku: LightNode | undefined;
  recipients: Map<string, Uint8Array>;
  messages: Message[];
  address: string;
  isLoadingRecipients: boolean;
  encryptionKeyPair: KeyPair
}

export default function Messaging({ waku, recipients, encryptionKeyPair, address, isLoadingRecipients }: Props) {

  const [recipient, setRecipient] = useState<string>();

  return (
    <div>
      {
        isLoadingRecipients ?
          <>is loading recipients</> :
          <SendMessage
            recipients={recipients}
            onChangeRecipient={addr => setRecipient(addr)}
            address={address}
            waku={waku} />
      }
      {
        recipient && address && waku &&
        <Messages
          recipient={recipient}
          address={address}
          encryptionKeyPair={encryptionKeyPair}
          waku={waku}
        />
      }
    </div>
  );
}
