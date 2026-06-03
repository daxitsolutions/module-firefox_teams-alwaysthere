#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="${ROOT_DIR}/sources"
DIST_DIR="${ROOT_DIR}/dist"
MANIFEST_PATH="${SOURCE_DIR}/manifest.json"
NAME="teams-alwaysthere-firefox"
VERSION="$(python3 -c "import json; print(json.load(open('${MANIFEST_PATH}', 'r', encoding='utf-8')).get('version', '0.0.0'))" 2>/dev/null || echo "0.0.0")"
XPI_PATH="${DIST_DIR}/${NAME}-v${VERSION}.xpi"

if [[ ! -f "${MANIFEST_PATH}" ]]; then
  echo "Manifest introuvable: ${MANIFEST_PATH}" >&2
  exit 1
fi

mkdir -p "${DIST_DIR}"
rm -f "${XPI_PATH}"

cd "${SOURCE_DIR}"

zip -r "${XPI_PATH}" . \
  -x ".DS_Store" \
  -x "**/.DS_Store" \
  -x "__MACOSX/*" \
  -x "**/__MACOSX/*" \
  -x "._*" \
  -x "**/._*" \
  -x "*.log" \
  -x "*.tmp" \
  -x "*.swp"

echo "Package créé: ${XPI_PATH}"
