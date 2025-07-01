'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Image from 'next/image';

export default function SignInPage() {
  const { signIn, signInWithProvider } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      if (typeof error === 'string') {
        setError(error);
      } else if (error && typeof error === 'object' && error.message) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white flex items-center justify-center rounded-md p-1">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="4" fill="currentColor"/></svg>
          </div>
          <span className="font-semibold text-lg">Acme Inc.</span>
        </div>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-1">Welcome back</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Login with your Apple or Google account</p>
        <div className="flex flex-col gap-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 font-semibold"
            onClick={() => signInWithProvider('apple')}
          >
            <FaApple className="w-5 h-5" /> Login with Apple
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 font-semibold"
            onClick={() => signInWithProvider('google')}
          >
            <FcGoogle className="w-5 h-5" /> Login with Google
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-1">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/reset-password" className="text-xs text-gray-500 underline">Forgot your password?</Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full font-semibold bg-black text-white hover:bg-gray-900" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="text-center text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="underline font-medium">Sign up</Link>
        </div>
      </div>
      <div className="text-xs text-gray-400 text-center mt-6 max-w-md">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline">Terms of Service</a> and{' '}
        <a href="#" className="underline">Privacy Policy</a>.
      </div>
    </div>
  );
} 