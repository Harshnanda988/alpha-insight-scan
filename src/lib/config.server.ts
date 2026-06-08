import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  console.log("[getServerConfig] Loading environment variables...");
  const config = {
    nodeEnv: process.env.NODE_ENV,
    cmcApiKey: process.env.CMC_API_KEY,
    cgApiKey: process.env.CG_API_KEY,
  };

  // Log status (without exposing full keys)
  console.log(`[getServerConfig] NODE_ENV: ${config.nodeEnv}`);
  console.log(`[getServerConfig] CMC_API_KEY: ${config.cmcApiKey ? "PRESENT (masked)" : "MISSING"}`);
  console.log(`[getServerConfig] CG_API_KEY: ${config.cgApiKey ? "PRESENT (masked)" : "MISSING"}`);

  // Only warn in production to avoid blocking dev if keys are missing
  if (process.env.NODE_ENV === "production") {
    if (!config.cmcApiKey) {
      console.error("[getServerConfig] CRITICAL: CMC_API_KEY is missing in production environment!");
    }
  }

  return config;
}
