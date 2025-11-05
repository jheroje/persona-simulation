'use client';

import { useToast } from '@/components/ToastProvider';
import { clientSupabase } from '@/db/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Signup() {
  const router = useRouter();
  const supabase = clientSupabase();
  const showToast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return showToast(`Sign-up failed: ${signUpError.message}`, 'error');
    }

    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, username: username });

      if (profileError) {
        await supabase.auth.signOut();
        return showToast(
          `Profile creation failed. Please try signing up again. (${profileError.message})`,
          'error'
        );
      }
    }

    showToast('Sign-up successful! You are now logged in.', 'success');
    router.push('/chat');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col space-y-4 p-8 border rounded-lg shadow-xl w-100">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        <form onSubmit={handleSignUp} className="flex flex-col space-y-3">
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
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (for profile)"
            required
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-semibold cursor-pointer"
          >
            Create Account
          </button>
        </form>
        <div className="text-center text-sm">
          <p>Already have an account?</p>
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
