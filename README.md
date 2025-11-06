# Persona Simulation

## App URL

https://persona-simulation.vercel.app

## How to run locally

### Prerequisites

- Node.js (version 24)
- Supabase account and project created

### Setup environment variables

Copy the file named **`.example.env`** as **`.env.local`** in your project root and fill it with your credentials:

```bash
# Server side
DATABASE_URL="supabase postgresql connection string"
SUPABASE_URL="supabase project url"
SUPABASE_SERVICE_ROLE_KEY="supabase service role key"

# Client side
NEXT_PUBLIC_SUPABASE_URL="supabase project url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="supabase anon key"
```

### Bootstrap the project

```bash
# Install the dependencies
npm install

# Apply the migrations to your Supabase database
npm run db:migrate

# Seed the DB with the predefined personas
npm run db:seed

# Run the contents of this file in Supabase SQL editor
./src/db/seed/dbinit.sql

# Start the development server
npm run dev
```

## Architecture overview

### Tech stack

- Typescript
- Tailwind for styling
- NextJS for UI and server logic
- Supabase for DB (postgres) and authentication
- Drizzle ORM to manage tables, migrations and server-side queries, inserts, etc.

### Core Architecture Components

| Component               | Type   | Purpose                                                                                                                                     |
| :---------------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **`proxy.ts`**          | Server | **Protects all private routes.** If the user is logged out, they are redirected to `/login`, except for public paths (`/login`, `/signup`). |
| **`/chat/page.tsx`**    | Server | Fetches the user's latest simulation and related data (`persona`, `messages`) using Drizzle's relational queries (`.with()`).               |
| **`ChatInterface.tsx`** | Client | Manages the chat UI state, handles user input, and will eventually trigger Server Actions to process messages.                              |

### Simulation Flow

1.  **Start:** User clicks **`Start New Simulation`** button on `/chat`.
2.  **Create simulation (`startNewSimulation` action):**
    1. Randomly selects one `persona` and one nested `scenario`.
    2. Creates a new `simulations` record, with active status, saving a **snapshot** of the full `scenarioContext` for assessment and audit integrity.
    3. Creates the first `message` (the persona's initial prompt).
3.  **Chat:**
    1. Chat UI appears with the first message from the persona
    2. User can now send a message (`sendMessage` action)
    3. This action will also return the next persona message based on the response rules and render it as if it was naturally written.
    4. This loop can last as long as the user wants
4.  **End:** User clicks **`End Simulation`** button on `/chat`. Simulation status becomes inactive and the user can start a new simulation again

## Personas and scenarios

| Persona     | Role                            | Tone                   |
| :---------- | :------------------------------ | :--------------------- |
| John Doe    | Customer Service Representative | Friendly and practical |
| Jane Smith  | Technical Support Specialist    | Calm and analytical    |
| Juan Garcia | Operations Coordinator          | Casual and upbeat      |

## Implemented extension

### Extension chosen

Simulation assessment: After each run, show concise feedback based on simple criteria you define (e.g., greeting/verification, clarity, empathy, probing, resolution, time to resolve). A rule‑based checklist/score is sufficient. Bonus: add light gamification—e.g., achievements/badges, streaks, or progress tiers.

### Why

I think feedback and gamification are a very interesting addition to this project.

## Known limitations, what I have done with more time

- I would have polished the design a little bit more, as it is very simple as it is right now.
- I also would have loved to implement more extensions as most of them seem really interesting!
