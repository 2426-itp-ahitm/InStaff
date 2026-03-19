#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
OUTPUT_FILE="$SCRIPT_DIR/demo-backup-$TIMESTAMP.sql"

docker compose -f "$PROJECT_ROOT/docker-compose.yml" exec -T postgres \
  pg_dump -U demo demo > "$OUTPUT_FILE"

echo "Database exported to: $OUTPUT_FILE"
