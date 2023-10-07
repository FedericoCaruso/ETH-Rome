import { useState, useEffect } from "react";
import type { LightNode } from "@waku/interfaces";
import { createEncoder } from "@waku/message-encryption/symmetric";
import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { PublicKeyMessage } from "../utils/wire";
import { KeyPair, PublicKeyMessageEncryptionKey, createPublicKeyMessage } from "../utils/crypto";
import { PublicKeyContentTopic } from "../utils/constants";

export function useBroadcastPublicKey(
    encryptionKeyPair: KeyPair | undefined,
    waku: LightNode | undefined,
    address: string | undefined,
    signer: TypedDataSigner | undefined
) {
    const [publicKeyMsg, setPublicKeyMsg] = useState<PublicKeyMessage | null>(
        null
    );

    useEffect(() => {
        const broadcastPublicKey = async () => {
            if (!encryptionKeyPair || !address || !waku || !signer) return;

            if (!publicKeyMsg) {
                const pkm = await createPublicKeyMessage(
                    address,
                    encryptionKeyPair.publicKey,
                    signer
                );
                setPublicKeyMsg(pkm);
            }

            const payload = publicKeyMsg!.encode();

            const publicKeyMessageEncoder = createEncoder({
                contentTopic: PublicKeyContentTopic,
                symKey: PublicKeyMessageEncryptionKey,
                ephemeral: false,
            });

            console.log("sending pub key");
            await waku.lightPush.send(publicKeyMessageEncoder, { payload });
            console.log("sent pub key");
        };

        broadcastPublicKey();
    }, [encryptionKeyPair, address, waku, signer, publicKeyMsg]);

    return {
        publicKeyMsg,
        isBroadcasting: publicKeyMsg === null,
    };
}
