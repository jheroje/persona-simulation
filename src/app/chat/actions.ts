'use server';

import { db } from '@/db/drizzle';
import { messages, personas, profiles, simulations } from '@/db/drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function startNewSimulation(userId: string) {
  try {
    const [randomPersona] = await db
      .select()
      .from(personas)
      .orderBy(sql`random()`)
      .limit(1);

    if (!randomPersona) {
      return { success: false, error: 'No personas available' };
    }

    const scenario =
      randomPersona.scenarios?.length > 0
        ? randomPersona.scenarios[
            Math.floor(Math.random() * randomPersona.scenarios.length)
          ]
        : undefined;
    if (!scenario) {
      return {
        success: false,
        error: 'Selected persona has no scenarios',
      };
    }

    const [createdSimulation] = await db
      .insert(simulations)
      .values({
        userId,
        personaId: randomPersona.id,
        scenarioContext: scenario,
        status: 'active',
      })
      .returning();

    // Fetch username for templating; fallback to a friendly default
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });
    const username = profile?.username ?? 'there';

    // Insert initial persona message using the scenario's initial template
    const initialText = (scenario.responses.initial || '').replaceAll(
      '{username}',
      username
    );

    if (initialText) {
      await db.insert(messages).values({
        simulationId: createdSimulation.id,
        sender: 'persona',
        content: initialText,
      });
    }

    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function endSimulation(simulationId: string) {
  try {
    await db
      .update(simulations)
      .set({ status: 'inactive' })
      .where(eq(simulations.id, simulationId));

    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function sendMessage(simulationId: string, content: string) {
  return await db.transaction(async (tx) => {
    const simulation = await tx.query.simulations.findFirst({
      where: eq(simulations.id, simulationId),
      with: { persona: true },
    });

    if (!simulation) throw new Error('Simulation not found');

    const [userRow] = await tx
      .insert(messages)
      .values({ simulationId, sender: 'user', content })
      .returning();

    const { responses } = simulation.scenarioContext;

    const matchingRule = responses.rules.find((r) =>
      r.triggers.some((t) => content.toLowerCase().includes(t))
    );

    const reply = matchingRule?.response || responses.default;

    const [personaRow] = await tx
      .insert(messages)
      .values({
        simulationId,
        sender: 'persona',
        content: reply.replaceAll('{username}', ''),
      })
      .returning();

    return { userMessage: userRow, personaMessage: personaRow };
  });
}
