'use client';

import { endSimulation } from '@/app/chat/actions';
import { Assessment } from '@/db/drizzle/schema';
import { useState } from 'react';
import StartSimulationButton from './StartSimulationButton';
import { useToast } from './ToastProvider';

interface ButtonProps {
  simulationId: string;
  userId: string;
}

export default function EndSimulationButton({
  simulationId,
  userId,
}: ButtonProps) {
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const handleEndSimulation = async () => {
    setIsLoading(true);

    try {
      const result = await endSimulation(simulationId, userId);

      if (result.success) {
        if (result.assessment) {
          setAssessment(result.assessment);
        } else {
          showToast('Simulation ended.', 'info');
        }
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
    <>
      <button
        onClick={handleEndSimulation}
        disabled={isLoading}
        className="bg-rose-500 hover:bg-rose-600  text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50 transition-colors cursor-pointer"
      >
        {isLoading ? 'Ending...' : 'End Simulation'}
      </button>

      {assessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-neutral-800 text-gray-100 rounded-lg p-6 w-[520px] shadow-lg z-10">
            <h2 className="text-2xl font-bold mb-4">Simulation Assessment</h2>
            <p className="mb-2">
              <span>
                <span className="font-semibold">Score: </span>
                {assessment.score}
              </span>
            </p>
            <p className="mb-2">
              <span>
                <span className="font-semibold">Feedback: </span>
                {assessment.criteriaFeedback}
              </span>
            </p>
            <p className="mb-4">
              <span>
                <span className="font-semibold">Time to resolve: </span>
                {assessment.timeToResolve}
              </span>
            </p>

            <div className="flex justify-center">
              <StartSimulationButton
                userId={userId}
                onStart={() => setAssessment(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
