import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from 'drizzle-orm';
import {
  bigserial,
  check,
  interval,
  jsonb,
  pgPolicy,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUsers } from './external';

// CUSTOM TABLES
export const profiles = pgTable(
  'profiles',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    username: text('username').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy('profiles_select_own', {
      for: 'select',
      to: 'authenticated',
      using: sql`${table.userId} = auth.uid()`,
    }),
    pgPolicy('profiles_insert_own', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
    pgPolicy('profiles_update_own', {
      for: 'update',
      to: 'authenticated',
      using: sql`${table.userId} = auth.uid()`,
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
  ]
).enableRLS();

export const personas = pgTable(
  'personas',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    tone: text('tone').notNull(),
    oceanOpenness: smallint('ocean_openness').notNull(),
    oceanConscientiousness: smallint('ocean_conscientiousness').notNull(),
    oceanExtraversion: smallint('ocean_extraversion').notNull(),
    oceanAgreeableness: smallint('ocean_agreeableness').notNull(),
    oceanNeuroticism: smallint('ocean_neuroticism').notNull(),
    scenarios: jsonb('scenarios').$type<Scenario[]>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      'ocean_openness_range',
      sql`${table.oceanOpenness} >= 0 AND ${table.oceanOpenness} <= 100`
    ),
    check(
      'ocean_conscientiousness_range',
      sql`${table.oceanConscientiousness} >= 0 AND ${table.oceanConscientiousness} <= 100`
    ),
    check(
      'ocean_extraversion_range',
      sql`${table.oceanExtraversion} >= 0 AND ${table.oceanExtraversion} <= 100`
    ),
    check(
      'ocean_agreeableness_range',
      sql`${table.oceanAgreeableness} >= 0 AND ${table.oceanAgreeableness} <= 100`
    ),
    check(
      'ocean_neuroticism_range',
      sql`${table.oceanNeuroticism} >= 0 AND ${table.oceanNeuroticism} <= 100`
    ),
  ]
);

export const simulations = pgTable(
  'simulations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => profiles.userId, { onDelete: 'cascade' })
      .notNull(),
    personaId: uuid('persona_id')
      .references(() => personas.id, { onDelete: 'cascade' })
      .notNull(),
    scenarioContext: jsonb('scenario_context').$type<Scenario>().notNull(),
    status: text('status').$type<SimulationStatus>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy('simulations_select_own', {
      for: 'select',
      to: 'authenticated',
      using: sql`${table.userId} = auth.uid()`,
    }),
    pgPolicy('simulations_insert_own', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
    pgPolicy('simulations_update_own', {
      for: 'update',
      to: 'authenticated',
      using: sql`${table.userId} = auth.uid()`,
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
  ]
).enableRLS();

export const messages = pgTable(
  'messages',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    simulationId: uuid('simulation_id')
      .references(() => simulations.id, { onDelete: 'cascade' })
      .notNull(),
    sender: text('sender').$type<MessageSender>().notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy('messages_select_by_simulation', {
      for: 'select',
      to: 'authenticated',
      using: sql`EXISTS (
        SELECT 1 FROM ${simulations}
        WHERE ${simulations.id} = ${table.simulationId}
          AND ${simulations.userId} = auth.uid()
      )`,
    }),
    pgPolicy('messages_insert_by_simulation', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${simulations}
        WHERE ${simulations.id} = ${table.simulationId}
          AND ${simulations.userId} = auth.uid()
      )`,
    }),
  ]
).enableRLS();

export const assessments = pgTable(
  'assessments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    simulationId: uuid('simulation_id')
      .references(() => simulations.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    score: smallint('score').notNull(),
    timeToResolve: interval('time_to_resolve').notNull(),
    criteriaFeedback: jsonb('criteria_feedback').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check('score_range', sql`${table.score} >= 0 AND ${table.score} <= 100`),
    pgPolicy('assessments_select_by_simulation', {
      for: 'select',
      to: 'authenticated',
      using: sql`EXISTS (
        SELECT 1 FROM ${simulations}
        WHERE ${simulations.id} = ${table.simulationId}
          AND ${simulations.userId} = auth.uid()
      )`,
    }),
    pgPolicy('assessments_insert_by_simulation', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${simulations}
        WHERE ${simulations.id} = ${table.simulationId}
          AND ${simulations.userId} = auth.uid()
      )`,
    }),
  ]
).enableRLS();

export const achievements = pgTable(
  'achievements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => profiles.userId, { onDelete: 'cascade' })
      .notNull(),
    simulationId: uuid('simulation_id')
      .references(() => simulations.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    badgeType: text('badge_type').$type<AchievementBadge>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique().on(table.userId, table.badgeType),
    pgPolicy('achievements_select_own', {
      for: 'select',
      to: 'authenticated',
      using: sql`${table.userId} = auth.uid()`,
    }),
    pgPolicy('achievements_insert_own', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
  ]
).enableRLS();

// RELATIONS
export const profilesRelations = relations(profiles, ({ many }) => ({
  simulations: many(simulations),
  achievements: many(achievements),
}));

export const personasRelations = relations(personas, ({ many }) => ({
  simulations: many(simulations),
}));

export const simulationsRelations = relations(simulations, ({ one, many }) => ({
  persona: one(personas, {
    fields: [simulations.personaId],
    references: [personas.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  simulation: one(simulations, {
    fields: [messages.simulationId],
    references: [simulations.id],
  }),
}));

// TYPES
export type Scenario = {
  callId: number;
  service: string;
  subject: string;
  notes: string;
  responses: {
    initial: string;
    default: string;
    rules: {
      triggers: string[];
      response: string;
    }[];
  };
};

// MODEL TYPES
export type MessageSender = 'user' | 'persona';
export type SimulationStatus = 'active' | 'inactive';

export const AchievementBadgeList = [
  'SIMULATION_FIRST',
  'SIMULATION_ALL_PERSONAS',
  'SIMULATION_ALL_SCENARIOS_FOR_PERSONA',
  'SIMULATION_ALL_SCENARIOS',
  'SIMULATION_PERFECT_SCORE',
] as const;

type AchievementBadge = (typeof AchievementBadgeList)[number];

export type AchievementInfo = {
  description: string;
};

export const AchievementBadgeInfo: Record<AchievementBadge, AchievementInfo> = {
  SIMULATION_FIRST: {
    description: 'Completed your first simulation',
  },
  SIMULATION_ALL_PERSONAS: {
    description: 'Completed at least one simulation with each persona',
  },
  SIMULATION_ALL_SCENARIOS_FOR_PERSONA: {
    description: 'Completed all scenarios for one persona',
  },
  SIMULATION_ALL_SCENARIOS: {
    description: 'Completed all scenarios across all personas',
  },
  SIMULATION_PERFECT_SCORE: {
    description: 'Achieved a perfect assessment score',
  },
} as const;

// MODEL INFERRED TYPES
export type Profile = InferSelectModel<typeof profiles>;
export type Persona = InferSelectModel<typeof personas>;
export type Simulation = InferSelectModel<typeof simulations>;
export type Message = InferSelectModel<typeof messages>;
export type Assessment = InferSelectModel<typeof assessments>;
export type Achievement = InferSelectModel<typeof achievements>;

export type NewPersona = InferInsertModel<typeof personas>;
export type NewSimulation = InferInsertModel<typeof simulations>;
export type NewMessage = InferInsertModel<typeof messages>;

// RELATION TYPES
export type ProfileWithAchievements = Profile & {
  achievements: Achievement[];
};

export type SimulationWithPersonaAndMessages = Simulation & {
  persona: Persona;
  messages: Message[];
};
