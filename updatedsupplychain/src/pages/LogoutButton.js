// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default LogoutButton;
