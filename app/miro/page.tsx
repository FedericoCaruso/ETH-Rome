
'use client'
import React, { useEffect, useState } from 'react'
import { Mnemonic, randomBytes } from 'ethers';

import { createRailgunWallet } from '@railgun-community/wallet';
import { NetworkName } from '@railgun-community/shared-models';



export default function Miro() {
  console.log("working");

  const [railgunWalletInfo, setWalletInfo] = useState(); 

  const encryptionKey: string = '0101010101010101010101010101010101010101010101010101010101010101';
  const genMnemonic = Mnemonic.fromEntropy(randomBytes(16)).phrase.trim();
  const mnemonic = genMnemonic // Either provided by user or generated with ethers.js

  const creationBlockNumberMap: MapType<number> = {
    [NetworkName.Ethereum]: 15725700,
    [NetworkName.Polygon]: 3421400,
  }

  useEffect(() => {
    (async function () {
      const railgunWalletInfo =  await createRailgunWallet(
        encryptionKey, 
        mnemonic, 
        creationBlockNumberMap,
      );
      setWalletInfo(railgunWalletInfo);
    }
     )();
  }, []);

  const id = railgunWalletInfo?.id; // Store this value.
  

  console.log("id");
  console.log(id);
  return (
    <h1>index</h1>
  )
}
