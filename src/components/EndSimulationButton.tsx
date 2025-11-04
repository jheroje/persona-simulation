'use client';

import { endSimulation, startNewSimulation } from '@/app/chat/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ButtonProps {
  simulationId: string;
}

export default function EndSimulationButton({ simulationId }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartSimulation = async () => {
    setIsLoading(true);
    try {
      const result = await endSimulation(simulationId);

      if (result.success) {
        router.refresh();
      } else {
        alert(`Failed to end simulation: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred while ending the simulation.');
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
