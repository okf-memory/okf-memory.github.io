#!/usr/bin/env bash
# ==============================================================================
# OKF Agent Memory — Release Version Bump Automation
# Usage:
#   ./scripts/bump-version.sh <new_version> [--push]
# Example:
#   ./scripts/bump-version.sh v0.1.3
#   ./scripts/bump-version.sh v0.1.3 --push
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

RESET='\033[0m'
BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'

# Help / usage
if [ $# -lt 1 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  printf "\n${BOLD}${CYAN}OKF Agent Memory — Release Version Bumper${RESET}\n"
  printf "Usage: %s <new_version> [--push]\n\n" "$0"
  printf "Arguments:\n"
  printf "  <new_version>   The target semantic release version (e.g. v0.1.3 or 0.1.3)\n"
  printf "  --push          Automatically stage, commit, and git push changes\n\n"
  exit 0
fi

RAW_VERSION="$1"
DO_PUSH=false

if [ $# -ge 2 ] && [ "$2" = "--push" ]; then
  DO_PUSH=true
fi

# Normalize version string (ensure 'v' prefix)
case "$RAW_VERSION" in
  v*) NEW_VERSION="$RAW_VERSION" ;;
  *)  NEW_VERSION="v$RAW_VERSION" ;;
esac

# 1. Read current version from version.json
VERSION_FILE="$ROOT_DIR/version.json"
if [ ! -f "$VERSION_FILE" ]; then
  printf "${RED}✖ Error: version.json not found in %s${RESET}\n" "$ROOT_DIR" >&2
  exit 1
fi

OLD_VERSION=$(python3 -c "import json; print(json.load(open('$VERSION_FILE'))['version'])" 2>/dev/null || grep -o '"version": "[^"]*"' "$VERSION_FILE" | cut -d'"' -f4)

if [ -z "$OLD_VERSION" ]; then
  printf "${RED}✖ Error: Could not parse current version from version.json${RESET}\n" >&2
  exit 1
fi

printf "\n${BOLD}${CYAN}🚀 Bumping OKF Agent Memory Release${RESET}\n"
printf "   Current: ${YELLOW}%s${RESET}\n" "$OLD_VERSION"
printf "   Target:  ${GREEN}%s${RESET}\n\n" "$NEW_VERSION"

if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
  printf "${YELLOW}⚠ Target version is identical to current version (%s). Nothing to bump.${RESET}\n" "$OLD_VERSION"
  exit 0
fi

# 2. Update version.json
NOW_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
python3 - <<EOF
import json

path = "$VERSION_FILE"
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['version'] = "$NEW_VERSION"
data['updated_at'] = "$NOW_ISO"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
EOF
printf "  ${GREEN}✔${RESET} Updated %s\n" "version.json"

# 3. Update install.sh
if [ -f "$ROOT_DIR/install.sh" ]; then
  sed -i '' "s/VERSION=\"$OLD_VERSION\"/VERSION=\"$NEW_VERSION\"/g" "$ROOT_DIR/install.sh" 2>/dev/null || \
  sed -i "s/VERSION=\"$OLD_VERSION\"/VERSION=\"$NEW_VERSION\"/g" "$ROOT_DIR/install.sh"
  printf "  ${GREEN}✔${RESET} Updated %s\n" "install.sh"
fi

# 4. Update app.js (go install snippet)
if [ -f "$ROOT_DIR/app.js" ]; then
  sed -i '' "s/@$OLD_VERSION/@$NEW_VERSION/g" "$ROOT_DIR/app.js" 2>/dev/null || \
  sed -i "s/@$OLD_VERSION/@$NEW_VERSION/g" "$ROOT_DIR/app.js"
  printf "  ${GREEN}✔${RESET} Updated %s\n" "app.js"
fi

