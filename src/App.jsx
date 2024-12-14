// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Components/LoginView/LoginView';
import DashBoard from './Components/Dashboard/DashBoardView';
import TransactionView from './Components/Transaction/TransactionView';
import SignUpView from './Components/SignUp/SignUpView';
import authService from './Services/AuthService';
import ReceiveView from './Components/ReceiveFunds/ReceiveView';
import SendFundsView from './Components/SendFunds/SendFundsView';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    authService.verfiyAuth().then((response) => {
      if (!response.success) {
        navigate('/login');
      } else {
        navigate('/dashboard');
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
        <Route path="/receiveFunds" element={<ReceiveView />} />
        <Route path="/sendFunds" element={<SendFundsView />} />
      </Routes>
    </div>
  );
}

export default App;
