"""Download the selected IBM AML CSV, validate its header and record provenance."""

import csv
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data/raw/HI-Small_Trans.csv"
URL = "https://www.kaggle.com/api/v1/datasets/download/ealtman2019/ibm-transactions-for-anti-money-laundering-aml/HI-Small_Trans.csv"
HEADER = ["Timestamp", "From Bank", "Account", "To Bank", "Account", "Amount Received", "Receiving Currency", "Amount Paid", "Payment Currency", "Payment Format", "Is Laundering"]


def validate(path):
    with path.open(newline="", encoding="utf-8-sig") as stream:
        if next(csv.reader(stream), None) != HEADER:
            raise ValueError("Response is not the expected HI-Small_Trans.csv; check Kaggle access.")


def main():
    DEST.parent.mkdir(parents=True, exist_ok=True)
    if not DEST.exists():
        partial = DEST.with_suffix(".csv.part")
        try:
            with urlopen(Request(URL, headers={"User-Agent": "graphX-EDA/1.0"}), timeout=120) as response, partial.open("wb") as output:
                expected = response.headers.get("Content-Length")
                size = 0
                while block := response.read(1024 * 1024):
                    output.write(block)
                    size += len(block)
                if expected and size != int(expected):
                    raise ValueError(f"Incomplete download: {size}/{expected} bytes")
            validate(partial)
            partial.replace(DEST)
        except Exception:
            partial.unlink(missing_ok=True)
            raise
    validate(DEST)
    digest = hashlib.sha256()
    with DEST.open("rb") as stream:
        while block := stream.read(1024 * 1024):
            digest.update(block)
    manifest = {
        "dataset": "ealtman2019/ibm-transactions-for-anti-money-laundering-aml",
        "file": DEST.name,
        "source": "https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml",
        "download_url": URL,
        "verified_at_utc": datetime.now(timezone.utc).isoformat(),
        "bytes": DEST.stat().st_size,
        "sha256": digest.hexdigest(),
    }
    DEST.with_suffix(".manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
