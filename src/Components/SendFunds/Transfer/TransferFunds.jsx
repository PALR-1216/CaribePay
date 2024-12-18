import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TransferFunds.css';
import authService from '../../../Services/AuthService';

const TransferFunds = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    // if (isLoading && !selectedUser) {
    //     return (
    //         <div className="send-funds-container">
    //             <div className="loading-spinner">Loading...</div>
    //         </div>
    //     );
    // }

    return (
        <div className="send-funds-container">
            <div className="back-navigation" onClick={() => navigate(-1)}>
                <span className="back-arrow">←</span>
                <span className="back-text">Return to Contacts</span>
            </div>
            {selectedUser && (
                <>
                    <div className="user-details">
                        <div className="user-avatar">
                            {selectedUser.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h2>{selectedUser.name}</h2>
                            <p className="username">@{selectedUser.userName}</p>
                        </div>
                    </div>

                    <div className="balance-section">
                        <p className="balance-label">Available Balance</p>
                        <h3 className="balance-amount">1,234.56 USDC</h3>
                    </div>

                    <div className="amount-section">
                        <div className="amount-input-wrapper">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="amount-input"
                                step="0.01"
                                min="0"
                            />
                            <span className="currency">USDC</span>
                        </div>
                    </div>

                    <div className="message-section">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a message (optional)"
                            className="message-input"
                            maxLength={200}
                        />
                    </div>

                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                    >
                        {isLoading ? 'Processing...' : `Send ${amount || '0'} USDC`}
                    </button>
                </>
            )}
        </div>
    );
};

export default TransferFunds;
