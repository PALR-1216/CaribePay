import React, { useState } from 'react';
import './SignUp.css';
import authService from '../../Services/AuthService';

export default function SignUpView() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    dateOfBirth: ''
  });

  const [isValid, setIsValid] = useState({
    email: false,
    username: false,
    dateOfBirth: false,
    password: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const emailError = await validateEmail(formData.email);
    const usernameError = await validateUsername(formData.username);
    const dateError = validateDateOfBirth(formData.dateOfBirth);
    
    if (!emailError && !usernameError && !dateError && formData.password.length >= 8) {
      // Proceed with form submission
      try {
        await authService.signUp(formData);
        // Handle successful signup
      } catch (error) {
        console.error('Signup error:', error);
      }
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
      if (username.length < 3) {
        setIsValid(prev => ({ ...prev, username: false }));
        return "Username must be at least 3 characters";
      }
      
      const response = await authService.validateUsername(username.trim());
      const isUsernameValid = response.success; // Adjust based on your API response
      setIsValid(prev => ({ ...prev, username: isUsernameValid }));
      return isUsernameValid ? "" : "Username already taken";
    } catch (error) {
      setIsValid(prev => ({ ...prev, username: false }));
      return "Error validating username";
    }
  };

  const validateDateOfBirth = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (birthDate > today) {
      return "Date of birth cannot be in the future";
    }
    
    if (age < 18 || (age === 18 && monthDiff < 0)) {
      return "You must be at least 18 years old";
    }
    
    return "";
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
    } else if (name === 'dateOfBirth') {
      error = validateDateOfBirth(value);
      setIsValid(prev => ({ ...prev, dateOfBirth: !error }));
    } else if (name === 'password') {
      setIsValid(prev => ({ ...prev, password: value.length >= 8 }));
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isFormValid = () => {
    return isValid.email && isValid.username && isValid.dateOfBirth && 
           isValid.password && !errors.email && !errors.username && !errors.dateOfBirth;
  };

  return (
    <div className="signup-container">
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

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleChange}
                required
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
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

          <button 
            type="submit" 
            disabled={!isFormValid()}
            className={!isFormValid() ? "button-disabled" : ""}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}