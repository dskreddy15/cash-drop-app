import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage.js';
import RegisterPage from './Pages/RegisterPage.js';
import CashDrop from './Pages/CashDrop.js';
import Homepage from './Pages/HomePage.js';
import Header from './Pages/Header.js';
import CdDashboard from './Pages/CdDashboard.js';
import Dashboard from './Pages/Dashboard.js';

function App() {
  return (
   <>
    <Header />
   <Routes>
    <Route path="/" element={<Homepage />} /> 
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/cash-drop" element={<CashDrop />} /> 
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/cd-dashboard" element={<CdDashboard />} />
   </Routes>
   </>
  );
}

export default App;
