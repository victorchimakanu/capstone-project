import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { ethers } from 'ethers';
import config from '../config.json';
// import TOKEN_ABI from '../abis/Token.json'; 
//import store from '../store/store';

import { 
  loadProvider, 
  loadNetwork, 
  loadAccount,
  loadTokens,
  loadExchange
} from '../store/interactions'; 

 
function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    //connect ethers to blockchain 
    const provider = loadProvider(dispatch)

    //fetch current networks chainID (i.e hardhat: 31337)
    const chainId = await loadNetwork(provider,dispatch)
    
    //fetch current account & balance from metamask
    await loadAccount(provider, dispatch) //gets account from metamask 

    // load Token smart contract 
    const DApp = config[chainId].DApp
    const mETH = config[chainId].mETH
     await loadTokens(provider, [DApp.address, mETH.address], dispatch) // PAIR 

     // Load exchange smart Contract
     const exchangeConfig = config[chainId].exchange
     await loadExchange(provider, exchangeConfig.address, dispatch)
    
    

  }
  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;


