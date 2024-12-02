// src/pages/AddProductPage.js
import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import '../App.css';

function AddProductPage() {
    //added from other
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

  const [productID, setProductID] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
   
  // added from other
     const [providerAddress, setProviderAddress] = useState("");
    const contractAddress = "0x16F89741EdB5FADE0d502256f4D32F67E01aa74B";

  const abi= [
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

            const contract = new ethers.Contract(contractAddress,abi, signer);
            setContract(contract);

            const ownerAddress = await contract.getOwner();
           

        } catch (error) {
            console.error("Error connecting to wallet: ", error);
        }

    };
    connectWallet();

}, []);

  const handleAddProduct = () => {

    


    if (productID && description) {
        //connecting to metamask 

    
    
      // Add the logic to handle adding the product here.
      // For example, you could call a function to interact with the blockchain.

      // calling contract to add products

      try {
        console.log(contract)
        const tx =  contract.addProduct(productID,description);
        alert(`Metamask Connected \n Product Added:\nID: ${productID}\nDescription: ${description}`);
        

    } catch(error) {
        console.error("Error adding records", error);
    }
      
      // Reset fields after adding the product
      setProductID('');
      setDescription('');

    } else {
      alert('Please fill in both fields');
    }
    
  };

  // Function to navigate back to the Main Actions page
  const handleBack = () => {
    navigate('/main-actions');
  };

  return (
    <div className="page-container">
       
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={productID}
        onChange={(e) => setProductID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAddProduct}>Add Product</button>
      <button onClick={handleBack} style={{ marginTop: '10px' }}>Back</button> {/* Back Button */}
    </div>
  );
}

export default AddProductPage;
