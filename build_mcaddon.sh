#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$ROOT_DIR/build"

rm -f "$BUILD_DIR"/*.mcpack "$BUILD_DIR"/*.mcaddon
mkdir -p "$BUILD_DIR"

(
  cd "$ROOT_DIR/MorphBP"
  zip -qr "$BUILD_DIR/MorphBP.mcpack" .
)

(
  cd "$ROOT_DIR/MorphRP"
  zip -qr "$BUILD_DIR/MorphRP.mcpack" .
)

TMP_DIR="$BUILD_DIR/.mcaddon_tmp"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
cp "$BUILD_DIR/MorphBP.mcpack" "$TMP_DIR/"
cp "$BUILD_DIR/MorphRP.mcpack" "$TMP_DIR/"

(
  cd "$TMP_DIR"
  zip -qr "$BUILD_DIR/MorphAddon_v1.0.0.mcaddon" .
)

rm -rf "$TMP_DIR"

echo "Created: $BUILD_DIR/MorphAddon_v1.0.0.mcaddon"
