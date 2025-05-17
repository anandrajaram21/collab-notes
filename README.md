# Collaborative Notes

A real-time collaborative note-taking application built with Next.js, Tiptap, and Hocuspocus.

## Features

- Create password-protected notes
- Real-time collaborative editing
- Funky avatars and random usernames for each user
- No authentication required
- Share notes with others

## Tech Stack

- Next.js
- Drizzle ORM
- PostgreSQL
- Hocuspocus for Tiptap
- Dicebear for avatars
- shadcn/ui for components

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Set up your database:

   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in your `.env` file

5. Run the development server:

   ```bash
   bun run dev
   ```

6. Run the Hocuspocus server (in a separate terminal):
   ```bash
   bun run server
   ```

## Environment Variables

- `DATABASE_URL`: Your PostgreSQL connection string
- `HOCUSPOCUS_PORT`: Port for the Hocuspocus server (default: 3001)
- `HOCUSPOCUS_SECRET`: Secret key for Hocuspocus
- `NEXT_PUBLIC_APP_URL`: Your application URL (default: http://localhost:3000)

## Usage

1. Create a new note by entering a title and password
2. Share the note URL with others
3. Anyone with the password can edit the note in real-time
4. Each user gets a random avatar and username

## License

MIT
