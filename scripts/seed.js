const { db } = require('@vercel/postgres');
const {
  entries,
  users,
} = require('./placeholder-data.js');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        return client.sql`
        INSERT INTO users (id, name, email)
        VALUES (${user.id}, ${user.name}, ${user.email})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedEntries(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "entries" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ighandle VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL,
    won BOOLEAN NOT NULL,
    contest_date DATE NOT NULL
  );
`;

    console.log(`Created "entries" table`);

    // Insert data into the "entries" table
    const insertedEntries = await Promise.all(
      entries.map(
        (entry) => client.sql`
        INSERT INTO entries (name, ighandle, verified, won, contest_date)
        VALUES (${entry.name}, ${entry.ighandle}, ${entry.verified}, ${entry.won}, ${entry.contest_date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedEntries.length} entries`);

    return {
      createTable,
      entries: insertedEntries,
    };
  } catch (error) {
    console.error('Error seeding entries:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedEntries(client)

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});