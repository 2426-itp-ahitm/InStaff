#!/usr/bin/env bash
#
# Startet den kompletten InStaff-Stack auf dem Raspberry Pi:
#   1. docker compose (detached)
#   2. alle Cloudflare-Tunnel: auth, mail, api, web
#
# Aufruf:
#   ./start-all.sh              # startet Stack + Tunnel
#   ./start-all.sh --build      # baut die Images vorher neu
#
set -euo pipefail

# Ins Verzeichnis dieses Scripts wechseln (= Repo-Root)
cd "$(dirname "$0")"

COMPOSE_FILE="docker-compose.pi.yml"

# --- Cloudflare-Tunnel-Namen -------------------------------------------------
# An die Ausgabe von `cloudflared tunnel list` anpassen!
TUNNELS=(auth mail api web)

# Optionale per-Tunnel-Configs unter ~/.cloudflared/<name>.yml werden automatisch
# verwendet, falls vorhanden.
CONFIG_DIR="$HOME/.cloudflared"
LOG_DIR="$HOME/cloudflared-logs"
mkdir -p "$LOG_DIR"

# --- 1) Docker-Stack ---------------------------------------------------------
echo "==> Starte Docker-Stack (detached)..."
docker compose -f "$COMPOSE_FILE" up -d "$@"

# --- 2) Cloudflare-Tunnel ----------------------------------------------------
echo "==> Starte Cloudflare-Tunnel: ${TUNNELS[*]}"
for t in "${TUNNELS[@]}"; do
  if pgrep -f "cloudflared tunnel .*run.* $t" >/dev/null 2>&1; then
    echo "    - $t läuft bereits, überspringe"
    continue
  fi

  cfg="$CONFIG_DIR/$t.yml"
  if [[ -f "$cfg" ]]; then
    nohup cloudflared tunnel --config "$cfg" run "$t" > "$LOG_DIR/$t.log" 2>&1 &
  else
    nohup cloudflared tunnel run "$t" > "$LOG_DIR/$t.log" 2>&1 &
  fi
  echo "    - $t gestartet (PID $!, Log: $LOG_DIR/$t.log)"
done

echo
echo "==> Fertig. Status:"
docker compose -f "$COMPOSE_FILE" ps
echo
echo "Tunnel-Logs live ansehen:  tail -f $LOG_DIR/<name>.log"
echo "Alles stoppen:             ./stop-all.sh"
