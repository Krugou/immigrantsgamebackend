# immigrantsgamebackend

This backend provides the API and data management for the Immigrants Game project.

## Features

- RESTful API using Express.js
- Modular route structure: events, user, config
- Firestore integration for data persistence
- TypeScript, ESLint, and Prettier best practices

## Project Structure

- `server.ts` — Entry point, starts the Express server
- `app.ts` — Express app setup and middleware
- `routes/` — Route handlers split by resource:
  - `events.ts` — Event management endpoints
  - `user.ts` — User save/load endpoints
  - `config.ts` — System configuration endpoints
- `firebase.ts` — Firestore DB connection
- `logger.ts` — Request logging middleware

## Scripts

- `npm run dev` — Start development server
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Development

1. Install dependencies: `npm ci`
2. Set up environment variables in `.env` if needed
3. Run the server: `npm run dev`

## Linting & Formatting

- ESLint and Prettier are configured for code quality and consistency.
- Run `npm run lint` to check for lint errors.

## License

MIT
