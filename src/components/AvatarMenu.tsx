'use client';

import {
  AchievementBadgeInfo,
  AchievementBadgeList,
  ProfileWithAchievements,
} from '@/db/drizzle/schema';
import { clientSupabase, getUser } from '@/db/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from './Tooltip';

export default function AvatarMenu() {
  const router = useRouter();
  const supabase = clientSupabase();
  const [user, setUser] = useState<ProfileWithAchievements | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const wrapper = wrapperRef.current;
      const target = e.target as Node;

      if (wrapper && wrapper.contains(target)) return;

      setIsOpen(false);
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((o) => !o);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
  };

  const fetchUserProfile = async () => {
    const authUser = await getUser();

    if (!authUser) {
      setUser(null);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select(
        `*, 
            achievements(
              id,
              userId:user_id,
              createdAt:created_at,
              simulationId:simulation_id,
              badgeType:badge_type
            )`
      )
      .eq('user_id', authUser.id)
      .single();

    setUser(profile ?? null);
  };

  useEffect(() => {
    fetchUserProfile();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_OUT') {
          router.replace('/login');
          router.refresh();
        } else if (event === 'SIGNED_IN') {
          router.refresh();
        }

        fetchUserProfile();
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        className="flex items-center rounded-full hover:ring-2 hover:ring-gray-200 transition-all cursor-pointer"
        onClick={handleClick}
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
        } absolute right-0 w-48 bg-neutral-800 rounded-lg shadow-xl border border-neutral-500 text-white mt-2`}
      >
        <div className="px-4 py-2 border-b border-neutral-500">
          <p className="text-md font-bold">{user.username}</p>
        </div>
        <div className="px-4 py-4 border-b border-neutral-500">
          <p className="text-sm font-medium">Achievements</p>
          <div className="flex justify-start">
            {AchievementBadgeList.map((key, index) => {
              const badgeInfo = AchievementBadgeInfo[key];

              const userEarned = user.achievements.some(
                (a) => a.badgeType === key
              );

              return (
                <Tooltip
                  key={index}
                  trigger={
                    <Image
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
          onClick={signOut}
          className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-900 rounded-lg cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
