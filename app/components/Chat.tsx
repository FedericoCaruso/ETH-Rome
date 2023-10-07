import { Box, Card, CardActions, CardContent, IconButton, InputAdornment, Slide, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useContext, useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from '../utils';
import { KeyPair } from '../utils/crypto';
import { IDecoder, LightNode, PageDirection } from '@waku/interfaces';
import { DecodedMessage } from '@waku/message-encryption';
import { getDynamicPrivateMessageContentTopic, handlePrivateMessage } from '../utils/waku';
import { createDecoder } from "@waku/message-encryption/ecies";
import { useStoreMessages } from '@waku/react';
import { WakuContext } from '../hooks/useWakuContext';

export interface Message {
  text: string;
  timestamp: Date;
}

export interface Props {
  recipient: string;
  encryptionKeyPair: KeyPair;
}

const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

export const Chat = ({ recipient, encryptionKeyPair }: Props) => {

    const { status, connect, account, ethereum } = useMetaMask();

    const waku = useContext(WakuContext);

    const [privateMessageDecoder, setPrivateMessageDecoder] = useState<IDecoder<DecodedMessage>>();
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const dynamicContentTopic = getDynamicPrivateMessageContentTopic(account ?? '', recipient);

    const observerPrivateMessage = handlePrivateMessage.bind(
        {},
        setChatMessages,
        account ?? ''
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

  useEffect(() => {
    const keys = privateMessagesStore.messages;
    if (keys.length <= 0) return;

    keys.map(privMsg => observerPrivateMessage(privMsg as DecodedMessage))
  }, [privateMessagesStore.messages])

  function formatDisplayDate(timestamp: Date): string {
    return timestamp.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  }


    // const [firstUserMessages, setFirstUserMessages] = useState<string[]>([]);
    // const [secondUserMessages, setSecondUserMessages] = useState<string[]>([]);

    const [contractAddress, setContractAddress] = useState<string>('');

    // const  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     console.log('ca')
    //     if (event.key  === 'Enter') {
    //             setContractAddress(event.currentTarget.value);
    //         }
    //     };

    return (
        <Card sx={{minHeight: 325, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <CardContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {
                    chatMessages.map(item => (
                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box sx={{color: 'lightblue', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: 2}}>
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
                <TextField
                    value={contractAddress}
                    onChange={(event) => setContractAddress(event.target.value)}
                    fullWidth 
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        //setSecondUserMessages(prevState => [...prevState, contractAddress]);
                                        setContractAddress('');
                                    }}
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
            </CardActions>
        </Card>
    )
}
