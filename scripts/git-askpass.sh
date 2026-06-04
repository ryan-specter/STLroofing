#!/usr/bin/env bash
case "$1" in
  Username*) echo "x-access-token" ;;
  Password*) cat "$(dirname "$0")/../.github-token" ;;
esac
