#!/usr/bin/env bash
#
# Stoppt den InStaff-Stack und alle Cloudflare-Tunnel.
#
#   ./stop-all.sh          # Container stoppen, Volumes bleiben erhalten
#   ./stop-all.sh -v       # zusätzlich Volumes löschen (DB + Keycloak weg!)
#
set -euo pipefail

cd "$(dirname "$0")"
COMPOSE_FILE="docker-compose.pi.yml"

echo "==> Stoppe Cloudflare-Tunnel..."
pkill -f "cloudflared tunnel .*run" 2>/dev/null && echo "    Tunnel gestoppt." || echo "    Keine laufenden Tunnel gefunden."

echo "==> Stoppe Docker-Stack..."
docker compose -f "$COMPOSE_FILE" down "$@"

echo "==> Fertig."
