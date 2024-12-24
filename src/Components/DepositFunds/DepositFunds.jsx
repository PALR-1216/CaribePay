import React from 'react';
import './DepositFunds.css';

const DepositFunds = () => {
    const handleAddBank = () => {
        // Add bank functionality can be implemented here
        console.log('Add bank clicked');
    };

    return (
        <div className="deposit-funds-container">
            <h2>Deposit Funds</h2>
            <div className="deposit-content">
                <p>Link your bank account to start making deposits</p>
                <button 
                    className="add-bank-button"
                    onClick={handleAddBank}
                >
                    Add Bank
                </button>
            </div>
        </div>
    );
};

export default DepositFunds;