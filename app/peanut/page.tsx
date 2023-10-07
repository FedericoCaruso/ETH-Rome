
'use client'
import peanut from '@squirrel-labs/peanut-sdk';
import { ethers } from "ethers";




export default function Peanut() {

  const CHAINID = 5; // goerli
  const RPC_URL = 'https://rpc.ankr.com/eth_goerli';

  async function startPeanut() {

    const mnemonic = "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol" // Replace this with a dev wallet seed phrase
    let walletMnemonic = ethers.Wallet.fromPhrase(mnemonic)
    const address = await walletMnemonic.getAddress();
    console.log("Test address: " + address);

    const wallet = new ethers.Wallet(
      walletMnemonic.privateKey,
      new ethers.JsonRpcProvider(RPC_URL));

    // create link
    const createLinkResponse = await peanut.createLink({
      structSigner:{
        signer: wallet
      },
      linkDetails:{
        chainId: CHAINID,
        tokenAmount: 0.01,
        tokenType: 0,  // 0 for ether, 1 for erc20, 2 for erc721, 3 for erc1155
      }
    });
  
    console.log("New link: " + createLinkResponse.createdLink.link[0]);  

  }
  
  return (
    <div>
      <h1>Peanut</h1>

      <button onClick={startPeanut}>
        generate Wallet
      </button>
    </div>
    
  )
}
