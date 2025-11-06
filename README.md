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

### Core Components

| File                                        | Purpose                                                                                                                                                                                               |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`proxy.ts`**                              | **Protects all private routes.** If the user is logged out, they are redirected to `/login`, except for public paths (`/login`, `/signup`).                                                           |
| **`/login/page.tsx`**                       | Page for logging in with an existing user with email and password through **Supabase auth**. Provides a link to `/signup` if the user doesn't have an account.                                        |
| **`/signup/page.tsx`**                      | Page for creating a new account with email, password and username through **Supabase auth**. Provides a link to `/login` if the user already has an account.                                          |
| **`/chat/page.tsx`**                        | Fetches the user's latest active simulation and related data (`persona`, `messages`) for the chat UI. If there is no active simulation, a **`Start New Simulation`** button appears.                  |
| **`/chat/actions.ts`**                      | Server actions to manage simulation flow, like `startNewSimulation`, `endSimulation` and `sendMessage`                                                                                                |
| **`/components/ChatInterface.tsx`**         | Chat UI component. Subscribes to **Supabase realtime** channel on mount, and always scroll to the bottom on new message. Header contains the persona information and the **`End Simulation`** button. |
| **`/components/AvatarMenu.tsx`**            | Layout header icon with the user initial, that when clicked will show a menu with the username, achievements and the sign out option                                                                  |
| **`/components/StartSimulationButton.tsx`** | Component that shows on the main screen and the assessment popup to create a new simulation                                                                                                           |
| **`/components/EndSimulationButton.tsx`**   | Component that shows on the header of the chat to mark the simulation as finished (with status inactive) and shows the assessment popup.                                                              |
| **`/components/ToastProvider.tsx`**         | Basic toast component for error/info/success feedback that disappears after 4 seconds                                                                                                                 |
| **`/components/Tooltip.tsx`**               | Generic tooltip component used for expanded hover information on the persona name and achievement stars                                                                                               |
| **`/db/supabase`**                          | Folder with supabase client initialization for server-side, client-side and middleware usage                                                                                                          |
| **`/db/drizzle`**                           | Folder with drizzle client initialization and DB schema                                                                                                                                               |
| **`/db/seed`**                              | Folder with the seed for the personas and scenarios, as well as a dbinit SQL file meant to be run on the Supabase SQL editor                                                                          |

### Simulation Flow

1.  **Start:** User clicks **`Start New Simulation`** button on `/chat`.
2.  **Create simulation (`startNewSimulation` action):**
    1. Randomly selects one `persona` and one nested `scenario`.
    2. Creates a new `simulations` record, with active status, saving a **snapshot** of the full `scenarioContext` for assessment and audit integrity.
    3. Creates the first `message` (the persona's initial prompt).
3.  **Chat:**
    1. Chat UI appears with the first message from the persona
    2. User can now send a message (`sendMessage` action)
    3. This action will also return the next persona message based on the response rules (triggers) and render it as if it was naturally written.
    4. This loop can last as long as the user wants
4.  **Chat finish:** User clicks **`End Simulation`** button on `/chat`. Simulation status becomes inactive and the asessment popup appears.
5.  **Assessment:** User will see the assessment results, with the score, the time to resolve and the feedback. If the user won any achievements, they will also show. This popup contains a **`Start New Simulation`** button the user can click to begin again

## Personas and scenarios

| Persona       | Role                            | Tone                   | Description                                                                                  |
| :------------ | :------------------------------ | :--------------------- | :------------------------------------------------------------------------------------------- |
| John Doe      | Customer Service Representative | Friendly and practical | Support person for billing issues and information requests. Helps the user.                  |
| Jane Smith    | Technical Support Specialist    | Calm and analytical    | Technical person for connection and performance issues. Helps the user.                      |
| Lisa Peterson | Customer                        | Anxious and reactive   | Customer that asks for refunds, delays and other order/shipment issues. The user helps Lisa. |

## Implemented extension

### Extension chosen

Simulation assessment: After each run, show concise feedback based on simple criteria you define (e.g., greeting/verification, clarity, empathy, probing, resolution, time to resolve). A rule‑based checklist/score is sufficient. Bonus: add light gamification—e.g., achievements/badges, streaks, or progress tiers.

### Why

I think feedback and gamification are a very interesting addition to this project. Feedback lets the user know what went well and what could be improved, and achievements keep the user engaged.

## Known limitations, what I have done with more time

- I would have polished the design a little bit more, as it is very simple as it is right now.
- Lots of room to shave bits of performance and improve UX.
- Add some simulation flow testing.
- Improve feedback criteria, add more achievements, add a different icon for each achievement, etc.
- Add different environments (test/dev, staging, etc)
- CI/CD (light lint and test jobs before deployment)
- I also would have loved to implement more extensions as most of them seem really interesting and useful!
