#!/usr/bin/env bash
#
# EINMALIGES Seeding der Demo-Daten für das persistente Deployment.
#
# Voraussetzung: Der Stack läuft bereits (docker compose up -d) und Hibernate hat mit
# generation=update das leere App-Schema in der "demo"-DB angelegt.
#
# Was passiert:
#   1. Lädt db/import.sql einmalig in die "demo"-Datenbank.
#   2. Startet das Backend neu -> EmployeeKeycloakSync legt die Keycloak-User an und
#      persistiert deren IDs (danach idempotent).
#
# NUR EINMAL ausführen. Danach ist alles persistent; die Daten bleiben über Neustarts.
#
set -euo pipefail
cd "$(dirname "$0")"

COMPOSE_FILE="docker-compose.pi.yml"
IMPORT_SQL="backend-new/src/main/resources/db/import.sql"

echo "==> Lade Demo-Daten in die 'demo'-Datenbank..."
docker exec -i instaff-postgres psql -U demo -d demo < "$IMPORT_SQL"

echo "==> Starte Backend neu (Keycloak-User-Sync)..."
docker compose -f "$COMPOSE_FILE" restart backend

echo "==> Fertig. Seeding einmalig erledigt – ab jetzt persistent."
