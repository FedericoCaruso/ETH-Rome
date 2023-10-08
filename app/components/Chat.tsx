
import { Box, Card, CardActions, CardContent, Container, IconButton, InputAdornment, Skeleton, Slide, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react';


import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from '../utils';
import { KeyPair } from '../utils/crypto';
import { IDecoder, LightNode, PageDirection } from '@waku/interfaces';
import { DecodedMessage } from '@waku/message-encryption';
import { getDynamicPrivateMessageContentTopic, handlePrivateMessage } from '../utils/waku';
import { createDecoder } from "@waku/message-encryption/ecies";
import { useStoreMessages, useWaku } from '@waku/react';
import { SevenDaysAgo } from '../utils/constants';
import SendMessage from './SendMessage';
import { Recipient } from '../utils/types';
import Peanut from './Peanut';
import FloatingActionButtonZoom from './FloatingActionButtonZoom';

export interface Message {
    text: string;
    timestamp: Date;
}

export interface Props {
    recipient: Recipient;
    encryptionKeyPair: KeyPair;
}

export const Chat = ({ recipient, encryptionKeyPair }: Props) => {
    const { account } = useMetaMask();

    const { node: waku } = useWaku<LightNode>();

    const [privateMessageDecoder, setPrivateMessageDecoder] = useState<IDecoder<DecodedMessage>>();
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const dynamicContentTopic = getDynamicPrivateMessageContentTopic(account ?? '', recipient.address);

    const observerPrivateMessage = handlePrivateMessage.bind(
        {},
        setChatMessages,
        account ?? ''
    );

    // init msg decoder dynamically
    useEffect(() => {
        if (!encryptionKeyPair) return;

        const decoder = createDecoder(dynamicContentTopic, encryptionKeyPair.privateKey);
        setPrivateMessageDecoder(decoder);
    }, [encryptionKeyPair, dynamicContentTopic]);

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        (async () => {
            if (!waku) return;
            if (!privateMessageDecoder) return;

            setIsLoading(true)
            try {
                await waku.store.queryOrderedCallback(
                    [privateMessageDecoder],
                    (msg) => console.log("new msg!!!!", msg),
                    // observerPrivateMessage,
                    {
                        pageDirection: PageDirection.FORWARD,
                        timeFilter: { startTime: new Date(SevenDaysAgo), endTime: new Date() },
                    }
                );
            } finally {
                setIsLoading(false)
            }
        })();
    }, [waku, privateMessageDecoder])

    return (
		<div>
        <Card sx={{ minHeight: 400, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent sx={{ minHeight: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {
                    isLoading ?
                        <>
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                        </> :

                        chatMessages.map(item => (
                            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                                <Box sx={{ color: 'lightblue', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avvvatars style="shape" value={account ?? ''} />
                                    <Typography fontSize={12}>
                                        {truncateString(account ?? '', 4, 4)}
                                    </Typography>
                                    {item.text}
                                </Box>
                            </Slide>
                        ))
                }
            </CardContent>
            <CardActions>
                {
                    isLoading ?
                        <Skeleton animation="wave" /> :
                        <SendMessage
                            recipient={recipient} />
                }
            </CardActions>
 			<Container maxWidth="sm">
                <FloatingActionButtonZoom />
            </Container>
        </Card>
        </div>
    )
}
