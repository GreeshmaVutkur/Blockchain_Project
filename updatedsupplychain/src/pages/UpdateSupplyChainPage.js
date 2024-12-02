// src/pages/UpdateSupplyChainPage.js
import React, { useState, useEffect } from 'react';
import LogoutButton from '../pages/LogoutButton';
import { ethers } from 'ethers';
import '../App.css';

function UpdateSupplyChainPage() {
  const [productId, setProductId] = useState('');
  const [productState, setProductState] = useState('inventory');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const contractAddress ="0x16F89741EdB5FADE0d502256f4D32F67E01aa74B";
  
  const abi=[
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





  useEffect(() => {
    const connectWallet = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', [2]);
            const signer = provider.getSigner();
            console.log(signer);
            setProvider(provider);
            setSigner(signer);

            const accountAddress = await signer.getAddress();
            setAccount(accountAddress);

            console.log(accountAddress);

            const contract = new ethers.Contract(contractAddress, abi, signer);
            setContract(contract);

            alert("Metamask connected");
           
        } catch (error) {
            console.error("Error connecting to wallet: ", error);
        }
    };
    connectWallet();
  }, []);

  const updateSupplyChain = async () => {
    if (!productId) {
      alert("Please enter a Product ID");
      return;
    }
    
    try {
      const productIDInt = parseInt(productId); // Convert productId to integer
      const tx = await contract.updateProductStatus(productIDInt, productState);
      await tx.wait(); // Wait for the transaction to be mined

      alert(`Product ID: ${productId} updated to ${productState}`);
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Error updating product status. Please ensure the Product ID is correct and that you are authorized.");
    }
  };

  return (
    <div className="page-container">
      <h2>Update Supply Chain</h2>
      <input
        type="text"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <select value={productState} onChange={(e) => setProductState(e.target.value)}>
        <option value="inventory">Inventory</option>
        <option value="manufacturing">Manufacturing</option>
        <option value="packing">Packing</option>
        <option value="storage">Storage</option>
        <option value="shipped">Shipped</option>
      </select>
      <button onClick={updateSupplyChain}>Update</button>
      <LogoutButton className="logout-button" />
    </div>
  );
}

export default UpdateSupplyChainPage;
