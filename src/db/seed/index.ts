import { db, client } from '../drizzle';
import { personas } from '../drizzle/schema';
import { personasSeed } from './personas';

async function seedPersonas() {
  console.log('🌱 Seeding personas...');

  try {
    await db.delete(personas);
    await db.insert(personas).values(personasSeed);

    console.log('✅ Personas seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding personas:', err);
    throw err;
  } finally {
    if (client && typeof client.end === 'function') {
      await client.end();
    }
  }
}

seedPersonas().catch((err) => {
  process.exit(1);
});
