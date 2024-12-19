import React, { useState, useCallback } from 'react';
import { FiSearch, FiCamera, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './SendFund.css';
import authService from '../../Services/AuthService';
import Webcam from "react-webcam";

const SendFundsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleCamera = () => {
    console.log('Camera clicked');
    const videoConstraints = {
      facingMode: { exact: "user" }
    };
    
  };

  const handleUserSelect = (user) => {
    // Navigate to transfer page with selected user
    navigate(`/transfer/${user.user_id}`);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getResults = useCallback(async(query) => {
    try {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      await authService.findUserByUserName(query).then((response) => {
        if (response.success) {
          setSearchResults(response.users);
        } else {
          console.error(response.message);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const timeoutId = setTimeout(() => getResults(value), 300);
    return () => clearTimeout(timeoutId);
  }, [getResults]);

  return (
    <div className="send-funds-view">
      <button className="back-button" onClick={handleBack}>
        <span className="arrow-icon">←</span>
        <span className="back-text">Go back</span>
      </button>
      
      <div className="search-section">
        <input 
          type="search"
          placeholder="Search username"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          autoComplete="off"
          autoCapitalize="off"
        />
        <button className="scan-button" onClick={handleCamera}>
          <FiCamera />
        </button>
      </div>

      {isLoading && (
        <div className="search-results">
          <div className="loading-spinner"></div>
        </div>
      )}

      {searchQuery && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="user-item"
              onClick={() => handleUserSelect(user)}
            >
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-handle">@{user.userName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isLoading && (
        <div className="no-results">
          <FiUsers className="no-results-icon" />
          <p>No users found</p>
        </div>
      )}
    </div>
  );
};

export default SendFundsView;
