import React, {useState} from 'react'
import './login.css'

export default function LoginView() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className="login-container">
            {/* Left side - Login form */}
            <div className="login-form-container">
                <div className="login-form-wrapper">
                    <h1 className="login-title">Welcome to CaribePay</h1>
                    <p className="login-subtitle">Manage your finances with confidence</p>
                    
                    <form className="login-form">
                        <div className="form-group">
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="email"
                                className="form-input"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className="form-input"
                            />
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" className="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-button">
                            Sign In
                        </button>

                        <p className="signup-prompt">
                            Don't have an account?{' '}
                            <a href="#" className="signup-link">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="login-image-container">
                <div className="image-overlay"></div>
                <img
                    src="https://wearecollins.imgix.net/uploads/RH_COLLINS_Web_03.gif?auto=format%2Ccompress&dpr=2.63&fit=max&q=90&w=400"
                    alt="Login"
                    className="login-image"
                />
            </div>
        </div>
    )
}