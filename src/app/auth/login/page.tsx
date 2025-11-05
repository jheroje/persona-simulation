'use client';

import { useToast } from '@/components/ToastProvider';
import { clientSupabase } from '@/db/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = clientSupabase();
  const showToast = useToast();

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
    <div className="flex flex-col space-y-4 max-w-sm mx-auto p-8 border rounded-lg shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-center">Log In</h2>
      <form onSubmit={handleLogIn} className="flex flex-col space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-md font-semibold cursor-pointer"
        >
          Log In
        </button>
      </form>
      <div className="text-center text-sm">
        <p>
          New user?{' '}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
