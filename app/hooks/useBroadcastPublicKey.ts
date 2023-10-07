import { useState, useEffect, useContext } from "react";
import { createEncoder } from "@waku/message-encryption/symmetric";
import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { PublicKeyMessage } from "../utils/wire";
import { KeyPair, PublicKeyMessageEncryptionKey, createPublicKeyMessage } from "../utils/crypto";
import { PublicKeyContentTopic } from "../utils/constants";
import { WakuContext } from "./useWakuContext";

export function useBroadcastPublicKey(
    encryptionKeyPair: KeyPair | undefined,
    address: string | undefined,
    signer: TypedDataSigner | undefined
) {
    const [publicKeyMsg, setPublicKeyMsg] = useState<PublicKeyMessage | null>(
        null
    );

    const waku = useContext(WakuContext);

    useEffect(() => {
        const broadcastPublicKey = async () => {
            if (!encryptionKeyPair || !address || !waku || !signer) return;

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
