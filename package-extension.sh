#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="${ROOT_DIR}/dist"
NAME="teams-status-tracker-firefox"
SOURCE_DIR="${ROOT_DIR}/teams-status-tracker-firefox"
MANIFEST_PATH="${SOURCE_DIR}/manifest.json"
VERSION="$(python3 -c "import json; print(json.load(open('${MANIFEST_PATH}', 'r', encoding='utf-8')).get('version','0.0.0'))" 2>/dev/null || echo "0.0.0")"
XPI_PATH="${DIST_DIR}/${NAME}-v${VERSION}.xpi"

mkdir -p "${DIST_DIR}"
rm -f "${XPI_PATH}"

cd "${SOURCE_DIR}"

zip -r "${XPI_PATH}" . \
  -x ".git/*" \
  -x ".gitignore" \
  -x ".DS_Store" \
  -x "**/.DS_Store" \
  -x "__MACOSX/*" \
  -x "**/__MACOSX/*" \
  -x ".vscode/*" \
  -x ".idea/*" \
  -x "dist/*" \
  -x "package-extension.sh" \
  -x "./package-extension.sh" \
  -x "**/package-extension.sh" \
  -x "._*" \
  -x "**/._*" \
  -x "*.log" \
  -x "*.tmp" \
  -x "*.swp"

echo "Package créé: ${XPI_PATH}"
