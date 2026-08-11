// Runs once on server startup. Automatically provisions the database so the
// platform always boots with the correct schema and seed data — no manual steps.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { ensureSeeded } = await import("./lib/auto-seed");
    const res = await ensureSeeded();
    if (res.seeded) {
      // eslint-disable-next-line no-console
      console.log("[sharifmand] auto-seed: database provisioned with seed data.");
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[sharifmand] auto-seed failed:", e);
  }
}
