# Contributing

## Setup

```bash
npm install
npm run db:seed
npm run dev
git config core.hooksPath .githooks   # optional: format and typecheck on commit
```

## Before you push

```bash
npm run verify
```

## Ground rules

- **TypeScript strict, everywhere.** No `any` escapes, no `@ts-ignore` without a comment
  explaining what is being worked around.
- **Design tokens only.** No raw hex in components except a zone's own `accent_hex`, which
  comes from the database. If a colour is missing, add a token.
- **shadcn-style primitives only.** No second UI library. New primitives go in
  `src/components/ui/` in the same shape as the existing ones.
- **GSAP through `useGSAP`**, and every animation checks `useReducedMotion()` first.
- **Queries live in `src/lib/db.ts`.** Components and routes call helpers; they never
  write SQL.
- **Validation lives in `src/lib/validation.ts`**, shared by the form and the API route, so
  the two cannot disagree.
- **Mobile first.** Check 375px before you call something done.

Design hard rules from the spec, which reviewers will hold you to: no ALL CAPS labels, no
single-word colour accents in headlines, no `01 / 02 / 03` markers unless it is genuinely a
sequence, no "WORD — fragment" labels, no arrows appended to CTAs, no uniform-radius
grey-shadow card kit.

Branching, commit format and the PR process are in [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md).
