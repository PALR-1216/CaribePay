import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TransferFunds.css';
import authService from '../../Services/AuthService';

const TransferFunds = ({currentBalance}) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formattedAmount, setFormattedAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const TRANSFER_LIMIT = 1000; // $1,000 limit

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await authService.getSelectedUser(userId);
                if (response.success) {
                    setSelectedUser(response.user);
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserDetails();
    }, [userId]);

    const formatAmount = (value) => {
        if (!value) return '$0';
        return `$${Number(value).toLocaleString('en-US')}`;
    };

    const formatBalance = (value) => {
        return `$${Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatNumberWithCommas = (value) => {
        // Remove existing commas and split on decimal point
        const parts = value.replace(/,/g, '').split('.');
        
        // Add commas to the whole number part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Rejoin with decimal part if it exists
        return parts.join('.');
    };

    const validateAmount = (rawValue) => {
        const numValue = parseFloat(rawValue);
        if (!rawValue || isNaN(numValue)) {
            setErrorMessage('');
            return;
        }
        if (numValue <= 0) {
            setErrorMessage('Please enter a valid amount');
            return false;
        }
        if (numValue > TRANSFER_LIMIT) {
            setErrorMessage(`Cannot exceed maximum transfer limit of ${formatBalance(TRANSFER_LIMIT)}`);
            return false;
        }
        if (numValue > currentBalance) {
            setErrorMessage(`Insufficient funds. Available balance: ${formatBalance(currentBalance)}`);
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const numValue = parseFloat(rawValue);
        
        // Only allow input if it's empty, a valid number format, and under the limit
        if (rawValue === '' || 
            (/^\d*\.?\d{0,2}$/.test(rawValue) && 
            (isNaN(numValue) || numValue <= TRANSFER_LIMIT))) {
            setAmount(rawValue);
            setFormattedAmount(formatNumberWithCommas(rawValue));
            validateAmount(rawValue);
        }
    };

    const handleSend = async () => {
        try {
            setIsLoading(true);
            // Implement send logic here
            console.log('Sending', amount, 'USDC to', selectedUser.userName);
            // Add actual transfer logic
        } catch (error) {
            console.error('Transfer failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transfer-ui-container">
            <div className="navigation" onClick={() => navigate(-1)}>
                <span className="navigation-icon">←</span>
                <span className="navigation-text">Back to Contacts</span>
            </div>
    
            {selectedUser && (
                <>
                    <div className="user-details">
                        <div className="user-avatar">
                            {selectedUser.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{selectedUser.name}</div>
                            <div className="user-username">{selectedUser.userName}</div>
                        </div>
                    </div>
    
                    <div className="balance-section">
                        <img 
                            src="https://rdpodrjwlivqzafd.public.blob.vercel-storage.com/waves2-iShUfYVgk42g7JOpET0TxeyUowlDn0.mp4"
                            alt="Balance background"
                            className="balance-background"
                        />
                        <div className="balance-content">
                            <div className="balance-main">
                                <div className="balance-left">
                                    <div className="balance-label">Available Balance</div>
                                    <div className="balance-amount">{formatBalance(currentBalance)}</div>
                                </div>
                                <div className="balance-right">
                                    <div className="balance-badges">
                                        <div className="balance-badge free">
                                            <i>✓</i> No Fees
                                        </div>
                                        <div className="balance-badge instant">
                                            <i>⚡</i> Instant
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="amount-section">
                        <div className="amount-input-wrapper">
                            <span className="currency-prefix">$</span>
                            <input
                                type="text"
                                value={formattedAmount}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className="amount-input"
                            />
                            <span className="currency">USD</span>
                        </div>
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                        <div className="limit-info">
                            Maximum transfer: {formatBalance(TRANSFER_LIMIT)}
                        </div>
                    </div>
    
                    <div className="message-section" data-length={`${message.length}/100`}>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a message (optional)"
                            className="message-input"
                            maxLength={100}
                        />
                    </div>
    
                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > TRANSFER_LIMIT || parseFloat(amount) > currentBalance || isLoading}
                    >
                        {isLoading ? 'Processing...' : `Send ${formatAmount(amount || '0')}`}
                    </button>
                </>
            )}
        </div>
    );
    
};

export default TransferFunds;
