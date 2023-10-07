
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




export default function Miro() {
  // console.log("working");

  // const [railgunWalletInfo, setWalletInfo] = useState(); 

  // const encryptionKey: string = '0101010101010101010101010101010101010101010101010101010101010101';
  // const genMnemonic = Mnemonic.fromEntropy(randomBytes(16)).phrase.trim();
  // const mnemonic = genMnemonic // Either provided by user or generated with ethers.js

  /*
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

  */
  const [railgunWalletInfo, setWalletInfo] = useState(); 

  async function generateWallet() {
    alert("Generate Wallet started");

    
    const encryptionKey: string = '0101010101010101010101010101010101010101010101010101010101010101';
    const genMnemonic = Mnemonic.fromEntropy(randomBytes(16)).phrase.trim();
    const mnemonic = genMnemonic // Either provided by user or generated with ethers.js

    const creationBlockNumberMap: MapType<number> = {
      [NetworkName.Ethereum]: 15725700,
      [NetworkName.Polygon]: 3421400,
    }
  
  
      const railgunWalletInfo =  await createRailgunWallet(
        encryptionKey, 
        mnemonic, 
        creationBlockNumberMap,
      );
      setWalletInfo(railgunWalletInfo);
    
     
  
    const id = railgunWalletInfo?.id; // Store this value.
    
    alert(id);

  }

  function startRailgun() {
    alert('Railgun starting');

    try{
       // Name for your wallet implementation.
      // Encrypted and viewable in private transaction history.
      // Maximum of 16 characters, lowercase.
      const walletSource = 'quickstart demo';
      
      // LevelDOWN compatible database for storing encrypted wallets.
      const dbPath = 'engine.db';
      const db = new LevelDB(dbPath);
      
      // Whether to forward Engine debug logs to Logger.
      const shouldDebug = true;
      
      // Persistent store for downloading large artifact files required by Engine.
      const artifactStore = createArtifactStore('local/dir');
      
      // Whether to download native C++ or web-assembly artifacts.
      // True for mobile. False for nodejs and browser.
      const useNativeArtifacts = false;
      
      // Whether to skip merkletree syncs and private balance scans. 
      // Only set to TRUE in shield-only applications that don't 
      // load private wallets or balances.
      const skipMerkletreeScans = false;
      
      startRailgunEngine(
        walletSource,
        db,
        shouldDebug,
        artifactStore,
        useNativeArtifacts,
        skipMerkletreeScans,
      )
      alert("started");

    }
    catch (err) {
      console.log(err);
      alert(err);
    }
   
  }

  return (
    <div>
      <h1>index</h1>
      <button onClick={startRailgun}>
        intialize RailgunEngine
      </button>
      <br />
      <button onClick={generateWallet}>
        generate Wallet
      </button>
    </div>
    
  )
}
