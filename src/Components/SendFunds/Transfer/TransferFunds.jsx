import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TransferFunds.css';
import authService from '../../../Services/AuthService';


const TransferFunds = () => {
    const { userId } = useParams();
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Fetch user details using userId
        const fetchUserDetails = async () => {
            await authService.getUser(userId).then((response) => {
                if (response.success) {
                    console.log('User details:', response.user);
                    setSelectedUser(response.user);
                } else {
                    console.error(response.message);
                }
            });
            
        };

        fetchUserDetails();
    }, [userId]);

    const handleSend = () => {
        // Implement send logic here
        console.log('Sending', amount, 'USDC to', selectedUser.userName);
    };

    return (
        <div className="send-funds-container">
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
                        <p className="balance-label">Your Balance</p>
                        <h3 className="balance-amount">0 USDC</h3>
                    </div>

                    <div className="amount-section">
                        <div className="amount-input-wrapper">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="amount-input"
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
                        />
                    </div>

                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!amount || parseFloat(amount) <= 0}
                    >
                        Send USDC
                    </button>
                </>
            )}
        </div>
    );
};

export default TransferFunds;
