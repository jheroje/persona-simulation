import ChatInterface from '@/components/ChatInterface';
import StartSimulationButton from '@/components/StartSimulationButton';
import { db } from '@/db/drizzle';
import { messages, simulations } from '@/db/drizzle/schema';
import { getUser } from '@/db/supabase/server';
import { and, asc, desc, eq } from 'drizzle-orm';

export default async function SimulationsPage() {
  const user = await getUser();

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  const activeSimulation = await db.query.simulations.findFirst({
    where: and(
      eq(simulations.userId, user.id),
      eq(simulations.status, 'active')
    ),
    orderBy: [desc(simulations.createdAt)],
    with: {
      persona: true,
      messages: { orderBy: [asc(messages.createdAt)] },
    },
  });

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-3xl font-bold mb-4">Persona Simulation</h1>

      {activeSimulation ? (
        <ChatInterface
          simulation={activeSimulation}
          key={activeSimulation.id}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[85vh] border-2 rounded-lg p-10">
          <p className="text-xl mb-6 text-gray-600">
            You don't have an active simulation running.
          </p>
          <StartSimulationButton userId={user.id} />
        </div>
      )}
    </div>
  );
}
