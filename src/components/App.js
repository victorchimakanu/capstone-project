import { useEffect } from 'react';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';
import '../App.css';


function App() {
  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) //gets account from metamask
    console.log(accounts[0])

    //connect ethers to blockchain 
    const provider = new ethers.providers.Web3Provider(window.ethereum) // provider is connection to the blockchain
    const { chainId } = await provider.getNetwork()
    console.log(chainId)

    // Token smart contract 
    const token = new ethers.Contract(config[chainId].DApp.address, TOKEN_ABI, provider)
    console.log(token.address)
    const symbol = await token.symbol()
    console.log(symbol)
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

