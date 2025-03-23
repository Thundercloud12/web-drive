import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import signupImage from '../assets/loginImage.png'; // Background image

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submit,isSubmit] = useState(false)

  const handleSubmit = async (e) => {
    isSubmit(true)
    e.preventDefault();
    setError('');
    try {
      const session = await authService.createAccount({ email, password, name });
      if (session) {
        navigate('/login');
      }
    } catch (error) {
      if (error.message.includes("Invalid `userId` param")) {
        console.warn("Ignoring Invalid userId error and continuing...");
        navigate('/login');
      }
      throw error;
    }
    isSubmit(false)
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-300">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm opacity-30" style={{ backgroundImage: `url(${signupImage})` }}></div>
      <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-4">Create an Account</h2>
        <p className="text-center text-gray-600 mb-6">Sign up to start managing your finances.</p>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-green-400"
              placeholder="Enter your name"
            />
          </div>
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
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              submit
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={submit}
          >
            {submit ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
