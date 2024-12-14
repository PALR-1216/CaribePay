import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './Receive.css';
import authService from '../../Services/AuthService';
import { useNavigate } from 'react-router-dom';
// Add logo import
let logo = 'https://static-00.iconduck.com/assets.00/robinhood-icon-2048x2048-n1lkvl1s.png';

const ReceiveView = ({ walletAddress = '0x1234...abcd' }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [username, setUsername] = useState('CaribePay User');

    useEffect(() => {
        verifyAuth();
        getUserName();
    }, []);

    async function getUserName() {
        await authService.getUser().then((response) => {
            if (response.success) {
                setUsername(response.user.userName);
            }
        });
    }

    async function verifyAuth() {
        await authService.verfiyAuth().then((response) => {
            if (!response.success) {
                navigate('/login');
            }
        });
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="receive-container">
            <button className="back-button" onClick={handleBack}>
                <span className="back-arrow">←</span>
                Back to Dashboard
            </button>

            <div className="receive-header">
                <h2>Receive Payments</h2>
                <p>Share your address or let others scan your code</p>
            </div>

            <div className="username-display">
                <div className="profile-icon">
                    <img src={logo} alt="Profile" className="profile-logo" />
                </div>
                <div className="username-content">
                    <div className="username-label">Username</div>
                    <div className="username-text">
                        <span className="handler-symbol">@</span>
                        {username.toLowerCase().replace(/\s+/g, '_')}
                    </div>
                    <div className="account-type">
                        <span className="account-icon">👤</span>
                        Personal Account
                    </div>
                </div>
            </div>

            <div className="qr-section">
                <div className="qr-wrapper">
                    <QRCodeSVG
                        value={walletAddress}
                        size={250}
                        level="H"
                        className="qr-code"
                        bgColor="#FFFFFF"
                        fgColor="#0A0B0D"
                    />
                    <div className="qr-overlay">
                        <img src={logo} alt="Logo" className="qr-logo" />
                    </div>
                </div>
                <p className="scan-text">Scan to pay</p>
            </div>

            <div className="address-section">
                <div className="address-label">Your Wallet Address</div>
                <div className="address-content">
                    <span>{walletAddress}</span>
                    <button 
                        className="copy-button"
                        onClick={handleCopy}
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="info-section">
                <div className="info-item">
                    <span className="info-icon">⚡</span>
                    <span>Instant transfer</span>
                </div>
                <div className="info-item">
                    <span className="info-icon">🔒</span>
                    <span>Secure payment</span>
                </div>
                <div className="info-item">
                    <span className="info-icon">💰</span>
                    <span>No fees</span>
                </div>
            </div>
        </div>
    );
};

export default ReceiveView;
