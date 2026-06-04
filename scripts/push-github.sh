#!/usr/bin/env bash
# One-time push helper. Put your GitHub PAT in .github-token (gitignored), then run:
#   bash scripts/push-github.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .github-token ]]; then
  echo "Missing .github-token — add a single-use PAT, then re-run." >&2
  exit 1
fi

git remote add origin https://github.com/ryan-specter/STLroofing.git 2>/dev/null || \
  git remote set-url origin https://github.com/ryan-specter/STLroofing.git

export GIT_ASKPASS="$PWD/scripts/git-askpass.sh"
export GIT_TERMINAL_PROMPT=0
git push -u origin main

rm -f .github-token
echo "Pushed to origin/main. Revoke the PAT on GitHub if you have not already."
