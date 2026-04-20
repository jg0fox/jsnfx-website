"""
Extract embedded images from the Hello Anthropic portfolio PDF.
Outputs individual images per case study, filtered and deduplicated.
"""

import fitz
import os
import hashlib
from collections import Counter

PDF_PATH = "/Users/jfox/Desktop/portfolio update april 2026/Hello, Anthropic!.pdf"
OUTPUT_BASE = "/Users/jfox/Documents/JSNFX/public/portfolio"

# Slide ranges (1-indexed page numbers)
CASE_STUDIES = {
    "robinhood": {"pages": list(range(12, 43)), "subdir": "robinhood"},
    "atlassian-ai-ops": {"pages": list(range(44, 77)), "subdir": "atlassian-ai-ops"},
    "chime": {"pages": list(range(78, 101)), "subdir": "chime"},
    "oracle-zine": {"pages": list(range(101, 107)), "subdir": "oracle-zine"},
}

MIN_WIDTH = 100
MIN_HEIGHT = 100


def get_image_ext(img_bytes, xref, doc):
    """Determine image extension from the PDF image metadata."""
    try:
        img_info = doc.extract_image(xref)
        return img_info.get("ext", "png")
    except Exception:
        return "png"


def main():
    doc = fitz.open(PDF_PATH)
    print(f"Opened PDF: {doc.page_count} pages")

    # Step 1: Count xref frequency globally to identify decorative/repeated images
    global_xref_count = Counter()
    for page_num in range(doc.page_count):
        page = doc[page_num]
        for img in page.get_images():
            global_xref_count[img[0]] += 1

    # xrefs appearing on 5+ pages are likely backgrounds/decorative
    decorative_xrefs = {xref for xref, count in global_xref_count.items() if count >= 5}
    print(f"Identified {len(decorative_xrefs)} decorative xrefs (appear on 5+ pages)")

    # Step 2: Extract images per case study
    for study_name, config in CASE_STUDIES.items():
        out_dir = os.path.join(OUTPUT_BASE, config["subdir"])
        os.makedirs(out_dir, exist_ok=True)

        seen_hashes = set()
        extracted = 0
        skipped_decorative = 0
        skipped_small = 0
        skipped_duplicate = 0

        for page_num in config["pages"]:
            page = doc[page_num - 1]  # 0-indexed
            images = page.get_images()

            img_index = 0
            for img_tuple in images:
                xref = img_tuple[0]

                # Skip decorative
                if xref in decorative_xrefs:
                    skipped_decorative += 1
                    continue

                # Extract image
                try:
                    img_data = doc.extract_image(xref)
                except Exception:
                    continue

                img_bytes = img_data["image"]
                width = img_data.get("width", 0)
                height = img_data.get("height", 0)
                ext = img_data.get("ext", "png")

                # Skip small images
                if width < MIN_WIDTH or height < MIN_HEIGHT:
                    skipped_small += 1
                    continue

                # Deduplicate by hash
                img_hash = hashlib.sha256(img_bytes).hexdigest()[:16]
                if img_hash in seen_hashes:
                    skipped_duplicate += 1
                    continue
                seen_hashes.add(img_hash)

                # Save
                img_index += 1
                filename = f"slide-{page_num}-img-{img_index}.{ext}"
                filepath = os.path.join(out_dir, filename)
                with open(filepath, "wb") as f:
                    f.write(img_bytes)
                extracted += 1
                print(f"  {study_name}: {filename} ({width}x{height})")

        print(f"\n{study_name}: extracted {extracted}, "
              f"skipped {skipped_decorative} decorative, "
              f"{skipped_small} small, {skipped_duplicate} duplicate\n")

    doc.close()
    print("Done!")


if __name__ == "__main__":
    main()
