import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './pages/Navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import HomePage from './pages/HomePage';
import AdminKey from './pages/AdminLogin';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminKey />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
