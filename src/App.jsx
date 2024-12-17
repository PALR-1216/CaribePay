// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Components/LoginView/LoginView';
import DashBoard from './Components/Dashboard/DashBoardView';
import TransactionView from './Components/Transaction/TransactionView';
import SignUpView from './Components/SignUp/SignUpView';
import authService from './Services/AuthService';
import ReceiveView from './Components/ReceiveFunds/ReceiveView';
import SendFundsView from './Components/SendFunds/SendFundsView';
import TransferFunds from './Components/SendFunds/Transfer/transferFunds';


function App() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Fetch balance from your wallet or API
    const fetchBalance = async () => {
      // Add your balance fetching logic here
      // For example: const balance = await walletService.getBalance();
      // setBalance(balance);
    };

    fetchBalance();
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
        <Route path="/transfer/:userId" element={<TransferFunds />} />
      </Routes>
    </div>
  );
}

export default App;
