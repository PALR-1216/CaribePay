import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignUp.css'
import authService from '../../Services/AuthService'

export default function SignUpView() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [passwordStrength, setPasswordStrength] = useState('')

    const goToLogin = () => {
        navigate('/login', { replace: true })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        if (name === 'password') {
            evaluatePasswordStrength(value)
        }
    }

    const evaluatePasswordStrength = (password) => {
        let strength = ''
        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[@$!%*?&#]/.test(password)) {
                strength = 'Strong'
            } else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
                strength = 'Medium'
            } else {
                strength = 'Weak'
            }
        } else {
            strength = 'Too Short'
        }
        setPasswordStrength(strength)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (passwordStrength === 'Too Short' || passwordStrength === 'Weak') {
            setError('Password is not strong enough')
            return
        }

        try {
            const data = await authService.register(formData)
            if (data.success) {
                navigate('/dashboard')
            } else {
                setError(data.message || 'Registration failed')
            }
        } catch (err) {
            setError('Error creating account')
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <div className="signup-form-wrapper">
                    <img 
                        src="https://companieslogo.com/img/orig/HOOD-3f9aec90.png?t=1720244492" 
                        alt="CaribePay Logo" 
                        className="signup-logo" 
                    />
                    <h1 className="signup-title">Create Your Account</h1>

                    <form className="signup-form" onSubmit={handleSubmit} noValidate>
                        <div className="form-row">
                            <div className="form-group half">
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="form-input"
                                        onChange={handleChange}
                                        value={formData.firstName}
                                        required
                                        aria-required="true"
                                    />
                                    <label htmlFor="firstName" className="floating-label">First Name</label>
                                </div>
                            </div>
                            <div className="form-group half">
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        className="form-input"
                                        onChange={handleChange}
                                        value={formData.lastName}
                                        required
                                        aria-required="true"
                                    />
                                    <label htmlFor="lastName" className="floating-label">Last Name</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.dateOfBirth}
                                    required
                                    aria-required="true"
                                />
                                <label htmlFor="dateOfBirth" className="floating-label">Date of Birth</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                    aria-required="true"
                                />
                                <label htmlFor="email" className="floating-label">Email</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.username}
                                    required
                                    aria-required="true"
                                />
                                <label htmlFor="username" className="floating-label">Username</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.password}
                                    required
                                    aria-required="true"
                                    aria-describedby="passwordHelp"
                                />
                                <label htmlFor="password" className="floating-label">Password</label>
                            </div>
                            {formData.password && (
                                <div id="passwordHelp" className={`password-strength ${passwordStrength.toLowerCase()}`}>
                                    Password Strength: {passwordStrength}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.confirmPassword}
                                    required
                                    aria-required="true"
                                />
                                <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
                            </div>
                        </div>

                        {error && <div className="error-message" role="alert">{error}</div>}

                        <div className="form-group">
                            <button type="submit" className="signup-button">
                                Create Account
                            </button>
                        </div>

                        <p className="login-prompt">
                            Already have an account?{' '}
                            <button type="button" onClick={goToLogin} className="login-link">
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>

            <div className="signup-image-container">
                <div className="image-overlay"></div>
                <img
                    src="https://bunteidee.de/wp-content/uploads/2023/07/BunteIdee-Services-left.jpg"
                    alt="Signup Illustration"
                    className="signup-image"
                />
            </div>
        </div>
    )
}
