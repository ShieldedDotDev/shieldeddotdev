#!/usr/bin/env bash

# Build and run the debug server behind Caddy. The local MySQL container is
# started first and every schema migration runs against a clean database before
# the Go process.
# Caddy remains in the foreground; Ctrl-C stops and reaps every local process.

set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mysql_container="shieldeddotdev-local-mysql"
server_pid=""
mysql_started=false

mysql() {
	docker exec --interactive "$mysql_container" mysql --protocol=tcp -h 127.0.0.1 -uadmin -ppassword shielded "$@"
}

cleanup() {
	status=$?
	trap - EXIT INT TERM

	if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then
		kill -TERM "$server_pid" 2>/dev/null || true
		wait "$server_pid" 2>/dev/null || true
	fi
	if [[ "$mysql_started" == true ]]; then
		docker rm --force "$mysql_container" >/dev/null 2>&1 || true
	fi

	exit "$status"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if ! command -v caddy >/dev/null 2>&1; then
	echo "Caddy is required. Install it, then run this script again." >&2
	exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
	echo "Docker is required. Install or start Docker, then run this script again." >&2
	exit 1
fi
if ! docker info >/dev/null 2>&1; then
	echo "The Docker daemon is not available. Start Docker, then run this script again." >&2
	exit 1
fi

cd "$repo_dir"

# A local run always starts with a new container. This also clears an abandoned
# container left behind by an interrupted earlier run.
docker rm --force "$mysql_container" >/dev/null 2>&1 || true
docker run --detach \
	--name "$mysql_container" \
	--publish 127.0.0.1:3306:3306 \
	--env MYSQL_DATABASE=shielded \
	--env MYSQL_USER=admin \
	--env MYSQL_PASSWORD=password \
	--env MYSQL_ROOT_PASSWORD=local-root-password \
	--health-cmd='mysqladmin ping -h localhost -uadmin -ppassword' \
	--health-interval=2s \
	--health-timeout=5s \
	--health-retries=30 \
	--health-start-period=10s \
	mysql:8.4 >/dev/null
mysql_started=true

for ((attempt = 1; attempt <= 60; attempt++)); do
	if docker exec "$mysql_container" mysqladmin --protocol=tcp -h 127.0.0.1 -uadmin -ppassword ping --silent >/dev/null 2>&1; then
		break
	fi
	if ((attempt == 60)); then
		echo "MySQL did not become ready. Inspect it with: docker logs $mysql_container" >&2
		exit 1
	fi
	sleep 1
done

while IFS= read -r migration; do
	migration_name="$(basename "$migration")"
	echo "Applying migration: $migration_name"
	mysql < "$migration"
done < <(find "$repo_dir/schema" -maxdepth 1 -type f -name '[0-9][0-9][0-9]_*.sql' -print | LC_ALL=C sort)

# DebugAuthHandler authenticates this fixed local user. Ensure the foreign-key
# parent exists before the dashboard creates shields or user-level API tokens.
mysql -e "INSERT INTO users (user_id, login, email) VALUES (1, 'debug', 'fake@example.com') ON DUPLICATE KEY UPDATE login = VALUES(login), email = VALUES(email)"

make \
	BIN=shielded-debug \
	BUILDTAGS=debug \
	LDADDIT="-X main.rootHost=local.shielded.dev -X main.apiHost=api.local.shielded.dev -X main.imgHost=img.local.shielded.dev" \
	build

./shielded-debug -run-local=true &
server_pid=$!

echo "Shielded debug server started (pid $server_pid). Starting Caddy; press Ctrl-C to stop Caddy, the server, and MySQL."
caddy run --config "$repo_dir/Caddyfile.local" --adapter caddyfile
