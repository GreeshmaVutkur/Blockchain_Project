// src/pages/TransportPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../App.css';

function TransportPage() {
  const [batchesBought, setBatchesBought] = useState([]); // Store all bought batches
  const [batchId, setBatchId] = useState(''); // Selected batch ID for setting delivery date
  const [deliveryDate, setDeliveryDate] = useState(''); // Selected delivery date
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const contractAddress = "0x16F89741EdB5FADE0d502256f4D32F67E01aa74B"; // Replace with your deployed contract address

  const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            }
        ],
        "name": "addProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productID",
                "type": "uint256"
            }
        ],
        "name": "fetchProduct",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "deliveryLocation",
                "type": "string"
            }
        ],
        "name": "buyProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deliveryDate",
                "type": "uint256"
            }
        ],
        "name": "setDeliveryDate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllBatches",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "productID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "status",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "retailer",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "deliveryLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deliveryDate",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SupplyChain.Product[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "productID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "retailer",
                "type": "address"
            }
        ],
        "name": "ProductPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "productID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deliveryDate",
                "type": "uint256"
            }
        ],
        "name": "DeliveryDateSet",
        "type": "event"
    }
];







  // Connect to MetaMask and initialize contract
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request MetaMask account access
        const signer = provider.getSigner();
        const accountAddress = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        setProvider(provider);
        setSigner(signer);
        setAccount(accountAddress);
        setContract(contract);

        alert("MetaMask connected successfully");
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };
    connectWallet();
  }, []);

  // Fetch all batches that have been bought
  const fetchBoughtBatches = async () => {
    try {
      const allBatches = await contract.getAllBatches();

      // Filter batches with "purchased" status
      const boughtBatches = allBatches.filter(batch => batch.status.includes("purchased"));
      setBatchesBought(boughtBatches);
    } catch (error) {
      console.error("Error fetching bought batches:", error);
    }
  };

  // Set delivery date for a batch
  const handleSetDeliveryDate = async () => {
    if (!batchId || !deliveryDate) {
      alert("Please provide both Batch ID and Delivery Date");
      return;
    }

    try {
      const batchIDInt = parseInt(batchId);
      const deliveryDateInt = new Date(deliveryDate).getTime() / 1000; // Convert to UNIX timestamp

      const tx = await contract.setDeliveryDate(batchIDInt, deliveryDateInt);
      await tx.wait(); // Wait for the transaction to be mined

      alert(`Delivery date set for Batch ID: ${batchId}`);
      setBatchId('');
      setDeliveryDate('');
    } catch (error) {
      console.error("Error setting delivery date:", error);
      alert("Error setting delivery date. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <h2>Transport Page</h2>

      <div className="button-container">
        {/* Button to fetch all bought batches */}
        <button onClick={fetchBoughtBatches} className="action-button">Fetch Bought Batches</button>
      </div>

      {/* Display bought batches */}
      <div className="batches-section">
        <h3>Batches Bought</h3>
        <ul className="batch-list">
          {batchesBought.map((batch, index) => (
            <li key={index} className="batch-item">
              <p><strong>Batch ID:</strong> {batch.batchID}</p>
              <p><strong>Description:</strong> {batch.description}</p>
              <p><strong>Status:</strong> {batch.status}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Form to set delivery date */}
      <div className="form-section">
        <h3>Set Delivery Date</h3>
        <input
          type="text"
          placeholder="Enter Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSetDeliveryDate} className="action-button">Set Delivery Date</button>
      </div>
    </div>
  );
}

export default TransportPage;
