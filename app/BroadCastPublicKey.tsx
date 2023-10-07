import React, { useState } from "react";

import type { LightNode, RelayNode } from "@waku/interfaces";
import { createEncoder } from "@waku/message-encryption/symmetric";
import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { KeyPair, PublicKeyMessageEncryptionKey, createPublicKeyMessage } from "./utils/crypto";
import { PublicKeyMessage } from "./utils/wire";
import { Button } from "@mui/material";
import { PublicKeyContentTopic } from "./utils/constants";

interface Props {
    encryptionKeyPair: KeyPair | undefined;
    waku: LightNode | undefined;
    address: string | undefined;
    signer: TypedDataSigner | undefined;
}

export default function BroadcastPublicKey({
    encryptionKeyPair,
    waku,
    address,
    signer,
}: Props) {
    const [publicKeyMsg, setPublicKeyMsg] = useState<PublicKeyMessage>();

    const broadcastPublicKey = async () => {
        if (!encryptionKeyPair) return;
        if (!address) return;
        if (!waku) return;
        if (!signer) return;

        const _publicKeyMessage = await (async () => {
            if (!publicKeyMsg) {
                const pkm = await createPublicKeyMessage(
                    address,
                    encryptionKeyPair.publicKey,
                    signer
                );

                setPublicKeyMsg(pkm);
                return pkm;
            }
            return publicKeyMsg;
        })();
        const payload = _publicKeyMessage.encode();

        const publicKeyMessageEncoder = createEncoder({
            contentTopic: PublicKeyContentTopic,
            symKey: PublicKeyMessageEncryptionKey,
            ephemeral: false,
        });

        console.log("sending pub key")
        await waku.lightPush.send(publicKeyMessageEncoder, { payload });
        console.log("sent pub key")
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={broadcastPublicKey}
            disabled={!encryptionKeyPair || !waku || !address || !signer}
        >
            Broadcast Encryption Public Key
        </Button>
    );
}
