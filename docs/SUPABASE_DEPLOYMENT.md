# Deploy GameOn with Supabase and Vercel

The frontend and Next.js API stay together on Vercel. Supabase hosts the PostgreSQL database. The repository now supports both databases:

- `DATABASE_URL` set: PostgreSQL (Supabase).
- `DATABASE_URL` unset outside Vercel: local SQLite demo.
- `DATABASE_URL` unset on Vercel: public venue pages remain browsable, booking offers a contact option, and database APIs return HTTP 503. No local directory is created.

## 1. Create Supabase

1. Create a project at [Supabase](https://supabase.com/dashboard).
2. Choose a strong database password and a region near the Vercel function region.
3. Open **Connect**, select the **Transaction pooler** connection method, and copy the PostgreSQL URI (port **6543**).
4. Replace its password placeholder with your database password. Percent-encode special characters in the password component. Use the database password, not an anon/publishable key or service-role API key.
5. Enable TLS in the URI, for example by appending `?sslmode=verify-full`. If a query string already exists, append `&sslmode=verify-full` instead. For certificate configuration, follow the [Supabase connection documentation](https://supabase.com/docs/guides/database/connecting-to-postgres).

Keep the URI private. Never put it in a `NEXT_PUBLIC_*` variable, GitHub source, screenshots or chat.

## 2. Create the schema and initial content

In this repository, create or edit `.env.local`:

```dotenv
DATABASE_URL="postgresql://postgres.PROJECT_REF:ENCODED_PASSWORD@YOUR_POOLER_HOST:6543/postgres?sslmode=verify-full"
```

Use your actual copied URI; the example contains placeholders. Preserve any other existing environment settings.

From PowerShell in `D:\ENT\GameON`, run:

```powershell
npm ci
npm run db:setup
```

This command loads `.env.local`, applies `scripts/migrations/001-postgres.sql`, and seeds six zones, event definitions and 30 days of hourly slots. It is repeatable and does not delete bookings/members, reset registrations, or free booked slots. Hosted seeds do not add fictional members or occupancy. Event definitions are initial venue content and should be reviewed before launch.

The migration enables Row Level Security on all five tables. The existing Next.js server uses the privileged database-owner connection, and no browser-facing Data API policies are created. This deployment does not require Supabase Auth or Supabase API keys.

### If local PostgreSQL connections time out

Use the browser-based Supabase **SQL Editor → New query**. Paste the entire contents of [SUPABASE_SETUP.sql](SUPABASE_SETUP.sql) and click **Run**. This performs the same schema and reference-data setup without needing a local connection to ports 5432/6543. The final results should show six zones, 2,340 slots and eight events for a fresh project. Keep `DATABASE_URL` configured in Vercel; SQL Editor setup does not connect the deployed app automatically. To regenerate the file after venue-content changes, run `npx tsx scripts/export-supabase-sql.ts`.

Existing local SQLite records are not uploaded by this command. Keep the local file; any real reservations or members there need a separate one-time data import before moving live traffic.

## 3. Configure Vercel

In **GameOn project → Settings → Environment Variables**, set:

| Name                   | Value                                                    |
| ---------------------- | -------------------------------------------------------- |
| `DATABASE_URL`         | The same Supabase transaction-pooler URI                 |
| `ADMIN_KEY`            | Your private staff key; replace the demo default         |
| `NEXT_PUBLIC_SITE_URL` | `https://gameon-roan.vercel.app` (or your custom domain) |

Leave `NEXT_PUBLIC_API_BASE` unset for this website, since its API is on the same origin. `DATABASE_PATH` is a local-development setting and is not needed on Vercel. Add the database variable to the intended Production/Preview environments. Use a separate test database for previews if they should not share live bookings.

Set the framework to Next.js, build command to `npm run build`, and keep the output directory at the framework default. Deploy the updated commit **after** database setup succeeds. Redeploy after changing environment variables; changing them does not update a running deployment.

The three website fonts are bundled in `public/fonts` and loaded with `next/font/local`, so builds do not download fonts from Google. Database reads opt out of prerendering before opening connections, so a production build also does not require a live Supabase connection. Runtime requests still require a reachable, initialized database.

Do not run database setup automatically on every request or build. Normal requests only top up missing future slots once per day per running instance, without overwriting existing records.

## 4. Verify

1. Open the homepage, menu, membership, events and zone pages.
2. Open `/api/zones`, `/api/live-count` and `/api/slots?zoneId=vr-arena&date=YYYY-MM-DD` (use an actual bookable date).
3. Make a test reservation, verify its QR, try booking the same slot again, then cancel the test reservation.
4. Confirm the record in Supabase's Table Editor and check Vercel runtime logs. No `/var/task/data` directory should be accessed.

Local checks:

```powershell
npm run test:postgres
npm run lint
npm run typecheck
npm run build
```

`test:postgres` runs the production PostgreSQL queries against an isolated embedded PostgreSQL engine. It covers schema/seed repeatability, rollback after insert failure, single-slot claims, cancellation/rebooking, membership upserts, event capacity and RLS. It does not test Supabase network access or credentials.

## Troubleshooting

- **Public site loads, booking says online reservations will be available soon / APIs return 503:** `DATABASE_URL` is missing from that deployment. Add it and redeploy.
- **`relation "zones" does not exist`:** run `npm run db:setup` against the same database used by Vercel.
- **Password authentication failed:** check the database password and pooler username from Supabase's Connect panel. Encode special characters in the password.
- **Connection timeout:** check that the project is active and the transaction-pooler host/port are correct. The direct IPv6 endpoint is not interchangeable with the IPv4 pooler endpoint.
- **TLS/certificate error:** follow Supabase's SSL/certificate instructions; do not disable certificate verification as a workaround.

References: [Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres), [node-postgres transactions](https://node-postgres.com/features/transactions).
