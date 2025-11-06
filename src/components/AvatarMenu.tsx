'use client';

import {
  AchievementBadge,
  AchievementBadgeInfo,
  ProfileWithAchievements,
} from '@/db/drizzle/schema';
import { clientSupabase, getUser } from '@/db/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tooltip } from './Tooltip';

export default function AvatarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<ProfileWithAchievements | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = clientSupabase();
      const authUser = await getUser();

      if (!authUser) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, achievements(*)')
        .eq('user_id', authUser.id)
        .single();

      if (profile) {
        setUser(profile);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        className="flex items-center rounded-full hover:ring-2 hover:ring-gray-200 transition-all cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
      </button>

      <div
        className={`${
          isOpen ? 'visible' : 'invisible'
        } absolute right-0 w-48 bg-neutral-800 rounded-lg shadow-xl border border-neutral-300 text-white mt-2`}
      >
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-medium">{user.username}</p>
        </div>
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-medium">Achievements</p>
          <div className="flex justify-start">
            {Object.keys(AchievementBadgeInfo).map((key, index) => {
              const badgeInfo = AchievementBadgeInfo[key as AchievementBadge];

              const userEarned = user.achievements.find(
                (a) => a.badgeType === key
              );

              return (
                <Tooltip
                  trigger={
                    <Image
                      key={index}
                      src={`/achievement-badge-${
                        userEarned ? 'earned' : 'unearned'
                      }.svg`}
                      alt={badgeInfo.description}
                      width={32}
                      height={32}
                      className="cursor-pointer"
                    />
                  }
                >
                  <p className="text-sm whitespace-nowrap">
                    {badgeInfo.description}
                  </p>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <button
          onClick={async () => {
            const supabase = clientSupabase();
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-900 rounded-lg cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
