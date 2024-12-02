// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddProductPage from './pages/AddProductPage'; // New AddProductPage
import MainActionsPage from './pages/MainActionsPage';
import FetchProductDetailsPage from './pages/FetchProductDetailsPage';
import UpdateSupplyChainPage from './pages/UpdateSupplyChainPage';
import RetailPage from './pages/Retail';
import TransportPage from './pages/Transport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/add-product" element={<AddProductPage />} /> {/* Add Product page */}
        <Route path="/main-actions" element={<MainActionsPage />} />
        <Route path="/fetch-product-details" element={<FetchProductDetailsPage />} />
        <Route path="/update-supply-chain" element={<UpdateSupplyChainPage />} />
        <Route path="/retail" element={<RetailPage />} />
        <Route path="/transport" element={<TransportPage />} />
      </Routes>
    </Router>
  );
}

export default App;

