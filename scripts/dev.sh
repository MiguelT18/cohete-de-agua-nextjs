#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Get the primary IP address (the one used to reach the default gateway)
IP="$(ip route get 1 | awk '{print $7; exit}')"

# Publish hostname so ESP32 can find us via queryHost("cohete-de-agua")
avahi-publish-address cohete-de-agua "$IP" &

# Publish service so ESP32 can find us via queryService("http", "tcp")
avahi-publish-service cohete-de-agua _http._tcp 3000 &

trap "pkill -f 'avahi-publish' 2>/dev/null; exit" EXIT
cd "$DIR" && pnpm dev
