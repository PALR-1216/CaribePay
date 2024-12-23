import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { useNavigate } from 'react-router-dom';
import walletService from '../../Services/WalletService';
import authService from '../../Services/AuthService';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function DashBoardView() {
    const [balance, setBalance] = useState(null);
    const navigate = useNavigate();
    const videoPath = "https://rdpodrjwlivqzafd.public.blob.vercel-storage.com/waves-i0zcrOAzQB7I8ULRxdj8huxa1N1HJE.mp4";

    useEffect(() => {
        getUserBalance();
    }, []);
    
    const handleLogout = () => {
        // Add any logout logic here (e.g., clearing tokens/state)
        navigate('/login');
    };

    // Sample transactions data
    const transactions = [
        {
            wallet: '0xABC123',
            name: 'John Smith',
            amount: 150,
            date: '2023-10-01',
            type: 'Received from',
            icon: '↓'
        },
        {
            wallet: '0xDEF456',
            name: 'Maria Garcia',
            amount: -200,
            date: '2023-10-02',
            type: 'Sent to',
            icon: '↑'
        },
        {
            wallet: '0xGHI789',
            name: 'Alex Johnson',
            amount: 50,
            date: '2023-10-03',
            type: 'Received from',
            icon: '↓'
        },
        {
            wallet: '0xJKL012',
            name: 'Sarah Wilson',
            amount: -300,
            date: '2023-10-04',
            type: 'Sent to',
            icon: '↑'
        },
    ];

    const getUserBalance = async () => {
        await walletService.getBalance().then((response) => {
            if (response) {
                setBalance(response);
            } else {
                console.error('Error getting balance');
            }
        });
    }
    

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <h1 className="app-name">CaribePay</h1>
                <div className="header-buttons">
                    <button onClick={ () => navigate('/deposit')} className="deposit-button">+ Deposit</button>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="balance-section">
                <img 
                    src={videoPath} 
                    alt="" 
                    className="balance-background"
                />
                <div className="balance-content">
                    <div className="balance-label">Available Balance</div>
                    <div className="total-balance">
                        {balance ? (
                            <div className="balance-amount">
                                <span className="currency-symbol">$</span>
                                <span className="balance-value">
                                    {Number(balance).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                            </div>
                        ) : (
                            "Loading..."
                        )}
                    </div>
                </div>
            </div>

                        <div className="action-buttons-container">
                            <button className="action-button send" onClick={() => navigate('/sendFunds')}>
                                <div className="action-icon-wrapper">
                                    <svg viewBox="0 0 24 24" className="action-icon">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </div>
                                <div className="action-content">
                                    <span className="action-text">Send Money</span>
                                    <span className="action-subtext">Transfer funds instantly</span>
                                </div>
                            </button>
                            <button className="action-button receive" onClick={() => navigate('/receiveFunds')}>
                                <div className="action-icon-wrapper">
                                    <svg viewBox="0 0 24 24" className="action-icon">
                                        <path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"/>
                                    </svg>
                                </div>
                                <div  className="action-content">
                                    <span className="action-text">Receive</span>
                                    <span className="action-subtext">Get paid securely</span>
                                </div>
                            </button>
                        </div>

                        {/* Recent Transactions */}
            <div className="transactions-section">
                <h2>
                    Recent Activity
                    <span onClick={() => navigate('/transactions')} style={{ color: '#1652F0', cursor: 'pointer', fontSize: '0.9rem' }}>
                        View All
                    </span>
                </h2>
                <ul className="transactions-list">
                    {transactions.map((tx, index) => (
                        <li key={index}>
                            <div className={`transaction-icon ${tx.amount > 0 ? 'received' : 'sent'}`}>
                                {tx.icon}
                            </div>
                            <div className="transaction-details">
                                <span className="wallet">
                                    <span className="transaction-type" style={{
                                        color: tx.amount > 0 ? '#00C087' : '#FF3B30'
                                    }}>
                                        {tx.type}
                                    </span> {tx.name}
                                </span>
                                <span className="wallet-address">{tx.wallet}</span>
                            </div>
                            <div className="transaction-right">
                                <span className="amount" style={{
                                    color: tx.amount > 0 ? '#00C087' : '#FF3B30'
                                }}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} USD
                                </span>
                                <div className="date">
                                    {new Date(tx.date).toLocaleDateString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}



