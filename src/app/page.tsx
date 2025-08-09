"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/users/login', {
        username,
        password,
        captchaToken, // send CAPTCHA token to backend
      });

      if (response.status === 200) {
        const { token, role } = response.data;

        // Save JWT token to localStorage (or wherever you store it)
        localStorage.setItem('token', token);

        // Optionally save role if you want to use it client-side
        localStorage.setItem('role', role);

        // Redirect based on role
        if (role === 'admin') {
          router.push('/user/home');  // example admin dashboard route
        } else {
          router.push('/user/home');         // example user homepage route
        }
      }
    } catch (error) {
      setError('Invalid username, password, or CAPTCHA');
      recaptchaRef.current?.reset(); // reset CAPTCHA
      setCaptchaToken(null);
    }
  };


  const handleRegister = () => {
    router.push('/user/register');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-white"
      style={{
        backgroundImage: `url('/images/loginbg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">User Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Google reCAPTCHA */}
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
            ref={recaptchaRef}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

          <div className="flex flex-col items-center justify-center mt-6">
            <p className="mb-4">If you don&apos;t have an account, click here</p>
            <button
              onClick={handleRegister}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
