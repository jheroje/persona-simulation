import { createBrowserClient } from '@supabase/ssr';

export const clientSupabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const getUser = async () => {
  const supabase = clientSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
