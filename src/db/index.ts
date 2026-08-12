import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzleDb?: ReturnType<typeof drizzle>;
};

let noopWarned = false;

function createNoopDb(): any {
  // Chainable no-op that resolves every awaited query to [] — lets pages
  // render (with empty DB sections) when DATABASE_URL is not configured,
  // instead of crashing the whole site with a 500.
  return new Proxy(function () {}, {
    get(_t, prop) {
      if (prop === "then") {
        return (resolve: (v: unknown) => void) => resolve([]);
      }
      if (prop === Symbol.toStringTag) return "NoopDb";
      return createNoopDb();
    },
    apply() {
      return createNoopDb();
    },
  });
}

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
    max: 5,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });
  return globalForDb.__arenaNextJsPostgresqlPool;
}

function getDb() {
  if (!globalForDb.__arenaNextJsDrizzleDb) {
    if (!process.env.DATABASE_URL) {
      if (!noopWarned) {
        noopWarned = true;
        // eslint-disable-next-line no-console
        console.warn(
          "[sharifmand] DATABASE_URL is not set — running in degraded mode (DB sections will be empty).",
        );
      }
      globalForDb.__arenaNextJsDrizzleDb = createNoopDb() as ReturnType<typeof drizzle>;
    } else {
      globalForDb.__arenaNextJsDrizzleDb = drizzle(getPool());
    }
  }
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
