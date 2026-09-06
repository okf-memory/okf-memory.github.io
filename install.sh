#!/usr/bin/env sh
# ==============================================================================
# OKF Agent Memory — Universal Installer
# https://okf-memory.dev | https://github.com/okf-memory/okf-agent-memory
# ==============================================================================

set -e

RESET='\033[0m'
BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'

REPO="okf-memory/okf-agent-memory"
VERSION="v0.1.0"
BINARY="okf"

printf "\n${BOLD}${CYAN}🧠 Installing OKF Agent Memory (${VERSION})${RESET}\n"
printf "   The Git-Native Persistent Memory Engine for AI Agents\n\n"

# 1. Detect OS & Architecture
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
  x86_64|amd64)
    ARCH="amd64"
    ;;
  arm64|aarch64)
    ARCH="arm64"
    ;;
  *)
    printf "${RED}✖ Unsupported architecture: %s${RESET}\n" "$ARCH" >&2
    exit 1
    ;;
esac

case "$OS" in
  darwin|linux)
    ;;
  *)
    printf "${RED}✖ Unsupported operating system: %s${RESET}\n" "$OS" >&2
    exit 1
    ;;
esac

printf "   Detected platform: ${BOLD}%s-%s${RESET}\n" "$OS" "$ARCH"

# 2. Check if pre-compiled binary is available on GitHub Releases
TARGET_ASSET="${BINARY}-${OS}-${ARCH}"
RELEASE_URL="https://github.com/${REPO}/releases/download/${VERSION}/${TARGET_ASSET}"

HAS_PREBUILT=0
if command -v curl >/dev/null 2>&1; then
  HTTP_STATUS=$(curl -sIL -o /dev/null -w "%{http_code}" "$RELEASE_URL" 2>/dev/null || echo "000")
  if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
    HAS_PREBUILT=1
  fi
fi

# 3. Installation Strategy
INSTALL_DIR="/usr/local/bin"
USER_INSTALL_DIR="$HOME/.local/bin"

if [ "$HAS_PREBUILT" = "1" ]; then
  printf "   Downloading precompiled binary from GitHub Releases...\n"
  TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'okf-install')"
  trap 'rm -rf "$TMP_DIR"' EXIT

  curl -fsSL "$RELEASE_URL" -o "$TMP_DIR/$BINARY"
  chmod +x "$TMP_DIR/$BINARY"

  if [ -w "$INSTALL_DIR" ]; then
    mv "$TMP_DIR/$BINARY" "$INSTALL_DIR/$BINARY"
    DEST="$INSTALL_DIR/$BINARY"
  else
    mkdir -p "$USER_INSTALL_DIR"
    mv "$TMP_DIR/$BINARY" "$USER_INSTALL_DIR/$BINARY"
    DEST="$USER_INSTALL_DIR/$BINARY"
  fi
elif command -v go >/dev/null 2>&1; then
  printf "   Compiling directly via Go toolchain (${BOLD}go install${RESET})...\n"
  go install "github.com/${REPO}/cmd/okf@${VERSION}"
  GOPATH_BIN="$(go env GOPATH)/bin"
  DEST="$GOPATH_BIN/$BINARY"
else
  printf "\n${YELLOW}⚠ Pre-compiled release assets for %s-%s are currently being published.${RESET}\n" "$OS" "$ARCH"
  printf "   To install OKF Agent Memory right now, please use either:\n\n"
  printf "   ${BOLD}1. Go Toolchain (Recommended):${RESET}\n"
  printf "      go install github.com/%s/cmd/okf@%s\n\n" "$REPO" "$VERSION"
  printf "   ${BOLD}2. Build from Source:${RESET}\n"
  printf "      git clone https://github.com/%s.git\n" "$REPO"
  printf "      cd okf-agent-memory && make build\n\n"
  printf "   ${BOLD}3. Homebrew (macOS / Linux):${RESET}\n"
  printf "      brew install %s/tap/okf\n\n" "$(echo "$REPO" | cut -d/ -f1)"
  exit 1
fi

# 4. Verify Installation
if [ -x "$DEST" ]; then
  printf "\n${GREEN}✔ OKF Agent Memory successfully installed to %s${RESET}\n" "$DEST"
  if command -v okf >/dev/null 2>&1; then
    printf "   Version: "
    okf version || true
  else
    printf "   ${YELLOW}Note:${RESET} Make sure %s is in your PATH environment variable.\n" "$(dirname "$DEST")"
    printf "   Add to ~/.zshrc or ~/.bashrc: export PATH=\"%s:\$PATH\"\n" "$(dirname "$DEST")"
  fi
  printf "\n${BOLD}Quickstart:${RESET}\n"
  printf "   $ okf bootstrap .        # Initialize memory in current project\n"
  printf "   $ okf search \"auth\"      # BM25 in-memory search\n"
  printf "   $ okf mcp knowledge      # Start stdio MCP server for Claude/Cursor\n\n"
else
  printf "${RED}✖ Installation could not be completed.${RESET}\n" >&2
  exit 1
fi
