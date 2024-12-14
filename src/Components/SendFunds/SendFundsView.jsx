import React, { useState } from 'react';
import { FiSearch, FiCamera, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './SendFund.css';

const SendFundsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleCamera = () => {
    console.log('Camera clicked');
  }

  return (
    <div className="send-funds-container">
      <button className="back-button" onClick={handleBack}>
        <span className="back-arrow">←</span>
        Back to Dashboard
      </button>
      
      <h1 className="send-funds-title">Send Funds</h1>
      
      <div className="search-container">
        <div className="search-wrapper">
          
          <input 
            type="text"
            placeholder="Search username or paste address"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleCamera} className="scan-button">
            <FiCamera className="camera-icon" />
          </button>
        </div>
      </div>

      {!searchQuery && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiUsers />
          </div>
          <h3 className="empty-state-title">Search for users</h3>
          <p className="empty-state-description">
            Enter a username or paste an address to start sending funds
          </p>
        </div>
      )}
    </div>
  );
};

export default SendFundsView;
