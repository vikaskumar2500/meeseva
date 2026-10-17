# ISE Backend

Express + TypeScript backend with JWT authentication, MongoDB persistence, reusable application data storage, and tracking timelines.

## Scripts

- `pnpm dev` - start the API in watch mode
- `pnpm build` - compile TypeScript to `dist`
- `pnpm start` - run the compiled server
- `pnpm lint` - run ESLint
- `pnpm format` - run Prettier

## Environment

Copy `.env.example` to `.env` and configure:

- `MONGODB_URI`
- `MONGODB_USER` and `MONGODB_PASS` if your MongoDB instance requires authentication
- `MONGODB_AUTH_SOURCE` if your MongoDB user authenticates against a different database
- `JWT_SECRET`
- `PORT`

## Integration Tests

The integration tests use a real MongoDB test database connection instead of downloading an in-memory MongoDB binary.

Run a MongoDB instance locally or start the test compose file, then execute:

```bash
pnpm test
```

Or with Docker:

```bash
docker compose -f docker-compose.test.yml up --build
```
