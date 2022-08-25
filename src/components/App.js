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
  loadToken
} from '../store/interactions'; 

 
function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
  await loadAccount(dispatch) //gets account from metamask 
   

    //connect ethers to blockchain 
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider,dispatch)
    
    // Token smart contract 
     await loadToken(provider, config[chainId].DApp.address, dispatch)
    

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


