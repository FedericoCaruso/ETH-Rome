import {
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  ListSubheader,
} from "@mui/material";
import Avvvatars from "avvvatars-react";
import React, { Dispatch, SetStateAction } from "react";
import SendIcon from "@mui/icons-material/Send";
import { truncateString } from "../utils";

export interface IUserList {
  setAlert: Dispatch<SetStateAction<boolean>>;
}

export const UserList = ({ setAlert }: IUserList) => {
  const [contractAddress, setContractAddress] = React.useState<string>("");

  const setUserToLocalStorage = () => {
    if (contractAddress.length !== 42 && contractAddress.length !== 0) return;
    localStorage.setItem("dissent-contractAddress", contractAddress);
    setAlert(true);
  };

  function createData(address: string) {
    return { address };
  }

  const rows = [
    createData("Frozen yoghurt"),
    createData("Ice cream sandwich"),
    createData("Eclair"),
    createData("Cupcake"),
    createData("Gingerbread"),
  ];

  return (
    <Stack gap={2} alignItems="center">
      {/* <Paper>
        <TextField
          onChange={(event) => setContractAddress(event.target.value)}
          error={contractAddress.length !== 42 && contractAddress.length !== 0}
          helperText={
            contractAddress.length !== 42 &&
            contractAddress.length !== 0 && (
              <Typography>Please insert a valid contract address</Typography>
            )
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
          variant="outlined"
          placeholder="Insert a contract address"
        />
      </Paper> */}

      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Typography variant="h6" align="center" gutterBottom>
              📢 Active dissidents
            </Typography>
          </ListSubheader>
        }
      >
        {rows.map((row, index) => (
          <React.Fragment key={row.address}>
            <ListItem
              sx={{ "&:last-child": { border: 0 } }}
              button // Add the 'button' property to make the ListItem clickable
              onClick={() => {
                // Handle the click event here
                console.log("ListItem clicked:", row.address);
              }}
            >
              <ListItemAvatar>
                <Avvvatars style="shape" value={row.address} />
              </ListItemAvatar>
              <ListItemText primary={truncateString(row.address, 8, 6)} />
            </ListItem>
            {index < rows.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Stack>
  );
};
