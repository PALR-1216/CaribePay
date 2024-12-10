// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/LoginView';

function App() {
  return (
    <div>
      {/* Navigation component will go here */}
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </div>
  );
}

export default App;
