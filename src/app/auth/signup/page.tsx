'use client';

import { clientSupabase } from '@/db/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const supabase = clientSupabase();

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
      return alert(`Sign-up failed: ${signUpError.message}`);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (user) {
      if (!session) {
        return alert('User must confirm email before being authenticated.');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, username: username });

      if (profileError) {
        await supabase.auth.signOut();
        return alert(
          `Profile creation failed. Please try signing up again. (${profileError.message})`
        );
      }
    }

    alert('Sign-up successful! You are now logged in.');
    router.push('/chat');
  };

  return (
    <div className="flex flex-col space-y-4 max-w-sm mx-auto p-8 border rounded-lg shadow-xl mt-10">
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
          className="bg-blue-600 text-white p-3 rounded-md font-semibold"
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
          Sign In
        </Link>
      </div>
    </div>
  );
}
