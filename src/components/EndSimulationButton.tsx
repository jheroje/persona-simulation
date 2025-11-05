'use client';

import { endSimulation } from '@/app/chat/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface ButtonProps {
  simulationId: string;
}

export default function EndSimulationButton({ simulationId }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const showToast = useToast();

  const handleStartSimulation = async () => {
    setIsLoading(true);
    try {
      const result = await endSimulation(simulationId);

      if (result.success) {
        router.refresh();
      } else {
        showToast(`Failed to end simulation: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(
        'An unexpected error occurred while ending the simulation.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartSimulation}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700  text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50 transition-colors cursor-pointer"
    >
      {isLoading ? 'Ending...' : 'End Simulation'}
    </button>
  );
}
