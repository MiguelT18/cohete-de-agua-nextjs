#!/usr/bin/env bash
# Advertise this machine as cohete-de-agua.local via mDNS
# The ESP32 will auto-discover this server without manual IP configuration
set -e
IP="$(ip route get 1 | awk '{print $7; exit}')"
avahi-publish-address cohete-de-agua "$IP" &
avahi-publish-service cohete-de-agua _http._tcp 3000 &
echo "mDNS: cohete-de-agua → $IP:3000"
wait
