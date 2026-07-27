# Shielded.dev

[![CI](https://github.com/ShieldedDotDev/shieldeddotdev/actions/workflows/ci.yml/badge.svg)](https://github.com/ShieldedDotDev/shieldeddotdev/actions/workflows/ci.yml)
![Last Update](https://img.shielded.dev/s/ewh)

Free badges for your README files. Make a badge. Put it in a project. Update it when your work changes.

## Start with Shielded.dev

Use the hosted service unless you need to run your own copy. It is free. It is ready at [shielded.dev](https://shielded.dev).

1. Visit [shielded.dev](https://shielded.dev).
2. Sign in with GitHub.
3. Create a shield.
4. Copy the Markdown from the shield page into your README.

Your public badge uses a stable image address like this:

```md
![Build](https://img.shielded.dev/s/your-public-id)
```

The shield page gives you the real address. It also gives you a private update token. Keep that token out of your README, source code, public logs.

### Update a shield from a script

Use the shield token when a script needs to update one shield.

```sh
curl -X POST https://api.shielded.dev/ \
  -H 'Authorization: token <your-shield-token>' \
  --data-urlencode 'title=Build' \
  --data-urlencode 'text=passing' \
  --data-urlencode 'color=00aa55'
```

You can change `title`, `text`, `color`. Leave out any value you do not want to change.

### Update several shields

The **User tokens** page can create a token for several shields. Give each shield a key. Use that key with the user token.

```sh
curl -X POST https://api.shielded.dev/ \
  -H 'Authorization: token <your-full-user-token>' \
  --data-urlencode 'shield_key=main-build' \
  --data-urlencode 'text=passing'
```

If the key does not exist yet, Shielded.dev creates the shield for you. A user token starts with `sdu_`. A shield token does not use `shield_key`.

There is also a [command line tool](https://github.com/ShieldedDotDev/shielded-cli-js) plus a [GitHub Action](https://github.com/ShieldedDotDev/shielded-action).

## Run your own copy

The hosted service is the easy path. Run your own copy when you need control over the service, data, host names.

You need:

- Go 1.26.2 or newer
- Node.js
- MySQL 8
- a GitHub sign-in application
- three public host names: one for the site, one for updates, one for badge images

Start with a new database. `schema/000_BASELINE.sql` removes its tables before it creates them. Do not use it on a database that holds data you need.

```sh
for file in schema/[0-9][0-9][0-9]_*.sql; do
	mysql shielded < "$file"
done
```

Use your normal MySQL login details for those commands. The loop starts with the baseline. It applies every later numbered file in order.

Build the program with your three public host names. This follows the same `-X` pattern used by the Makefile for local work.

```sh
git clone https://github.com/ShieldedDotDev/shieldeddotdev.git
cd shieldeddotdev
npm install

make LDADDIT="-X main.rootHost=badges.example.com -X main.apiHost=updates.example.com -X main.imgHost=images.example.com" build
```

Point those names at your server. Also point `www.badges.example.com` at it. The program sends that name to `badges.example.com`.

Create a GitHub sign-in application. Set its return address to:

```text
https://badges.example.com/github/callback
```

Then start the program with your database details plus the GitHub application values.

```sh
./shielded \
  -run-local=false \
  -dsn 'user:password@tcp(database-host:3306)/shielded?parseTime=true' \
  -client-id '<github-client-id>' \
  -client-secret '<github-client-secret>'
```

In this mode the program gets certificates for the three public names itself. Let web traffic reach the server on ports 80 and 443.

## Work on a local copy

For local work, install Go, Node.js, Docker, Caddy. Then follow the host-file plus local certificate notes in [Caddyfile.local](Caddyfile.local). Run:

```sh
./run-local.sh
```

The script starts a fresh MySQL container, applies the schema files, starts the program, starts Caddy. Visit [https://local.shielded.dev/](https://local.shielded.dev/). Press Control-C when you are done. The script stops every local service.

## Project notes

[ARCHITECTURE.md](ARCHITECTURE.md) describes the routes, data, sign-in flow, build steps. [AGENTS.md](AGENTS.md) has notes for people changing the code.

Useful checks:

```sh
make lint
go test ./...
```
