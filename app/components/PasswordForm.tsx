// PasswordForm.tsx
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import {
  checkKeyPairFromStorage,
  loadKeyPairFromStorage,
  saveKeyPairToStorage,
} from "./key_pair_handling/key_pair_storage";
import { useMetaMask } from "metamask-react";
import { KeyPair, generateEncryptionKeyPair } from "../utils/crypto";

export interface IPasswordForm {
  setEncryptionKeyPair: Dispatch<SetStateAction<KeyPair | undefined>>;
}

const PasswordForm = ({ setEncryptionKeyPair }: IPasswordForm) => {
  const [password, setPassword] = useState<string>("");
  const [keyExist, setKeyExist] = useState<boolean>(false);

  const { status, connect, account, ethereum } = useMetaMask();

  const isKeyPresent = async () => {
    if (!account) return;
    const iskeyPresent = await checkKeyPairFromStorage(account);
    setKeyExist(iskeyPresent);
  };

  useEffect(() => {
    isKeyPresent();
  }, [account]);

  const generateEncryptionKeyPairHandler = async () => {
    const kp = await generateEncryptionKeyPair();
    setEncryptionKeyPair(kp);
    return kp;
  };

  const handleSubmit = async () => {
    if (!account) throw new Error("Please connect to Metamask");
    keyExist
      ? loadKeyPairFromStorage(password, account)
      : saveKeyPairToStorage(
          await generateEncryptionKeyPairHandler(),
          password,
          account
        );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          {keyExist ? "Login" : "Register"}
        </Button>
      </Box>
    </form>
  );
};

export default PasswordForm;
