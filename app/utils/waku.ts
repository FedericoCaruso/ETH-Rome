import { Dispatch, SetStateAction } from "react";
import type { LightNode } from "@waku/interfaces";
import { Protocols } from "@waku/interfaces";
import { SimpleHash, validatePublicKeyMessage } from "./crypto";
import { equals } from "uint8arrays/equals";
import { waitForRemotePeer, createLightNode } from "@waku/sdk";
import { bytesToHex, hexToBytes } from "@waku/utils/bytes";
import type { DecodedMessage } from "@waku/message-encryption";
import { Message } from "./types";
import { PrivateMessage, PublicKeyMessage } from "./wire";
import { PrivateMessageContentTopicPrefix } from "./constants";

export async function initWaku(): Promise<LightNode> {
    const waku = await createLightNode({ defaultBootstrap: true });
    await waku.start();
    await waitForRemotePeer(waku, [Protocols.Filter, Protocols.LightPush, Protocols.Store]);

    return waku;
}

export function handlePublicKeyMessage(
    myAddress: string | undefined,
    setter: Dispatch<SetStateAction<Map<string, Uint8Array>>>,
    msg: DecodedMessage
) {
    console.log("Public Key Message received:", msg);
    if (!msg.payload) return;
    const publicKeyMsg = PublicKeyMessage.decode(msg.payload);
    if (!publicKeyMsg) return;
    if (myAddress && equals(publicKeyMsg.ethAddress, hexToBytes(myAddress)))
        return;

    const res = validatePublicKeyMessage(publicKeyMsg);
    console.log("Is Public Key Message valid?", res);

    if (res) {
        setter((prevPks: Map<string, Uint8Array>) => {
            prevPks.set(
                bytesToHex(publicKeyMsg.ethAddress),
                publicKeyMsg.encryptionPublicKey
            );
            return new Map(prevPks);
        });
    }
}

export async function handlePrivateMessage(
    setter: Dispatch<SetStateAction<Message[]>>,
    address: string,
    wakuMsg: DecodedMessage
) {
    console.log("Private Message received:", wakuMsg);
    if (!wakuMsg.payload) return;
    const privateMessage = PrivateMessage.decode(wakuMsg.payload);
    if (!privateMessage) {
        console.log("Failed to decode Private Message");
        return;
    }
    if (!equals(privateMessage.toAddress, hexToBytes(address))) return;

    const timestamp = wakuMsg.timestamp ? wakuMsg.timestamp : new Date();

    console.log("Message decrypted:", privateMessage.message);
    setter((prevMsgs: Message[]) => {
        const copy = prevMsgs.slice();
        copy.push({
            text: privateMessage.message,
            timestamp: timestamp,
        });
        return copy;
    });
}

export const getDynamicPrivateMessageContentTopic = (addr1: string, addr2: string) => {
    const suffix = [trim0x(addr1), trim0x(addr2)].sort((a, b) => a.localeCompare(b)).join('/');
    return `${PrivateMessageContentTopicPrefix}/${SimpleHash(suffix)}`
}

const trim0x = (addr: string) => {
    if (addr.startsWith('0x')) {
        return addr.slice(2);
    }

    if (addr.startsWith('0X')) {
        return addr.slice(2);
    }

    return addr;
}