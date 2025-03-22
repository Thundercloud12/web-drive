import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import loginImage from '../assets/loginImage.png'; // Background image

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submit,isSubmit] = useState(false)

  const handleSubmit = async (e) => {
    isSubmit(true)
    e.preventDefault();
    setError('');
    try {
      const session = await authService.login({ email, password });
      if (session) {
        const userData = await authService.checkAuthStatus();
        if (userData) {
          setIsAuth(true);
          navigate(`/dashboard/${userData.$id}`);
        } else {
          setError("Login failed. Please try again.");
        }
      }
    } catch (error) {
      if (error.message.includes('Invalid `userId` param')) {
        console.warn('Ignoring Invalid userId error and continuing...');
        navigate('/login');
      } else {
        console.log(error);
        setError('Login failed. Please try again.');
      }
    }
    isSubmit(false)
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-300">
      
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm opacity-30" style={{ backgroundImage: `url(${loginImage})` }}></div>
      
      {/* Login Box */}
      <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Log in to manage your finances effortlessly.</p>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-400 pr-10"
              placeholder="Enter your password"
            />
            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              submit
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={submit}
          >
            {submit ? "Logging In..." : "Log In"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
