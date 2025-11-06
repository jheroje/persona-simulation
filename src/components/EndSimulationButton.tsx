'use client';

import { endSimulation } from '@/app/chat/actions';
import {
  Achievement,
  AchievementBadgeInfo,
  Assessment,
} from '@/db/drizzle/schema';
import Image from 'next/image';
import { useState } from 'react';
import StartSimulationButton from './StartSimulationButton';
import { useToast } from './ToastProvider';
import { Tooltip } from './Tooltip';

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
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);

  const handleEndSimulation = async () => {
    setIsLoading(true);

    try {
      const result = await endSimulation(simulationId, userId);

      if (result.success) {
        if (result.assessment) {
          setAssessment(result.assessment);
          if (result.achievements?.length) {
            setAchievements(result.achievements);
          }
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

  const reset = () => {
    setAssessment(null);
    setAchievements(null);
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

            {achievements?.length && (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {`You have won ${achievements.length} ${
                    achievements.length > 1 ? `achievements` : `achievement`
                  }!`}
                </h2>
                <div className="flex justify-center">
                  {achievements.map((achievement, index) => {
                    const badgeInfo =
                      AchievementBadgeInfo[achievement.badgeType];

                    return (
                      <Tooltip
                        key={index}
                        trigger={
                          <Image
                            src={`/achievement-badge-earned.svg`}
                            alt={badgeInfo.description}
                            width={64}
                            height={64}
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
              </>
            )}

            <div className="flex justify-center mt-4">
              <StartSimulationButton userId={userId} onStart={reset} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
