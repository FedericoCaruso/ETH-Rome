import { LoadKeyPair } from "./LoadKeyPair";
import { SaveKeyPair } from "./SaveKeyPair";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import { KeyPair, generateEncryptionKeyPair } from "@/app/utils/crypto";
import { Button } from "@mui/material";

export interface Props {
  encryptionKeyPair: KeyPair | undefined;
  setEncryptionKeyPair: (keyPair: KeyPair) => void;
}

export default function KeyPairHandling({
  encryptionKeyPair,
  setEncryptionKeyPair,
}: Props) {

  const [password, setPassword] = useState<string>();

  const generateKeyPair = () => {
    if (encryptionKeyPair) return;

    generateEncryptionKeyPair()
      .then((keyPair) => {
        setEncryptionKeyPair(keyPair);
      })
      .catch((e) => {
        console.error("Failed to generate Key Pair", e);
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={generateKeyPair}
        disabled={!!encryptionKeyPair}
      >
        Generate Encryption Key Pair
      </Button>
      <div>
        <PasswordInput
          password={password}
          setPassword={(p) => setPassword(p)}
        />
        <div>
          <div>
            <LoadKeyPair
              setEncryptionKeyPair={(keyPair) => setEncryptionKeyPair(keyPair)}
              disabled={!!encryptionKeyPair}
              password={password}
            />
          </div>
          <div>
            <SaveKeyPair
              EncryptionKeyPair={encryptionKeyPair}
              password={password}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
