/**
 * Clear text message
 */
export interface Message {
    text: string;
    timestamp: Date;
}

export type Recipient = {
    address: string;
    pubKey: Uint8Array;
};