import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzleDb?: ReturnType<typeof drizzle>;
};

function getPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Add it to your environment variables " +
        "(local: .env file — Vercel: Project Settings → Environment Variables) and redeploy.",
    );
  }
  globalForDb.__arenaNextJsPostgresqlPool ??= new Pool({
    connectionString: databaseUrl,
  });
  return globalForDb.__arenaNextJsPostgresqlPool;
}

function getDb() {
  globalForDb.__arenaNextJsDrizzleDb ??= drizzle(getPool());
  return globalForDb.__arenaNextJsDrizzleDb;
}

// Lazy proxy: importing this module never throws, so `next build` can
// collect page data without a configured database. The pool (and the
// DATABASE_URL requirement) is only materialized on first real query.
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
