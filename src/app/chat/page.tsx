import ChatInterface from '@/components/ChatInterface';
import StartSimulationButton from '@/components/StartSimulationButton';
import { db } from '@/db/drizzle';
import { messages as messagesTable, simulations } from '@/db/drizzle/schema';
import { getSession } from '@/db/supabase/server';
import { and, asc, desc, eq } from 'drizzle-orm';

export default async function SimulationsPage() {
  const session = await getSession();

  if (!session) {
    return <p>Loading or redirecting to login...</p>;
  }

  const userId = session.user.id;

  const activeSimulation = await db.query.simulations.findFirst({
    where: and(
      eq(simulations.userId, userId),
      eq(simulations.status, 'active')
    ),
    orderBy: [desc(simulations.createdAt)],
    with: {
      persona: true,
      messages: { orderBy: [asc(messagesTable.createdAt)] },
    },
  });

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-3xl font-bold mb-4">Persona Simulations</h1>

      {activeSimulation ? (
        <ChatInterface initialSimulation={activeSimulation} />
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh] border-2 rounded-lg p-10">
          <p className="text-xl mb-6 text-gray-600">
            You don't have an active simulation running.
          </p>
          <StartSimulationButton userId={userId} />
        </div>
      )}
    </div>
  );
}
