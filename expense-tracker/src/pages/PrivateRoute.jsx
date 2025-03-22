import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../appwrite/auth';

const PublicRoute = () => {
  console.log("Rendering PublicRoute");

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.checkAuthStatus();
        setIsAuth(!!user); 
      } catch (error) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  return isAuth ? <Outlet /> :  <Navigate to="/" />;
};

export default PublicRoute;
