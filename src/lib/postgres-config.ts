import type { PoolConfig } from 'pg';
import { SUPABASE_ROOT_CA } from './supabase-ca';

/** pg's URL SSL parameters replace ssl.ca, so configure verified TLS explicitly. */
export function postgresConfig(
  connectionString: string,
  customCa = process.env.DATABASE_SSL_CA,
): PoolConfig {
  const url = new URL(connectionString);
  const supabase =
    url.hostname.endsWith('.pooler.supabase.com') ||
    /^db\.[a-z0-9]+\.supabase\.co$/.test(url.hostname);
  const base = {
    max: 3,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 20_000,
    allowExitOnIdle: true,
  };
  if (!supabase && !customCa) return { ...base, connectionString };

  // Only known Supabase database hosts automatically trust Supabase's CA.
  // No global trust-store changes or certificate-verification bypasses.
  for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert', 'uselibpqcompat'])
    url.searchParams.delete(key);
  return {
    ...base,
    connectionString: url.toString(),
    ssl: {
      ca: customCa ? customCa.replace(/\\n/g, '\n') : SUPABASE_ROOT_CA,
      rejectUnauthorized: true,
      servername: url.hostname,
      minVersion: 'TLSv1.2',
    },
  };
}
