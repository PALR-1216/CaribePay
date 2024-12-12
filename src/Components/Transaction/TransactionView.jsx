import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Transaction.css';

export default function TransactionView() {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Updated mock transaction data
    const transactions = [
        {
            id: 1,
            type: 'send',
            amount: 250.00,
            address: '0x1234...5678',
            userName: 'John Smith',
            timestamp: '2024-01-20T10:30:00',
            status: 'completed'
        },
        {
            id: 2,
            type: 'receive',
            amount: 1000.00,
            address: '0x8765...4321',
            userName: 'Sarah Wilson',
            timestamp: '2024-01-20T08:15:00',
            status: 'completed'
        },
        // ... more transactions
    ];

    const filterTransactions = (type) => {
        setFilterType(type);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            return;
        }
        navigate('/login', { replace: true });
    };

    const goToHome = () => {
        navigate('/dashboard', { replace: true });
    }

    return (
        <div className="transaction-container">
            <nav className="dashboard-nav">
                <h1 className="logo">CaribePay</h1>
                <div className="nav-actions">
                <button onClick={goToHome} className="action-btn">Home</button>
                    <button className="action-btn">Deposit</button>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="transaction-content">
                <header className="transaction-header">
                    <h1>Transaction History</h1>
                    <div className="header-actions">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="search-icon">🔍</i>
                        </div>
                    </div>
                </header>

                <div className="filter-section">
                    <button 
                        className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => filterTransactions('all')}
                    >
                        All Transactions
                    </button>
                    <button 
                        className={`filter-btn ${filterType === 'send' ? 'active' : ''}`}
                        onClick={() => filterTransactions('send')}
                    >
                        Sent
                    </button>
                    <button 
                        className={`filter-btn ${filterType === 'receive' ? 'active' : ''}`}
                        onClick={() => filterTransactions('receive')}
                    >
                        Received
                    </button>
                </div>

                <div className="transactions-container">
                    {transactions.map(tx => (
                        <div key={tx.id} className="transaction-card">
                            <div className={`tx-icon ${tx.type}`}>
                                {tx.type === 'send' ? '↑' : '↓'}
                            </div>
                            <div className="tx-details">
                                <div className="tx-main-info">
                                    <div className="tx-left">
                                        <span className="tx-type">
                                            {tx.type === 'send' ? 
                                                `Sent to ${tx.userName}` : 
                                                `Received from ${tx.userName}`}
                                        </span>
                                        <span className="tx-address">{tx.address}</span>
                                    </div>
                                    <div className="tx-right">
                                        <span className={`tx-amount ${tx.type === 'send' ? 'negative' : 'positive'}`}>
                                            {tx.type === 'send' ? '-' : '+'}${tx.amount.toFixed(2)}
                                        </span>
                                        <span className="tx-timestamp">
                                            {new Date(tx.timestamp).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
