// src/pages/UpdateSupplyChainPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../App.css';

function RetailPage() {
  const [batchesInRetail, setBatchesInRetail] = useState([]); // Stores all batches in retail
  const [batchesBought, setBatchesBought] = useState([]); // Stores all batches bought by the user
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const contractAddress = "0x16F89741EdB5FADE0d502256f4D32F67E01aa74B"; // Replace with your deployed contract address

  const abi =[
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

  // Fetch all batches currently in retail
  const fetchBatchesInRetail = async () => {
    try {
      const allBatches = await contract.getAllBatches();
  
      // Convert BigNumber fields to strings or numbers
      const formattedBatches = allBatches.map((batch) => ({
        productID: batch.productID.toNumber(), // Convert BigNumber to number
        description: batch.description,
        status: batch.status,
        retailer: batch.retailer,
        deliveryLocation: batch.deliveryLocation,
        deliveryDate: batch.deliveryDate.toNumber(), // Convert BigNumber to number
      }));
  
      setBatchesInRetail(formattedBatches);
    } catch (error) {
      console.error("Error fetching batches in retail:", error);
    }
  };

  // Fetch all batches bought by the user
  const fetchBatchesBought = async () => {
    try {
      const allBatches = await contract.getAllBatches();
  
      // Convert BigNumber fields and filter batches bought by the current user
      const boughtBatches = allBatches
        .map((batch) => ({
          productID: batch.productID.toNumber(),
          description: batch.description,
          status: batch.status,
          retailer: batch.retailer,
          deliveryLocation: batch.deliveryLocation,
          deliveryDate: batch.deliveryDate.toNumber(),
        }))
        .filter((batch) => batch.retailer.toLowerCase() === account.toLowerCase());
  
      setBatchesBought(boughtBatches);
    } catch (error) {
      console.error("Error fetching batches bought:", error);
    }
  };

  const handleBuyProduct = async (productID) => {
    try {
      await contract.buyProduct(productID, "Sample Location");
      alert(`Batch with ID ${productID} purchased successfully.`);
    } catch (error) {
      console.error("Error purchasing product:", error);
    }
  };

  return (
    <div className="page-container">
      <h2>Retail Page</h2>
      <div className="button-container">
        <button onClick={fetchBatchesInRetail} className="action-button">Fetch All Batches in Retail</button>
        <button onClick={fetchBatchesBought} className="action-button">Fetch Batches Bought</button>
      </div>

      <div className="batches-section">
        <h3>Batches in Retail</h3>
        <ul className="batch-list">
          {batchesInRetail.map((batch, index) => (
            <li key={index} className="batch-item">
              <p><strong>Batch ID:</strong> {batch.productID}</p>
              <p><strong>Description:</strong> {batch.description}</p>
              <p><strong>Status:</strong> {batch.status}</p>
              <button onClick={() => handleBuyProduct(batch.productID)} className="buy-button">Buy</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="batches-section">
        <h3>Batches Bought</h3>
        <ul className="batch-list">
          {batchesBought.map((batch, index) => (
            <li key={index} className="batch-item">
              <p><strong>Batch ID:</strong> {batch.productID}</p>
              <p><strong>Description:</strong> {batch.description}</p>
              <p><strong>Status:</strong> {batch.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RetailPage;
