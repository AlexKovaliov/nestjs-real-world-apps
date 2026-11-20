# e-commerce-app

E-commerce backend built with NestJS: REST API, PostgreSQL (TypeORM) and JWT authentication.

## Requirements

- Node.js 24.9+
- PostgreSQL

## Running locally

```bash
cp .env.example .env   # fill in the values
npm install
npm run start:dev
```

The server starts on `http://localhost:3000` (override with the `PORT` variable).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (defaults to `3000`) |
| `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | PostgreSQL connection |
| `JWT_SECRET` | Secret used to sign JWTs |
| `GEMINI_API_KEY` | Google Gemini key used to validate product descriptions |
| `ENCRYPTION_KEY` | AES-256-GCM key for encrypting sensitive data at rest (64 hex chars) |

## Encrypting data at rest

`EncryptionService` (exported from `CommonModule`) encrypts sensitive values with
AES-256-GCM before they are stored. GCM is authenticated encryption, so a modified
ciphertext is rejected on decryption instead of silently producing altered data.

```ts
const stored = encryption.encrypt(user.phone, `users:${user.id}:phone`);
const phone = encryption.decrypt(stored, `users:${user.id}:phone`);
```

- The second argument (`associatedData` / AAD) binds the ciphertext to its row and
  column, so it cannot be copied into another record. Pass the same value when decrypting.
- Stored format: `v1:<iv>:<tag>:<ciphertext>` (base64). Every call uses a fresh random IV.
- Generate a key with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
  The app refuses to start if `ENCRYPTION_KEY` is missing or invalid. Losing the key
  means losing the data, so keep it in a secrets manager, not in the repository.
- Encrypted columns cannot be searched or indexed by value. For lookups (such as
  email login), store a separate HMAC of the value next to the ciphertext.

## Production build

```bash
npm run build
npm run start:prod   # node dist/main
```

## Node.js profiling

Use the built-in V8 profiler to inspect CPU time and call patterns:

```bash
npm run build
npm run start:prof   # node --prof dist/main.js
```

While the app is running, exercise the endpoints you care about (for example authenticated routes that hit `AuthGuard`). Stop the process when finished. Node writes an `isolate-*-v8.log` file in the project root.

Turn that raw log into a readable summary:

```bash
npm run prof:process   # writes profile.txt
```

Open `profile.txt` and look under the bottom-up / top-down sections for hot functions. The `*.log` files are already covered by `.gitignore`.

## Tests

```bash
npm test
```
