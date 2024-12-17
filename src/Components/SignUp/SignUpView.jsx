import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import authService from '../../Services/AuthService';

export default function SignUpView() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    username: ''
  });

  const [isValid, setIsValid] = useState({
    email: false,
    username: false,
    password: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!isFormValid() || !formData.password.length >= 8) {
      console.log('Form validation failed');
      setErrors(prev => ({
        ...prev,
        general: 'Please fill in all required fields correctly.'
      }));
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting form data:', formData);

    try {
      const response = await authService.signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim()
      });

      console.log('Signup response:', response);

      if (response.success) {
        setErrors({});
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/login');
        }, 3000);
      } else {
        setErrors(prev => ({
          ...prev,
          general: response.message || 'Failed to create account. Please try again.'
        }));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'An unexpected error occurred. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = async (email) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsValid(prev => ({ ...prev, email: false }));
        return "Please enter a valid email address";
      }
      
      const response = await authService.validateEmail(email.trim());
      const isEmailValid = response.success; // Adjust based on your API response
      setIsValid(prev => ({ ...prev, email: isEmailValid }));
      return isEmailValid ? "" : "Email already exists";
    } catch (error) {
      setIsValid(prev => ({ ...prev, email: false }));
      return "Error validating email";
    }
  };

  const validateUsername = async (username) => {
    try {
      if (username.length < 5) {
        setIsValid(prev => ({ ...prev, username: false }));
        return "Username must be at least 5 characters";
      }

      const response = await authService.validateUsername(username);
      const isUsernameValid = response.success; // Adjust based on your API response
      setIsValid(prev => ({ ...prev, username: isUsernameValid }));
      return isUsernameValid ? "" : "Username already exists";
    } catch (error) {
      setIsValid(prev => ({ ...prev, username: false }));
      return "Error validating username";
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate fields on change
    let error = '';
    if (name === 'email') {
      error = await validateEmail(value);
    } else if (name === 'username') {
      error = await validateUsername(value);
    } else if (name === 'password') {
      setIsValid(prev => ({ ...prev, password: value.length >= 8 }));
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isFormValid = () => {
    return isValid.email && isValid.username && 
          isValid.password && !errors.email && !errors.username;
  };

  return (
    <div className="signup-container">
      {showPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <h3>Account Created Successfully!</h3>
            <p>Please log in to continue</p>
          </div>
        </div>
      )}
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Start your crypto journey today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              onChange={handleChange}
              required
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <button 
            type="submit" 
            disabled={!isFormValid() || isSubmitting}
            className={(!isFormValid() || isSubmitting) ? "button-disabled" : ""}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}