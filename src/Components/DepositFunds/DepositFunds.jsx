import React, { useState } from 'react';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './DepositFunds.css';

const DepositFunds = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="deposit-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="form-container">
        <div className="form-header">
          <h1>Link Bank Account</h1>
          <p className="security-note">
            <FiLock /> Your information is encrypted and secure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bank-form">
          <div className="form-group">
            <label htmlFor="accountName">Account Holder Name</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Enter account holder name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="routingNumber">Routing Number</label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
              placeholder="Enter 9-digit routing number"
              pattern="[0-9]{9}"
              maxLength="9"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Link Bank Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositFunds;

