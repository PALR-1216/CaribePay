import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import authService from '../../Services/AuthService';

export default function LoginView() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const data = await authService.login(email.trim(), password.trim());
            if (data.success) {
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-form-wrapper">
                    <img src="https://static-00.iconduck.com/assets.00/robinhood-icon-2048x2048-n1lkvl1s.png" alt="CaribePay" className="login-logo" />
                    <h1 className="login-title">Welcome Back</h1>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="input-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <button type="submit" className="login-button">
                                Sign In
                            </button>
                        </div>

                        <p className="signup-prompt">
                            Don't have an account?{' '}
                            <a href="#" onClick={() => navigate('/signup')} className="signup-link">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>

            <div className="login-image-container">
                <img
                    src="https://media.wired.com/photos/5db37ea4dc63930009ef0036/master/pass/Business-Blockchain-Fatigue.jpg"
                    alt="Login"
                    className="login-image"
                />
            </div>
        </div>
    );
}
