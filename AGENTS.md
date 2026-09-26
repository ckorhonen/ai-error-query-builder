# AI Error Query Builder Instructions

This is a Vite/React TypeScript app that turns error descriptions into Sentry, Datadog, Elasticsearch, or Splunk query syntax. The current converter is deterministic and local in `src/utils/queryParser.ts`; do not describe it as a live LLM integration unless a real server-side provider path has been implemented and verified.

## Repository Map

- `src/components/` owns the query-builder UI, platform selection, result rendering, loading, and error boundaries.
- `src/utils/queryParser.ts` owns conversion and platform-specific syntax validation; `src/types/` holds shared contracts, while `src/test/` and nearby `__tests__/` directories hold Vitest setup and fixtures.
- `src/utils/config.ts` reads public Vite configuration. `functions/tsconfig.json` is reserved for Cloudflare Worker-compatible function code when that surface is added.
- `wrangler.toml` defines compatibility settings only; the checked-in GitHub workflow deploys to Vercel after a push to `main`.

## Setup and Verification

- `package.json` declares Node.js 18+ and npm 9+, but the committed lockfile includes `jsdom` 27.4.0, which requires Node `^20.19.0 || ^22.12.0 || >=24.0.0`. Use Node 22.12+ or 24+ for a compatible locked install, then run `npm ci`; the Node 18 CI baseline is stale and does not prove the current dependency graph can install there.
- Use `npm run dev` for the Vite server on port 3000. For a code change, run the relevant `npm run test`, then `npm run lint`, `npm run format:check`, `npm run type-check`, and `npm run build` when the touched code warrants each check.
- Keep a platform's parser output and validation rules aligned, and add or update a focused Vitest case for changes to conversion rules, validation, clipboard handling, or component behavior.
- Complete work with the smallest applicable checks and report what was executed, plus any browser or deployment behavior that remains unverified.

## Security and Release Boundaries

- Vite exposes `VITE_*` values in client bundles. Never place provider API keys, tokens, or other secrets in `VITE_*` variables, source, test fixtures, browser logs, or build output; use an authenticated server-side boundary for any future provider integration.
- Follow applicable authorization and operational gates for pushes to `main`, Vercel deployment, provider calls, or configuration changes, with existing permission remaining valid within its scope. The deployment workflow means a successful local build is not production evidence.
