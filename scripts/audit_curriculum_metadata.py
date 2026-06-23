from pathlib import Path
import re
import sys

TARGET_DIRS = [
    Path("_biology"),
    Path("_concepts"),
    Path("_mcq-arena"),
]

REQUIRED_FIELDS = [
    "language",
    "curriculum_tracks",
    "neet_alignment",
    "ib_theme",
    "ib_subtopic",
    "hsc_alignment",
    "concept_level",
]

ALLOWED_IB_THEMES = {
    "Diversity",
    "Form and Function",
    "Interaction and Interdependence",
    "Continuity and Change",
    "Not Applicable",
}

def read_text(path: Path) -> str:
    raw = path.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "utf-16", "utf-16le", "utf-16be"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")

def front_matter(text: str):
    text = text.lstrip("\ufeff\x00")
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None
    return parts[1]

def parse_simple_yaml_keys(fm: str):
    keys = {}
    for line in fm.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = re.match(r"^([A-Za-z0-9_\-]+)\s*:\s*(.*)$", line)
        if match:
            keys[match.group(1)] = match.group(2).strip().strip('"').strip("'")
    return keys

def iter_markdown_files():
    for root in TARGET_DIRS:
        if not root.exists():
            continue
        for path in root.rglob("*.md"):
            if "_site" in path.parts:
                continue
            yield path

def main():
    total = 0
    clean = 0
    missing_front_matter = []
    missing_fields = []
    invalid_ib_theme = []

    for path in sorted(iter_markdown_files()):
        total += 1
        text = read_text(path)
        fm = front_matter(text)

        if fm is None:
            missing_front_matter.append(str(path).replace("\\", "/"))
            continue

        keys = parse_simple_yaml_keys(fm)
        missing = [field for field in REQUIRED_FIELDS if field not in keys]

        ib_theme = keys.get("ib_theme")
        if ib_theme and ib_theme not in ALLOWED_IB_THEMES:
            invalid_ib_theme.append((str(path).replace("\\", "/"), ib_theme))

        if missing:
            missing_fields.append((str(path).replace("\\", "/"), missing))
        else:
            clean += 1

    report = []
    report.append("PHASE 2 CURRICULUM METADATA AUDIT")
    report.append("=" * 42)
    report.append(f"Scanned Markdown files: {total}")
    report.append(f"Fully mapped files: {clean}")
    report.append(f"Missing front matter: {len(missing_front_matter)}")
    report.append(f"Missing required metadata: {len(missing_fields)}")
    report.append(f"Invalid IB theme values: {len(invalid_ib_theme)}")
    report.append("")

    if missing_front_matter:
        report.append("FILES WITHOUT FRONT MATTER")
        report.append("-" * 32)
        for path in missing_front_matter:
            report.append(path)
        report.append("")

    if missing_fields:
        report.append("FILES MISSING REQUIRED METADATA")
        report.append("-" * 40)
        for path, fields in missing_fields:
            report.append(f"{path}: {', '.join(fields)}")
        report.append("")

    if invalid_ib_theme:
        report.append("FILES WITH INVALID IB THEME")
        report.append("-" * 32)
        for path, value in invalid_ib_theme:
            report.append(f"{path}: {value}")
        report.append("")

    output = "\n".join(report)
    Path("scripts/curriculum_metadata_report.txt").write_text(output, encoding="utf-8", newline="\n")
    print(output)

    return 0

if __name__ == "__main__":
    raise SystemExit(main())