// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './Components/LoginView/LoginView';
import DashBoard from './Components/Dashboard/DashBoardView';
import TransactionView from './Components/Transaction/TransactionView';
import SignUpView from './Components/SignUp/SignUpView';
import authService from './Services/AuthService';
import ReceiveView from './Components/ReceiveFunds/ReceiveView';
import SendFundsView from './Components/SendFunds/SendFundsView';
import TransferFunds from './Components/Transfer/TransferFunds';
import walletService from './Services/WalletService';
import DepositFunds from './Components/DepositFunds/DepositFunds';
import { supabase } from './config/supabaseConfig' // Add this import if not already present

function App() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const handleAuth = async () => {
      const response = await authService.verfiyAuth();
      if (!response.success) {
        navigate('/login');
        return;
      }
      
      const balance = await walletService.getBalance();
      setBalance(balance);
    };

    handleAuth();

    // Use Supabase auth subscription directly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/dashboard" element={<DashBoard/>} />
        <Route path="/transactions" element={<TransactionView />} />
        <Route path="/signUp" element={<SignUpView />} />
        <Route path="/receiveFunds" element={<ReceiveView />} />
        <Route path="/sendFunds" element={<SendFundsView />} />
        <Route path="/transfer/:userId" element={<TransferFunds currentBalance={balance} />} />
        <Route path='/deposit' element={<DepositFunds />} />
      </Routes>
    </div>
  );
}

export default App;
