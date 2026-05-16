## Roadmap App — Context

This is a standalone roadmap tracker at https://roadmap-app-gilt.vercel.app. It tracks progress for the **Stratum** project (see `/Users/ayacastro/Documents/Daniel/stratum-app/CONTEXT.md` for the full project context).

- Stack: Next.js 16 + TypeScript + Tailwind v4 + Supabase
- Supabase project: somnolpbvnskoquaoykx (shared with stratum-app)
- Data lives in the `roadmap` table — one JSON blob per row
- GitHub: auto-deploys to Vercel on push

## Hard Rules

- TypeScript everywhere — no `any`
- No `console.log` in production
- Portal-render any popover/dropdown — never `position: absolute` inside `overflow: hidden`
- All monetary display helpers live in stratum-app — don't duplicate here

## macOS Permission Note

If reads fail with EPERM, call `mcp__ccd_directory__request_directory` with path `/Users/ayacastro/Documents/Daniel/roadmap-app` before accessing existing files.
