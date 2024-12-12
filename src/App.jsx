// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/LoginView/LoginView';
import DashBoard from './Components/Dashboard/DashBoardView';
import TransactionView from './Components/Transaction/TransactionView';
import SignUpView from './Components/SignUp/SignUpView';

function App() {
  return (
    <div>
      {/* Navigation component will go here */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/transactions" element={<TransactionView />} />
        <Route path="/signUp" element={<SignUpView />} />
      </Routes>
    </div>
  );
}

export default App;
