// src/pages/MainActionsPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function MainActionsPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h2>Main Actions</h2>
      <button onClick={() => navigate('/add-product')}>Add Product</button> {/* New button to add product */}
      <button onClick={() => navigate('/fetch-product-details')}>Fetch Product Details</button>
      <button onClick={() => navigate('/update-supply-chain')}>Update Supply Chain</button>
      <button onClick={() => navigate('/retail')}>Retail Page </button>
      <button onClick={() => navigate('/transport')}>Transport page</button>
    </div>
  );
}

export default MainActionsPage;