# 5. Update index.html
if [ -f "$ROOT_DIR/index.html" ]; then
  sed -i '' "s/Release $OLD_VERSION/Release $NEW_VERSION/g" "$ROOT_DIR/index.html" 2>/dev/null || \
  sed -i "s/Release $OLD_VERSION/Release $NEW_VERSION/g" "$ROOT_DIR/index.html"

  sed -i '' "s/releases\/tag\/$OLD_VERSION/releases\/tag\/$NEW_VERSION/g" "$ROOT_DIR/index.html" 2>/dev/null || \
  sed -i "s/releases\/tag\/$OLD_VERSION/releases\/tag\/$NEW_VERSION/g" "$ROOT_DIR/index.html"

  sed -i '' "s/>$OLD_VERSION<\/a>/>$NEW_VERSION<\/a>/g" "$ROOT_DIR/index.html" 2>/dev/null || \
  sed -i "s/>$OLD_VERSION<\/a>/>$NEW_VERSION<\/a>/g" "$ROOT_DIR/index.html"
  printf "  ${GREEN}✔${RESET} Updated %s\n" "index.html"
fi

# 6. Update README.md
if [ -f "$ROOT_DIR/README.md" ]; then
  sed -i '' "s/$OLD_VERSION Release/$NEW_VERSION Release/g" "$ROOT_DIR/README.md" 2>/dev/null || \
  sed -i "s/$OLD_VERSION Release/$NEW_VERSION Release/g" "$ROOT_DIR/README.md"

  sed -i '' "s/releases\/tag\/$OLD_VERSION/releases\/tag\/$NEW_VERSION/g" "$ROOT_DIR/README.md" 2>/dev/null || \
  sed -i "s/releases\/tag\/$OLD_VERSION/releases\/tag\/$NEW_VERSION/g" "$ROOT_DIR/README.md"
  printf "  ${GREEN}✔${RESET} Updated %s\n" "README.md"
fi

# 7. Update assets/og-preview.svg
if [ -f "$ROOT_DIR/assets/og-preview.svg" ]; then
  sed -i '' "s/Release $OLD_VERSION/Release $NEW_VERSION/g" "$ROOT_DIR/assets/og-preview.svg" 2>/dev/null || \
  sed -i "s/Release $OLD_VERSION/Release $NEW_VERSION/g" "$ROOT_DIR/assets/og-preview.svg"
  printf "  ${GREEN}✔${RESET} Updated %s\n" "assets/og-preview.svg"
fi

# 8. Re-render SVG to PNG if a renderer is available
printf "\n${BOLD}Rendering OpenGraph Preview Image:${RESET}\n"
RENDERED=false

if command -v resvg >/dev/null 2>&1; then
  resvg "$ROOT_DIR/assets/og-preview.svg" "$ROOT_DIR/assets/og-preview.png" -w 1200 -h 630
  printf "  ${GREEN}✔${RESET} Generated assets/og-preview.png via resvg\n"
  RENDERED=true
elif command -v rsvg-convert >/dev/null 2>&1; then
  rsvg-convert -w 1200 -h 630 "$ROOT_DIR/assets/og-preview.svg" -o "$ROOT_DIR/assets/og-preview.png"
  printf "  ${GREEN}✔${RESET} Generated assets/og-preview.png via rsvg-convert\n"
  RENDERED=true
else
  printf "  ${YELLOW}ℹ Note:${RESET} Neither 'resvg' nor 'rsvg-convert' installed.\n"
  printf "    Run 'brew install resvg' to enable automatic PNG re-generation.\n"
fi

# 9. Git commit & push if requested
if [ "$DO_PUSH" = true ]; then
  printf "\n${BOLD}Git Staging & Push:${RESET}\n"
  git add version.json install.sh app.js index.html README.md assets/og-preview.svg
  if [ -f "$ROOT_DIR/assets/og-preview.png" ] && [ "$RENDERED" = true ]; then
    git add "$ROOT_DIR/assets/og-preview.png"
  fi

  COMMIT_MSG="chore(release): bump version from $OLD_VERSION to $NEW_VERSION"
  git commit -m "$COMMIT_MSG"
  printf "  ${GREEN}✔${RESET} Committed: %s\n" "$COMMIT_MSG"

  CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")"
  git push origin "$CURRENT_BRANCH"
  printf "  ${GREEN}✔${RESET} Pushed to origin/%s\n" "$CURRENT_BRANCH"
else
  printf "\n${CYAN}Done! To commit and push, run:${RESET}\n"
  printf "  git commit -am \"chore(release): bump to %s\" && git push\n" "$NEW_VERSION"
  printf "${DIM}Or use '--push' next time: %s %s --push${RESET}\n\n" "$0" "$NEW_VERSION"
fi
