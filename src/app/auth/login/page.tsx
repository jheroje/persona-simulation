'use client';

import { useToast } from '@/components/ToastProvider';
import { clientSupabase } from '@/db/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const supabase = clientSupabase();
  const showToast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push('/');
    } else {
      showToast(`Log in failed: ${error.message}`, 'error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col space-y-4 p-8 border border-neutral-400 rounded-lg shadow-xl w-100 bg-neutral-900">
        <h2 className="text-2xl font-bold text-center mb-5">
          Log in to your account
        </h2>
        <form onSubmit={handleLogIn} className="flex flex-col space-y-3">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            className="p-2 border rounded bg-neutral-800 border-neutral-400"
          />
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded bg-neutral-800 border-neutral-400"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 disabled:bg-neutral-500 text-white p-3 rounded-md font-bold cursor-pointer disabled:cursor-default mt-5"
            disabled={!email || !password}
          >
            Log In
          </button>
        </form>
        <div className="text-center text-sm">
          <p>New user?</p>
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
