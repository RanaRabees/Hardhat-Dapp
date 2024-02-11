/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import logo from './logo.svg';
import './index.css';
import './App.css';
import React, { useState, useEffect } from 'react';  // Import React and useState
import Swal from 'sweetalert2'; // Import Swal
import { ethers } from "ethers";
import contract from "./Lock.sol/Lock.json";

export function SenderAddress() {

  const [senderAddress, setSenderAddress] = useState('');  // State for sender address

  return (
    <>
      <div className="mb-4">
        <label htmlFor="sender-address" className="block text-gray-400 font-bold mb-2">Sender Address</label>
        <input required
          type="text"
          id="sender-address"
          value={senderAddress}  // Set input value from state
          onChange={(e) => setSenderAddress(e.target.value)}  // Update state on change
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter sender address"
        />
      </div>
    </>
  );
};

function App() {
  const { ethereum } = window;
  const [address, setAddress] = useState(''); // State for connected wallet address
  const [balance, setBalance] = useState(''); // State for wallet balance
  const [greeting, setGreeting] = useState(''); // State for Greetings
  const [senderAddress, setSenderAddress] = useState(''); // State for sender address
  const [connectedWallet, setConnectedWallet] = useState(ethereum.selectedAddress); // Track connected wallet



  const contractAddress = "0x383Bfd0605411451879B0f2Ae425eeAb5Cf802A5";

  const alchemyProvider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/S9LIRx84q709zuJvCPZhjvQ_wix27p_8"
  );
  const walletProvider = new ethers.providers.Web3Provider(
    ethereum
  );

  const getContractData = new ethers.Contract(
    contractAddress,
    contract.abi,
    alchemyProvider
  )

  const sendContracttx = new ethers.Contract(
    contractAddress,
    contract.abi,
    (walletProvider.getSigner())
  )

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {

      setAddress(accounts[0]);
      const getbal = async () => {
        const balance = await ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], 'latest']
        })
        setBalance(ethers.utils.formatEther(balance));
      }
      getbal();
    })
    ethereum.on("chainChanged", (chain) => {
      console.log(chain);
    });
  });

  const getGreeting = async () => {
    const data = await getContractData.greet();
    setGreeting(data);
  };

  const setData = async () => {
    // const sendData = await sendContracttx.setGreeting("السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ", {
    //   value: ethers.utils.parseEther('0.1')
    // })
    const sendData = await sendContracttx.setGreeting("السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ");
  };

  const chainChange = async (chain) => {
    // await ethereum.request({
    //   method: "wallet_addEthereumChain",
    //   params: [
    //     {
    //       chainId: `0x13881`,
    //       // chainId: `0x${Number(80001).toString(16)}`,
    //       chainName: "Polygon Testnet",
    //       nativeCurrency: {
    //         name: "MATIC",
    //         symbol: "MATIC",
    //         decimals: 18,
    //       },
    //       rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    //       blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    //     }
    //   ]
    // });
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: `0x13881`,
        }
      ]
    });
  };

  // function sendTx() {
  //   const senderAddress = document.getElementById('sender-address').value; // Get input value
  //   // eslint-disable-next-line eqeqeq
  //   if (senderAddress == null || senderAddress == "0xeC816Fe3CFc4d93e0b59db71c39386620F6B8442") {
  //     alert("Please enter Sender Address First.");
  //     return;
  //   } else {
  //     console.log(senderAddress);
  //     ethereum.request({
  //       method: "eth_sendTransaction",
  //       params: [
  //         {
  //           to: senderAddress, // Use the retrieved value
  //           from: address,
  //           value: `0x${(parseInt(ethers.utils.parseEther('0.1'))).toString(16)}`,
  //           chainId: '0x3'
  //         }
  //       ]
  //     });
  //   }

  // }

  function sendTx() {
    const senderAddress = document.getElementById('sender-address').value; // Get input value

    if (senderAddress === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Sender Address',
        text: 'Please enter Sender Address.',
      });
      return;
    }
    // Optional validation for sender address format:
    const isValidAddress = /^0x[0-9a-f]{40}$/.test(senderAddress);
    if (!isValidAddress) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Address',
        text: 'The sender address format is incorrect. Please check and try again.',
      });
      return;
    }


    if (!connectedWallet) {
      Swal.fire({
        icon: 'warning',
        title: 'Connect Wallet',
        text: 'Please connect your wallet to proceed with the transaction.',
        confirmButtonText: 'Connect Wallet',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          requestAccount(); // Trigger wallet connection
        }
      });
      return;
    }

    setSenderAddress(senderAddress); // Store the entered address

    ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          to: senderAddress,
          from: address,
          value: `0x${(parseInt(ethers.utils.parseEther('0.1'))).toString(16)}`,
          chainId: '0x3'
        }
      ]
    });
  }

  async function requestAccount() {
    // Uncomment if you need additional permissions:
    // await ethereum.request({
    //   method: "wallet_requestPermissions",
    //   params: [{ eth_accounts: {} }]
    // });

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setConnectedWallet(accounts[0]); // Set connected wallet state
    setAddress(accounts[0]); // Store address in state

    const accountBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], 'latest']
    });
    setBalance(ethers.utils.formatEther(accountBalance)); // Update balance state
  }

  return (
    <>
      <div className="App text-center">
        <header className="App-header">
          <img src="/logo.svg" className="App-logo" alt="logo" width="300" height="50" />
          <div className="container mx-auto px-4">
            <h2 className="mt-10 mb-10 text-3xl font-bold text-[#c0ca33]">NFT Marketplace Dapp</h2>
            <SenderAddress className="mb-10" />
            <div className="mt-5 flex flex-wrap gap-10 items-center justify-center -mx-4">
              <div className=" bg-[#f5f5f5] hover:bg-gray-200 transition-all text-black w-full sm:w-1/2 rounded-lg p-8 flex flex-col items-center md:w-1/3 lg:w-1/4">
                <img src="https://cdn-icons-png.flaticon.com/512/2761/2761001.png" alt="Send Transactions" className="w-24 h-24 mb-4" />
                <h3 className="font-bold text-xl mb-2">Send Transactions</h3>
                <p className="text-base leading-relaxed">Make secure, borderless transfers and interact with smart contracts. Take control of your finances and participate in the decentralized future.</p>
                <a className="App-link" onClick={sendTx}>Send Transaction</a>
              </div>

              <div className=" bg-[#f5f5f5] hover:bg-gray-200 transition-all text-black w-full sm:w-1/2 rounded-lg p-8 flex flex-col items-center md:w-1/2 lg:w-1/3">
                <img src="https://icons.veryicon.com/png/o/internet--web/collection-and-payment/wallet-38.png" alt="Connect Wallet" className="w-24 h-24 mb-4" />
                <p className="text-base leading-relaxed">Own your digital assets and interact with the blockchain seamlessly. Connect your wallet and unlock decentralized power.</p>
                {address && (
                  <h3 className="font-bold text-sm mb-2">
                    <p>Connected Wallet: {address}</p><br />
                    <p>Balance: {balance}</p>
                  </h3>
                )}
                <a className="App-link" onClick={requestAccount}>Connect Wallet</a>
              </div>

              <div className=" bg-[#f5f5f5] hover:bg-gray-200 transition-all text-black w-full sm:w-1/2 rounded-lg p-8 flex flex-col items-center md:w-1/3 lg:w-1/4">
                <img src="https://cdn-icons-png.flaticon.com/512/1349/1349937.png" alt="Add Chains" className="w-24 h-24 mb-4" />
                <h3 className="font-bold text-xl mb-2">Add Chains</h3>
                <p className="text-base leading-relaxed">Explore a multi-chain universe and connect to diverse blockchains. Expand your opportunities and unlock boundless possibilities.</p>
                <a className="App-link" onClick={chainChange}>Add Chain</a>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-10 items-center justify-center -mx-4">
              <div onClick={getGreeting} className=" bg-[#f5f5f5] hover:bg-gray-200 transition-all text-black w-full sm:w-1/2 rounded-lg p-8 flex flex-col items-center md:w-1/3 lg:w-1/4">
                <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/human-3046188-2559530.png" alt="Get Greetings" className="w-24 h-24 mb-4" />
                <h3 className="font-bold text-xl mb-2">Get Greetings</h3>
                <p className="text-base leading-relaxed">Discover personalized greetings from the community. Connect with fellow Dapp users and experience the power of a decentralized network.</p>
                <a className="App-link" onClick={getGreeting}>Get Greeting</a>
              </div>

              <h3 className="font-bold text-sm mb-2">{greeting}</h3>

              <div onClick={setData} className=" bg-[#f5f5f5] hover:bg-gray-200 transition-all text-black w-full sm:w-1/2 rounded-lg p-8 flex flex-col items-center md:w-1/3 lg:w-1/4">
                <img src="https://cdn-icons-png.flaticon.com/512/2785/2785578.png" alt="Set Greetings" className="w-24 h-24 mb-4" />
                <h3 className="font-bold text-xl mb-2">Set Greetings</h3>
                <p className="text-base leading-relaxed">Leave your mark on the blockchain and share your thoughts with the community. Set greetings that will resonate and make your presence known.</p>
                <a className="App-link" onClick={setData}>Set Greeting</a>
              </div>
            </div>
          </div>
        </header>
      </div>
      {/* <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            onClick={requestAccount}
          >
            {address}
          </a>
          <br />
          <a
            className="App-link"
          >
            {balance}
          </a>
          <br />
          <a
            className="App-link"
            onClick={sendTx}
          >
            Send Transaction
          </a>
          <br />
          <a
            className="App-link"
            onClick={getGreeting}
          >
            Get Greeting
          </a>
          <br />
          <a
            className="App-link"
            onClick={setData}
          >
            Set Greeting
          </a>
          <br />
          <a
            className="App-link"
          >
            {greeting}
          </a>
          <br />
          <a
            className="App-link"
            onClick={chainChange}
          >
            Add Chain
          </a>
          <br />
        </header>
      </div> */}
    </>
  );
}

export default App;

// Deployed Address:
// 0x383Bfd0605411451879B0f2Ae425eeAb5Cf802A5


