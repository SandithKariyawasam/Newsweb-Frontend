"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import type { AxiosError } from 'axios';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/users/register', {
        username,
        password,
        captchaToken,
      });

      if (response.status === 200) {
        // Optionally show success message here
        router.push('/'); // Redirect to login page
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || 'Registration failed. Please try again.'
      );
      recaptchaRef.current?.reset(); // Reset CAPTCHA on failure
      setCaptchaToken(null);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/');
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
        <h1 className="text-3xl font-bold text-center mb-6">User Register</h1>

        <form onSubmit={handleRegister} className="space-y-4">
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

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
            ref={recaptchaRef}
          />

          <button
            type="submit"
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition"
            disabled={!captchaToken}
          >
            Register
          </button>
        </form>

        <div className="flex flex-col items-center justify-center mt-6">
          <p className="mb-4">If you already have an account, click below to log in:</p>
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
