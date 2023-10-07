import { Stack, TextField, Typography, InputAdornment, IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material'
import Avvvatars from 'avvvatars-react'
import React, { Dispatch, SetStateAction } from 'react'
import SendIcon from '@mui/icons-material/Send';

export interface IUserList {
    setAlert: Dispatch<SetStateAction<boolean>>
}

export const UserList = ({setAlert}: IUserList) => {

    const [contractAddress, setContractAddress] = React.useState<string>('');

    const setUserToLocalStorage = () => {
        if (contractAddress.length !== 42 && contractAddress.length !== 0) return;
        localStorage.setItem('dissent-contractAddress', contractAddress);
        setAlert(true);
    };

    function createData(
        users: string,
    ) {
        return { users };
    }
    
    const rows = [
        createData('Frozen yoghurt'),
        createData('Ice cream sandwich'),
        createData('Eclair'),
        createData('Cupcake'),
        createData('Gingerbread'),
    ];

  return (
    <Stack gap={2} alignItems='center'>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Contranct address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

            <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    <TextField
                        onChange={(event) => setContractAddress(event.target.value)}
                        error={contractAddress.length !== 42 && contractAddress.length !== 0}
                        helperText={ contractAddress.length !== 42 && contractAddress.length !== 0 &&
                            <Typography>Please insert a valid contract address</Typography>
                        }
                        fullWidth 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={setUserToLocalStorage}
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
                </TableCell>
            </TableRow>


              {rows.map((row) => (
                <TableRow
                  key={row.users}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Stack direction='row' alignItems='center' justifyContent='space-between' >
                        <Stack direction='row' alignItems='center' gap={2}>
                            <Avvvatars style='shape' value={row.users} />
                            {row.users}
                        </Stack>
                        <Button>
                            CHAT
                        </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
  )
}
