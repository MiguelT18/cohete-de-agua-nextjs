#!/usr/bin/env bash
# Advertise this machine as cohete-de-agua.local via mDNS
# The ESP32 will auto-discover this server without manual IP configuration
avahi-publish-service cohete-de-agua _http._tcp 3000
