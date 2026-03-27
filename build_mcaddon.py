#!/usr/bin/env python3
"""Cross-platform builder for Bedrock mcaddon packages (no pip deps)."""

from __future__ import annotations

from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parent
BUILD = ROOT / "build"
BP_DIR = ROOT / "MorphBP"
RP_DIR = ROOT / "MorphRP"

BP_PACK = BUILD / "MorphBP.mcpack"
RP_PACK = BUILD / "MorphRP.mcpack"
ADDON = BUILD / "MorphAddon_v1.0.0.mcaddon"


def zip_dir(source_dir: Path, target_zip: Path) -> None:
    with ZipFile(target_zip, "w", compression=ZIP_DEFLATED) as zf:
        for file in source_dir.rglob("*"):
            if file.is_file():
                zf.write(file, arcname=file.relative_to(source_dir))


def main() -> None:
    BUILD.mkdir(parents=True, exist_ok=True)
    for f in (BP_PACK, RP_PACK, ADDON):
        if f.exists():
            f.unlink()

    zip_dir(BP_DIR, BP_PACK)
    zip_dir(RP_DIR, RP_PACK)

    with ZipFile(ADDON, "w", compression=ZIP_DEFLATED) as zf:
        zf.write(BP_PACK, arcname=BP_PACK.name)
        zf.write(RP_PACK, arcname=RP_PACK.name)

    print(f"Created: {ADDON}")


if __name__ == "__main__":
    main()
