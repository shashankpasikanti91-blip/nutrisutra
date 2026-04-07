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
ssh "$SERVER" "mkdir -p $APP_DIR $APP_DIR/data"

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

# Ensure certbot is installed
if ! command -v certbot &>/dev/null; then
  apt-get install -y certbot python3-certbot-nginx
fi

# Enable nginx site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN

# Issue / renew Let's Encrypt cert (non-interactive)
# Uses webroot if cert already exists; standalone on first run
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  certbot renew --quiet --nginx
  echo "✓ SSL cert renewed"
else
  # Temporarily serve HTTP on 80 for cert challenge
  # Disable the HTTPS server block temporarily so port 80 is free
  certbot certonly --nginx --non-interactive --agree-tos \
    --email admin@srpailabs.com \
    -d "$DOMAIN" \
    --redirect
  echo "✓ SSL cert issued"
fi

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
