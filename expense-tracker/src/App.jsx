import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import HomePage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Overview from './pages/Overview';
import ExpenseCreation from './pages/ExpenseCreation';
import PrivateRoute from './pages/PrivateRoute';
import PublicRoute from './pages/PublicRoute';
import Layout from './pages/Layout';
import authService from './appwrite/auth';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.checkAuthStatus();
        if (user) {
          setIsAuth(true);
          setUserId(user.$id);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="flex min-h-screen">
        <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
        <div className="flex-1">
          <Routes>
            {isAuth && userId ? <Route path="/" element={<Navigate to={`/dashboard/${userId}`} />} /> : null}


            <Route path="/" element={<HomePage />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
              <Route path="/signup" element={<Signup setIsAuth={setIsAuth} />} />
            </Route>

            <Route path="/dashboard/:user_id/*" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Overview />} />
                <Route path="expense" element={<ExpenseCreation />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
