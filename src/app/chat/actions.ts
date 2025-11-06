'use server';

import { db } from '@/db/drizzle';
import {
  Assessment,
  assessments,
  Message,
  messages,
  personas,
  profiles,
  Scenario,
  Simulation,
  simulations,
} from '@/db/drizzle/schema';
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

function getCriteriaFeedback(triggeredCount: number, defaultCount: number) {
  if (triggeredCount === 0 && defaultCount === 0) {
    return 'No user messages were sent during the simulation.';
  }

  if (defaultCount === 0) {
    return `Great job! You triggered ${triggeredCount} response rules without any default responses.`;
  }

  if (triggeredCount === 0) {
    return `You did not trigger any response rules, and the persona responded with the default ${defaultCount} times.`;
  }

  return `You triggered ${triggeredCount} response rules, but the persona responded with the default ${defaultCount} times.`;
}

function getScore(
  rules: Scenario['responses']['rules'],
  triggeredCount: number,
  defaultCount: number
) {
  const ruleValue = rules.length > 0 ? 100 / rules.length : 0;

  const score = Math.round(triggeredCount * ruleValue - defaultCount * 5);

  if (score < 0) return 0;
  if (score > 100) return 100;

  return score;
}

function getTimeToResolve(simulation: Simulation, messages: Message[]) {
  const firstUserMessage = messages.find(
    (message) => message.sender === 'user'
  );

  const lastMessage = messages.length
    ? messages[messages.length - 1]
    : undefined;

  const firstTimestamp = firstUserMessage?.createdAt
    ? firstUserMessage.createdAt
    : simulation.createdAt;

  const lastTimestamp = lastMessage?.createdAt;

  if (!firstTimestamp || !lastTimestamp) {
    return 0;
  }

  const start = new Date(firstTimestamp).getTime();
  const end = new Date(lastTimestamp).getTime();

  const seconds = Math.max(0, Math.round((end - start) / 1000));

  return seconds;
}

export async function endSimulation(simulationId: string): Promise<{
  success: boolean;
  assessment?: Assessment;
  error?: string;
}> {
  try {
    const result = await db.transaction(async (tx) => {
      await tx
        .update(simulations)
        .set({ status: 'inactive' })
        .where(eq(simulations.id, simulationId));

      const simulation = await tx.query.simulations.findFirst({
        where: eq(simulations.id, simulationId),
        with: { persona: true, messages: true },
      });

      if (!simulation) {
        throw new Error('Simulation not found');
      }

      const existingAssessment = await tx.query.assessments.findFirst({
        where: eq(assessments.simulationId, simulationId),
      });

      if (existingAssessment) {
        return { success: true, assessment: existingAssessment };
      }

      const rules = simulation.scenarioContext.responses?.rules ?? [];

      const sortedMessages = simulation.messages
        .slice()
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      let triggeredCount = 0;
      let defaultCount = 0;

      for (const message of sortedMessages) {
        if (message.sender !== 'user') continue;

        const content = (message.content || '').toLowerCase();

        const matched = rules.find((r) =>
          r.triggers.some((t) => content.includes(t))
        );

        if (matched) triggeredCount += 1;
        else defaultCount += 1;
      }

      const score = getScore(rules, triggeredCount, defaultCount);

      const criteriaFeedback = getCriteriaFeedback(
        triggeredCount,
        defaultCount
      );

      const timeToResolve = getTimeToResolve(simulation, sortedMessages);

      const [newAssessment] = await tx
        .insert(assessments)
        .values({
          simulationId,
          score,
          timeToResolve: sql`make_interval(secs => ${timeToResolve})`,
          criteriaFeedback,
        })
        .returning();

      return {
        success: true,
        assessment: newAssessment,
      };
    });

    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function sendMessage(simulationId: string, content: string) {
  try {
    await db.transaction(async (tx) => {
      const simulation = await tx.query.simulations.findFirst({
        where: eq(simulations.id, simulationId),
        with: { persona: true },
      });

      if (!simulation) throw new Error('Simulation not found');

      const { responses } = simulation.scenarioContext;

      const matchingRule = responses.rules.find((r) =>
        r.triggers.some((t) => content.toLowerCase().includes(t))
      );

      const reply = matchingRule?.response || responses.default;

      await tx.insert(messages).values({
        simulationId,
        sender: 'user',
        content,
      });

      await tx.insert(messages).values({
        simulationId,
        sender: 'persona',
        content: reply.replaceAll('{username}', ''),
      });
    });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}
