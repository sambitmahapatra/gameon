# Git workflow

Small team, short-lived branches, `main` always deployable.

## Requirements

- Git 2.40 or newer
- Node 20 or newer (`.nvmrc` pins 20; Node 24 also works)
- `core.autocrlf` left **off** — `.gitattributes` normalises line endings to LF in the repo
  and that is the only mechanism we rely on. If you cloned with autocrlf on:

  ```bash
  git config core.autocrlf false
  git rm --cached -r .
  git reset --hard
  ```

## Branches

| Branch | Purpose |
|---|---|
| `main` | Deployable at all times. Protected: no direct pushes once the repo is shared. |
| `feat/<slug>` | A feature, e.g. `feat/booking-wizard` |
| `fix/<slug>` | A bug fix, e.g. `fix/slot-timezone` |
| `chore/<slug>` | Tooling, deps, config |
| `docs/<slug>` | Documentation only |

Branch off the latest `main`, rebase rather than merge to stay current:

```bash
git switch main && git pull --ff-only
git switch -c feat/zone-gallery
# …work…
git fetch origin && git rebase origin/main
```

## Commits

[Conventional Commits](https://www.conventionalcommits.org): `type(scope): subject`.

Types in use: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `style`, `test`, `build`.

- Subject in the imperative, lower case, no trailing full stop, 72 characters or fewer
- Body explains **why**, wrapped at 80 characters, when the diff does not make it obvious
- One logical change per commit. Formatting-only churn goes in its own `style:` commit

```
feat(booking): hold the slot inside the insert transaction

Two people confirming the same slot could both get a booking row. The slot
flip is now the lock, so the loser gets a 409 and a refreshed grid.
```

## What never gets committed

Enforced by `.gitignore`, but worth knowing:

- `data/*.db` and the WAL sidecars — the database is generated, never shared
- `.env`, `.env.local` — only `.env.example` is tracked
- `.next/`, `out/`, `node_modules/`
- `android/`, `*.apk`, `*.aab`, `*.keystore` — Capacitor output and signing keys.
  **A leaked keystore cannot be rotated for an already-published app.**

## Before you push

```bash
npm run verify     # lint + typecheck + build
```

Optional local hook that runs the same checks on commit:

```bash
git config core.hooksPath .githooks
```

`.githooks/pre-commit` is tracked, so every clone can opt in with that one command.

## Pull requests

- One PR per branch, titled like a commit subject
- Fill in `.github/pull_request_template.md`: what changed, how it was tested, screenshots
  for anything visual at 375px and 1440px
- CI (`.github/workflows/ci.yml`) runs lint, typecheck and both builds. Green before merge
- Squash merge, so `main` keeps one commit per PR

## Releases

Tag `main` when a build is handed in or deployed:

```bash
git tag -a v0.1.0 -m "Pitch demo build"
git push origin v0.1.0
```

APKs are attached to the GitHub release, never committed to the repo.
