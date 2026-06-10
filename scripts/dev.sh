#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
avahi-publish-service cohete-de-agua _http._tcp 3000 &
trap "kill $! 2>/dev/null" EXIT
cd "$DIR" && pnpm dev
