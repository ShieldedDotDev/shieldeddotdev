# Working in shieldeddotdev

`shieldeddotdev` is a small, single-binary Go web service for creating and serving dynamic README badges. It uses MySQL for persisted users and badges, server-rendered `templ` pages, and a TypeScript browser application bundled into a static ES module.

Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing routing, persistence, authentication, or the public badge/API contracts. It documents the behavior implemented by the current code, including noteworthy constraints.

## Repository map

| Path | Responsibility |
| --- | --- |
| `cmd/shielded/` | Executable entry point, configuration flags, host-based routing, local/production serving, and build metadata. |
| `*.go` at the repository root | HTTP handlers, authentication, SVG badge rendering, color normalization, and embedded static assets. |
| `model/` | MySQL-backed `UserMapper` and `ShieldMapper`; SQL is intentionally kept here rather than in a separate repository layer. |
| `pages/*.templ` | Authoritative `templ` page definitions and shared page components. |
| `pages/*_templ.go` | Generated Go from `templ`; do not hand-edit. |
| `schema/` | MariaDB/MySQL baseline schema and forward-only, numbered SQL migrations. |
| `ts/` | TypeScript source for the home API examples and authenticated dashboard. |
| `scss/` | Authoritative Sass stylesheets. |
| `static/` | Browser assets. `static/main.js` and `static/style/style.css` are generated from `ts/` and `scss/`; other static assets are source assets. |
| `Makefile` | Canonical build, generation, lint, local-debug, clean, and release targets. |

## Development setup

The module declares Go `1.26.2`; use a compatible installed Go toolchain. The frontend tools are development dependencies in `package.json`.

```sh
npm install
go generate ./...
make build
```

`make build` already runs generation and makes the generated CSS and JavaScript prerequisites. It creates a `shielded` executable with build metadata embedded through linker flags.

For the configured local mode:

```sh
make debug
```

This cleans generated assets and binaries, rebuilds with the `debug` build tag, changes the three configured host names to `local.shielded.dev`, `api.local.shielded.dev`, and `img.local.shielded.dev`, then runs `shielded-debug` on `:8686`. The server still needs a reachable MySQL instance; the default DSN is shown by `./shielded -help`.

Useful focused commands:

```sh
go generate ./...                         # regenerate templ Go files
npx sass scss:static/style                 # regenerate static/style/style.css
npx rollup --config rollup.config.mjs      # regenerate static/main.js
make lint                                  # runs TSLint with --fix
go test ./...                              # compile/test all Go packages (there are currently no committed Go test files)
```

`make clean` removes binaries, generated frontend assets, release artifacts, and emitted JavaScript below `ts/`; do not run it merely to inspect a dirty worktree.

## Change rules

### Generated files and assets

- Edit `.templ` files, never `pages/*_templ.go`. Regenerate with `go generate ./...` and include the matching generated files when a template change changes them.
- Edit `ts/`, never `static/main.js`. Regenerate through Rollup and include `static/main.js` when its source changes.
- Edit `scss/`, never `static/style/style.css`. Regenerate through Sass and include the output when styles change.
- The release binary embeds `static/` (`static.go`). A frontend or stylesheet change is therefore part of the binary release.

### Go

- Run `gofmt` on each changed Go file and preserve the existing package split: root package `shieldeddotdev` contains HTTP/application behavior, while `model` contains database access.
- Keep route setup in `cmd/shielded/main.go`; keep request parsing/validation and HTTP responses in the applicable handler.
- Use parameterized SQL through `database/sql`, as the mappers do. Shield reads and writes must preserve the ownership checks used by the dashboard handlers.
- Do not change public JSON field names or badge URL shapes casually. The dashboard, embedded Markdown, and external clients depend on the exported Go/TypeScript field names and host-specific routes.
- Preserve the `NormalizeColor` path for the public update API and static badge route when adding accepted color input. It resolves named badge colors and validates 3- or 6-digit hexadecimal colors.

### Database schema and migrations

- `schema/000_BASELINE.sql` is the dump-derived baseline for a new database. It contains `DROP TABLE` statements, so do not apply it to a database that must retain data.
- Add every schema change as a new forward-only SQL file in `schema/`, using the next zero-padded numeric prefix in application order (for example, `001_add_shield_index.sql`). Never renumber, edit, or reorder an existing migration once it may have been applied.
- Keep migration SQL compatible with the baseline's MariaDB/MySQL dialect and preserve the `users`/`shields` foreign-key relationship unless the corresponding application behavior changes together.
- The repository currently has SQL files but no migration runner. Record/run migrations using the deployment process until a runner is added; do not assume the Go binary applies them automatically.

### TypeScript

- This is framework-free DOM code. Controllers own DOM creation and are attached through `AbstractBaseController`; `ShieldsModel` owns the in-memory shield list and emits rerender events.
- Requests go through `ts/api/request.ts`. It supplies the leading slash and `withCredentials`; use it rather than duplicating XMLHttpRequest handling.
- Keep browser/API types aligned with the JSON emitted from Go. The current API uses Go-style exported field names such as `ShieldID`, `PublicID`, `Title`, and `Secret`.
- The configured TypeScript compiler is strict and rejects unused locals/parameters. Maintain tab indentation and run `make lint` after TypeScript changes.

## Verification expectations

For documentation-only changes, verify links and inspect `git diff --check`. For code changes, run the narrowest relevant generator plus:

```sh
go test ./...
make lint
```

When a change affects routing, authentication, database writes, or generated assets, also build with `make build` (or `make debug` when testing locally). Do not claim a browser, OAuth, or MySQL integration test passed unless it was actually exercised against the required external service.

## Configuration and operational boundaries

- Runtime flags: `-dsn`, `-client-id`, `-client-secret`, `-run-local`, `-local-addr`, and `-log-source`.
- Production uses CertMagic to obtain/serve HTTPS for `shielded.dev`, `www.shielded.dev`, `api.shielded.dev`, and `img.shielded.dev`. Local mode serves HTTP directly and supplies a debug user instead of GitHub OAuth.
- `schema/000_BASELINE.sql` is the current source of truth for provisioning a new MariaDB/MySQL database. Future database changes are ordered migrations in that same directory; the application does not run them automatically.
- Authentication signing keys are generated in process at startup. Restarting the service invalidates existing auth cookies. Treat the GitHub OAuth client secret, database DSN, and badge secrets as sensitive.
- Do not add credentials, production DSNs, generated release archives, or `node_modules/` to version control.

## Current worktree hygiene

Preserve unrelated user changes. In particular, inspect `git status --short` before generating assets because frontend output may already be untracked or modified. Do not overwrite those changes without explicit direction.
