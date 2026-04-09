#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database (idempotent)..."
node prisma/seed.ts

echo "Starting server..."
exec "$@"
