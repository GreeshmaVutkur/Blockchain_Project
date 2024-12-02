// src/pages/FetchProductDetailsPage.js
import React, { useState , useEffect} from 'react';
import LogoutButton from '../pages/LogoutButton';
import { ethers } from 'ethers';
import '../App.css';

function FetchProductDetailsPage() {
  const [productId, setProductId] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
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
            alert("metamask connected");
           

        } catch (error) {
            console.error("Error connecting to wallet: ", error);
        }

    };
    connectWallet();

}, []);
const formatTimestamp = (status) => {
    return status.replace(/(\d{10})/g, (match) => {
      const date = new Date(parseInt(match) * 1000);
      return date.toLocaleString(); // Formats to a readable date and time
    });
  };

  const fetchDetails = async() => {
    try {
        const productIDInt = parseInt(productId);

        console.log(productIDInt) // Convert productId to integer
        const product = await contract.fetchProduct(productIDInt);
  
        // Display product details
        const fetchedProduct = {
          id: product[0].toString(),
          description: product[1],
          status: formatTimestamp(product[2])
        };
  
        setProductDetails(fetchedProduct); // Store product details in state
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Error fetching product details. Please ensure the Product ID is correct.");
      }
  };

  const formatStatus = (status) => {
    if (!status) return [];
  
  return status.split(" -> ").map((entry) => {
    const [statusText, timestamp] = entry.split(" - ");
    return { status: statusText, date: timestamp };
    });
  };

  return (
    <div className="page-container">
    <h2>Fetch Product Details</h2>
    <input
      type="text"
      placeholder="Enter Product ID"
      value={productId}
      onChange={(e) => setProductId(e.target.value)}
    />
    <button onClick={fetchDetails}>Fetch Details</button>

    {productDetails && (
  <div className="product-details-section">
    <h3 className="product-details-title">Product Details</h3>
    <p className="product-info"><strong>ID:</strong> {productDetails.id}</p>
    <p className="product-info"><strong>Description:</strong> {productDetails.description}</p>
    <h4 className="status-updates-title">Status Updates:</h4>
    <table className="status-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {formatStatus(productDetails.status).map((update, index) => (
          <tr key={index}>
            <td>{update.status}</td>
            <td>{update.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


    <LogoutButton />
  </div>
    
  );
}

export default FetchProductDetailsPage;
