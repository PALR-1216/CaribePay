// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/LoginView/LoginView';
import DashBoard from './Components/Dashboard/DashBoardView';
import TransactionView from './Components/Transaction/TransactionView';
import SignUpView from './Components/SignUp/SignUpView';
import authService from './Services/AuthService';

function App() {
  const navigator = 
  useEffect(() => {
    authService.verfiyAuth().then((response) => {
      if (!response.success) {
        navigator.navigate('/login');
      } else {
        navigator.navigate('/dashboard');
      }
    });

  }, []);
  return (
    <div>
      {/* Navigation component will go here */}
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/transactions" element={<TransactionView />} />
        <Route path="/signUp" element={<SignUpView />} />
      </Routes>
    </div>
  );
}

export default App;
