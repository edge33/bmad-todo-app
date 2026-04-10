#!/bin/sh
set -e

echo "Seeding database (idempotent)..."
node prisma/seed.ts

echo "Starting server..."
exec "$@"
