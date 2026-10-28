export class SlotUnavailableError extends Error {
  constructor() {
    super('That slot was just booked. Pick another?');
    this.name = 'SlotUnavailableError';
  }
}

export class DatabaseConfigurationError extends Error {
  constructor() {
    super(
      'Set DATABASE_URL to the Supabase transaction-pooler connection string, run npm run db:setup, then redeploy. SQLite is only supported outside Vercel.',
    );
    this.name = 'DatabaseConfigurationError';
  }
}
