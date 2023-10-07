import { Box, Card, CardActions, CardContent, IconButton, InputAdornment, Slide, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useMetaMask } from 'metamask-react';
import Avvvatars from 'avvvatars-react';
import { truncateString } from '../utils';

export const Chat = () => {

    const { status, connect, account, ethereum } = useMetaMask();

    const [firstUserMessages, setFirstUserMessages] = useState<string[]>([]);
    const [secondUserMessages, setSecondUserMessages] = useState<string[]>([]);

    const [contractAddress, setContractAddress] = useState<string>('');

    const  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('ca')
        if (event.key  === 'Enter') {
                setContractAddress(event.currentTarget.value);
            }
        };

    return (
        <Card sx={{minHeight: 300, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <CardContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {
                    secondUserMessages.map(item => (
                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box sx={{color: 'lightblue', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: 2}}>
                                <Avvvatars style="shape" value={account ?? ''} />
                                <Typography fontSize={12}>
                                    {truncateString(account ?? '', 4, 4)}
                                </Typography>
                                {item}
                            </Box>
                        </Slide>
                    ))
                }
            </CardContent>
            <CardActions>
                <TextField
                    value={contractAddress}
                    onChange={(event) => setContractAddress(event.target.value)}
                    onKeyDown={handleKeyDown}
                    fullWidth 
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        setSecondUserMessages(prevState => [...prevState, contractAddress]);
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
