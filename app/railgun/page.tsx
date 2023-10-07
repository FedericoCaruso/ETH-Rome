
'use client'
import React, { useEffect, useState } from 'react'
import { Mnemonic, randomBytes } from 'ethers';

import { createRailgunWallet } from '@railgun-community/wallet';
import { NetworkName } from '@railgun-community/shared-models';

//required by railgun engine to boot
import { 
  startRailgunEngine, 
} from '@railgun-community/wallet';
import LevelDB from 'level-js';
import { createArtifactStore } from '../utils/create-artifact-store';




export default function Railgun() {

  const [railgunWalletInfo, setWalletInfo] = useState(); 

  async function generateWallet() {

    startRailgun();    
    const encryptionKey: string = '0101010101010101010101010101010101010101010101010101010101010101';
    const genMnemonic = Mnemonic.fromEntropy(randomBytes(16)).phrase.trim();
    const mnemonic = genMnemonic // Either provided by user or generated with ethers.js

    const creationBlockNumberMap: MapType<number> = {
      [NetworkName.Ethereum]: undefined,
      [NetworkName.Polygon]: undefined,
      [NetworkName.EthereumGoerli]: undefined,
    }
  
    const railgunWalletInfo =  await createRailgunWallet(
      encryptionKey, 
      mnemonic, 
      creationBlockNumberMap,
    );
   // setWalletInfo(railgunWalletInfo);

    console.log("Mnemonic: " + mnemonic);
    alert("Mnemonic: " + mnemonic)
    
    console.log("railgun address: " + railgunWalletInfo?.railgunAddress);
    alert("railgun address: " + railgunWalletInfo?.railgunAddress)

    alert("goto: https://app.railway.xyz/")

    // doeasn matter for use case
    // console.log("railgun id: " + railgunWalletInfo?.id);

  }

  function startRailgun() {
    console.log('Railgun starting');

    try{

      const walletSource = 'quickstart demo';
      const dbPath = 'engine.db';
      const db = new LevelDB(dbPath);
      const shouldDebug = true;
      const artifactStore = createArtifactStore('local/dir');
      const useNativeArtifacts = false;
      const skipMerkletreeScans = false;
      
      startRailgunEngine(
        walletSource,
        db,
        shouldDebug,
        artifactStore,
        useNativeArtifacts,
        skipMerkletreeScans,
      )
      console.log("Railgun started");
    }
    catch (err) {
      alert(err);
    }
   
  }

  return (
    <div>
      <h1>Railgun</h1>

      <button onClick={generateWallet}>
        generate Wallet
      </button>
    </div>
    
  )
}
