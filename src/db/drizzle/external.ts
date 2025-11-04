import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

// Managed by Supabase, we don't want to touch this, just reference
export const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
});
