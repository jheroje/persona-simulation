'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientSupabase } from '@/db/supabase/client';

export default function SignOutButton() {
  const supabase = clientSupabase();
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!user) return null;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login'); // change destination if you want another post-signout page
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1 rounded text-white bg-rose-500 hover:bg-rose-600"
      aria-label="Sign out"
    >
      Sign out
    </button>
  );
}
