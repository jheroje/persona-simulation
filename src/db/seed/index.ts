import { db } from '../drizzle';
import { personas } from '../drizzle/schema';
import { personasSeed } from './personas';

async function seedPersonas() {
  console.log('🌱 Seeding personas...');

  await db.delete(personas);

  await db.insert(personas).values(personasSeed);

  console.log('✅ Personas seeded successfully!');
}

seedPersonas().catch((err) => {
  console.error('❌ Error seeding personas:', err);
});
