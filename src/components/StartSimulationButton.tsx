'use client';

import { startNewSimulation } from '@/app/chat/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from './ToastProvider';
import { useLoading } from './LoadingProvider';

interface ButtonProps {
  userId: string;
  onStart?: () => void;
}

export default function StartSimulationButton({
  userId,
  onStart,
}: ButtonProps) {
  const router = useRouter();
  const loadingOverlay = useLoading();
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSimulation = async () => {
    setIsLoading(true);
    loadingOverlay.show();

    if (!!onStart) onStart();

    try {
      const result = await startNewSimulation(userId);

      if (result.success) {
        router.refresh();
      } else {
        showToast(`Failed to start simulation: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(
        'An unexpected error occurred while starting the simulation.',
        'error'
      );
    } finally {
      loadingOverlay.hide();
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartSimulation}
      disabled={isLoading}
      className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50 transition-colors cursor-pointer"
    >
      {isLoading ? 'Starting...' : 'Start New Simulation'}
    </button>
  );
}
