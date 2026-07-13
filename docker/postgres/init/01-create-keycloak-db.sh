#!/bin/sh
# Runs automatically via /docker-entrypoint-initdb.d ONLY on first init of an empty
# Postgres data volume. Creates a dedicated database + user for Keycloak alongside
# the app's "demo" database.
#
# KC_DB_PASSWORD is injected as an env var on the postgres service (from .env).
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE USER keycloak WITH PASSWORD '${KC_DB_PASSWORD}';
  CREATE DATABASE keycloak OWNER keycloak;
EOSQL
