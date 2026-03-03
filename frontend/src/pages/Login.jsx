import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import AuthLayout from '../components/Auth/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access your dashboard"
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Forgot Password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 rounded-xl"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <Button
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthLayout>
  );
}
