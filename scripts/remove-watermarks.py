#!/usr/bin/env python3
"""Remove 'Try Pitch' watermarks from portfolio slide images.

The free version of Pitch adds a dark gray "Try Pitch" badge in the bottom-left
corner of exported slides. This script paints over that region with the surrounding
beige background color, preserving original image dimensions.

Usage:
    python3 scripts/remove-watermarks.py            # process all slides
    python3 scripts/remove-watermarks.py --dry-run   # preview without modifying
"""

from pathlib import Path
from PIL import Image, ImageDraw
import sys

PORTFOLIO_ROOT = Path(__file__).resolve().parent.parent / "public" / "portfolio"
CASE_STUDIES = ["atlassian-ai-ops", "chime", "robinhood", "oracle-zine"]
EXPECTED_SIZE = (2880, 1620)
BEIGE = (250, 245, 232)

# Watermark bounding box with 4px padding beyond measured 32..153, 1512..1586
WM_X1, WM_Y1 = 28, 1508
WM_X2, WM_Y2 = 157, 1590

# Minimum non-beige pixels in the region to consider watermark present
DETECTION_THRESHOLD = 50
COLOR_TOLERANCE = 10


def has_watermark(img):
    region = img.crop((WM_X1, WM_Y1, WM_X2 + 1, WM_Y2 + 1))
    pixels = list(region.getdata())
    non_beige = sum(
        1 for r, g, b in pixels
        if abs(r - BEIGE[0]) > COLOR_TOLERANCE
        or abs(g - BEIGE[1]) > COLOR_TOLERANCE
        or abs(b - BEIGE[2]) > COLOR_TOLERANCE
    )
    return non_beige >= DETECTION_THRESHOLD


def remove_watermark(img):
    draw = ImageDraw.Draw(img)
    draw.rectangle([WM_X1, WM_Y1, WM_X2, WM_Y2], fill=BEIGE)
    return img


def collect_slide_files():
    files = []
    for case in CASE_STUDIES:
        slides_dir = PORTFOLIO_ROOT / case / "slides"
        if not slides_dir.exists():
            print(f"  WARNING: {slides_dir} does not exist, skipping")
            continue
        for f in sorted(slides_dir.glob("slide-*.png")):
            files.append(f)
    return files


def main():
    dry_run = "--dry-run" in sys.argv

    files = collect_slide_files()
    print(f"Found {len(files)} slide images to process")
    if dry_run:
        print("DRY RUN — no files will be modified\n")

    stats = {"processed": 0, "skipped_clean": 0, "skipped_size": 0, "errors": 0}

    for filepath in files:
        name = f"{filepath.parent.parent.name}/{filepath.name}"
        try:
            img = Image.open(filepath)

            if img.size != EXPECTED_SIZE:
                print(f"  SKIP (size {img.size}): {name}")
                stats["skipped_size"] += 1
                continue

            if not has_watermark(img):
                print(f"  SKIP (clean): {name}")
                stats["skipped_clean"] += 1
                continue

            if not dry_run:
                img = remove_watermark(img)
                img.save(filepath, "PNG", optimize=True)

            print(f"  {'WOULD REMOVE' if dry_run else 'REMOVED'}: {name}")
            stats["processed"] += 1

        except Exception as e:
            print(f"  ERROR: {name}: {e}")
            stats["errors"] += 1

    print(f"\nDone. Removed: {stats['processed']}, "
          f"Already clean: {stats['skipped_clean']}, "
          f"Wrong size: {stats['skipped_size']}, "
          f"Errors: {stats['errors']}")


if __name__ == "__main__":
    main()
