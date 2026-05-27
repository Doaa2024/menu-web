#!/usr/bin/env bash
set -e

# Render provides $PORT (defaults to 10000). Point Apache at it.
PORT="${PORT:-10000}"
sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Make uploaded files reachable and run migrations against the production DB.
php artisan storage:link || true
php artisan migrate --force

# Cache config/routes for performance (safe to ignore if nothing to cache).
php artisan config:cache
php artisan route:cache

exec apache2-foreground
