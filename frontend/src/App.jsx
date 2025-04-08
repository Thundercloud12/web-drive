import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';


import Navbar from './pages/Navbar';
import Footer from './pages/Footer';


import Login from './pages/login';
import Signup from './pages/signup';
import AdminKey from './pages/AdminLogin';


import HomePage from './pages/HomePage';

import Dashboard from './pages/Dashboard';


import AdminDashboard from './pages/AdminDashboard';
import BookAdmin from './pages/BookAdmin';
import IssueAdmin from './pages/IsssueAdmin';
import UserList from './pages/UserList';
import UserVerification from './pages/UserVerification';


import Books from './pages/Books';
import BookUser from './pages/BookUser';
import CloseIssue from './pages/CloseIssue';

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

       
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book-user" element={<BookUser />} />

     
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<BookAdmin />} />
          <Route path="/admin/issue-requests" element={<IssueAdmin />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/user-verification" element={<UserVerification />} />
          <Route path="/admin/close-issue" element = {<CloseIssue />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
