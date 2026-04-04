#!/usr/bin/env bash
# deploy.sh — NutriSutra production deployment to Hetzner (5.223.67.236)
# Usage: bash deploy.sh
set -euo pipefail

SERVER="root@5.223.67.236"
APP_DIR="/opt/nutrisutra"
DOMAIN="nutrisutra.srpailabs.com"

echo "══════════════════════════════════════════"
echo "  NutriSutra Deployment"
echo "══════════════════════════════════════════"

# ── 1. Build frontend locally ──────────────────────────
echo "▸ Building frontend..."
npm install --legacy-peer-deps
npm run build

# ── 2. Sync project to server ─────────────────────────
echo "▸ Syncing files to server..."
ssh "$SERVER" "mkdir -p $APP_DIR"

# Sync dist (frontend build)
rsync -az --delete dist/ "$SERVER:$APP_DIR/dist/"

# Sync backend
rsync -az --delete \
  --exclude='__pycache__' \
  --exclude='.venv' \
  --exclude='*.pyc' \
  backend/ "$SERVER:$APP_DIR/backend/"

# Sync docker-compose and .env
rsync -az docker-compose.yml "$SERVER:$APP_DIR/"
rsync -az .env "$SERVER:$APP_DIR/.env"

# Sync nginx config
rsync -az nginx/nutrisutra.srpailabs.com.conf "$SERVER:/etc/nginx/sites-available/$DOMAIN"

# ── 3. Configure server ───────────────────────────────
echo "▸ Configuring server..."
ssh "$SERVER" bash -s <<'REMOTE'
set -euo pipefail

DOMAIN="nutrisutra.srpailabs.com"
APP_DIR="/opt/nutrisutra"

# Enable nginx site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

# Build & start backend
cd $APP_DIR
docker compose up -d --build

echo "▸ Waiting for backend to start..."
for i in {1..15}; do
  if curl -sf http://127.0.0.1:8030/health >/dev/null 2>&1; then
    echo "✓ Backend is healthy!"
    break
  fi
  sleep 2
done

docker compose ps
REMOTE

echo ""
echo "══════════════════════════════════════════"
echo "  ✓ Deployed to https://$DOMAIN"
echo "══════════════════════════════════════════"
