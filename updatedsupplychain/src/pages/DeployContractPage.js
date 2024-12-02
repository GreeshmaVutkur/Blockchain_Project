// src/pages/DeployContractPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function DeployContractPage() {
  const navigate = useNavigate();

  const deployContract = () => {
    alert('Contract deployed!');
    navigate('/main-actions');
  };

  return (
    <div className="page-container">
      <h2>Deploy Contract</h2>
      <button onClick={deployContract}>Deploy Contract</button>
    </div>
  );
}

export default DeployContractPage;
