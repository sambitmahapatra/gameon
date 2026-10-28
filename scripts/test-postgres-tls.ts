import assert from 'node:assert/strict';
import { X509Certificate } from 'node:crypto';
import { createSecureContext, type ConnectionOptions } from 'node:tls';
import { Client } from 'pg';
import { postgresConfig } from '../src/lib/postgres-config';
import { SUPABASE_ROOT_CA } from '../src/lib/supabase-ca';

const certificate = new X509Certificate(SUPABASE_ROOT_CA);
assert(certificate.ca && certificate.verify(certificate.publicKey));
assert.equal(
  certificate.fingerprint256.replaceAll(':', '').toLowerCase(),
  '807025ad50d4ed219d2c9c7d299c004f824eb00cf7f65afef607d07b72e6cafa',
);
assert(Date.now() < Date.parse(certificate.validTo));

for (const host of [
  'aws-0-eu-north-1.pooler.supabase.com',
  'db.exampleproject.supabase.co',
]) {
  for (const mode of ['verify-full', 'require', 'no-verify', 'disable']) {
    const config = postgresConfig(
      `postgresql://postgres.example:fake%40password@${host}:6543/postgres?sslmode=${mode}&uselibpqcompat=true`,
      '',
    );
    const client = new Client(config);
    // Inspect pg's parsed result, not merely the supplied options: URL SSL
    // arguments previously discarded the configured trust anchor.
    const actual = (
      client as unknown as {
        connectionParameters: { ssl: ConnectionOptions; password: string };
      }
    ).connectionParameters;
    assert.equal(actual.ssl.ca, SUPABASE_ROOT_CA);
    assert.equal(actual.ssl.rejectUnauthorized, true);
    assert.equal(actual.ssl.servername, host);
    assert.equal(actual.password, 'fake@password');
    assert(!new URL(config.connectionString!).searchParams.has('sslmode'));
    createSecureContext(actual.ssl);
  }
}
const other = postgresConfig(
  'postgresql://local:fake@localhost:5432/test?sslmode=disable',
  '',
);
assert.equal(other.ssl, undefined);
assert(new URL(other.connectionString!).searchParams.has('sslmode'));
const lookalike = postgresConfig(
  'postgresql://test:fake@evil-pooler.supabase.com.example.org/test',
  '',
);
assert.equal(lookalike.ssl, undefined);
const custom = postgresConfig(
  'postgresql://test:fake@other.example/test?sslmode=verify-full',
  SUPABASE_ROOT_CA.replaceAll('\n', '\\n'),
);
assert.equal((custom.ssl as ConnectionOptions).ca, SUPABASE_ROOT_CA);
console.log(
  'PostgreSQL TLS passed: verified Supabase CA, pg parsing, hostname verification, encoded passwords, explicit CA override and host scoping.',
);
