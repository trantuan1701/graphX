"""Run the pinned upstream preprocessing and record raw/output SHA-256 hashes.

Run with the upstream Python environment (pandas 2.2.3, numpy 1.26.4,
pyarrow 17.0.0). No Spark dependency is needed here.
"""
import argparse
import hashlib
import importlib.metadata
import json
import platform
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_NAMES = ('HI-Small_Trans.csv', 'HI-Small_accounts.csv', 'HI-Small_Patterns.txt')
OUTPUT_NAMES = ('vertices.parquet', 'edges.parquet', 'edges_agg.parquet',
                'self_loops.parquet', 'patterns.parquet', 'exchange_rates.csv',
                'preprocess_summary.json')

def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--upstream', type=Path, default=ROOT.parent / 'aml-preprocessing')
    parser.add_argument('--raw', type=Path)
    parser.add_argument('--out', type=Path, default=ROOT / 'data/processed')
    args = parser.parse_args()
    upstream = args.upstream.resolve()
    raw = (args.raw or upstream / 'data/raw').resolve()
    out = args.out.resolve()
    lock = json.loads((ROOT / 'upstream.json').read_text())
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=upstream, text=True).strip()
    if commit != lock['commit']:
        raise ValueError('Upstream commit differs from upstream.json')
    subprocess.run(['git', 'diff', '--exit-code', 'HEAD', '--', 'src/preprocess.py'], cwd=upstream, check=True)
    for name in RAW_NAMES:
        path = raw / name
        if not path.is_file() or path.stat().st_size == 0:
            raise ValueError(f'Missing raw input: {path}')
        with path.open('rb') as stream:
            prefix = stream.read(128)
        if prefix.startswith(b'PK') or b'<html' in prefix.lower() or b'<!doctype' in prefix.lower():
            raise ValueError(f'Extract the downloaded data first: {path}')
    packages = {name: importlib.metadata.version(name) for name in ['pandas', 'numpy', 'pyarrow']}
    expected = {'pandas': '2.2.3', 'numpy': '1.26.4', 'pyarrow': '17.0.0'}
    if packages != expected:
        raise ValueError(f'Use pinned preprocessing packages: {expected}; got {packages}')
    command = [sys.executable, 'src/preprocess.py', '--raw', str(raw), '--out', str(out)]
    out.mkdir(parents=True, exist_ok=True)
    manifest = out / 'preprocess_manifest.json'
    manifest.unlink(missing_ok=True)
    subprocess.run(command, cwd=upstream, check=True)
    summary = json.loads((out / 'preprocess_summary.json').read_text())
    if (summary['vertices'], summary['edges']) != (422734, 4487124):
        raise ValueError('Unexpected HI-Small row counts')
    paths = [raw / name for name in RAW_NAMES] + [out / name for name in OUTPUT_NAMES]
    record = {
        'repository': lock['repository'], 'commit': commit,
        'completed_at': datetime.now(timezone.utc).isoformat(),
        'command': command, 'cwd': str(upstream),
        'python': platform.python_version(), 'packages': packages,
        'files': {str(p): {'bytes': p.stat().st_size, 'sha256': sha256(p)} for p in paths},
        'benchmark_inputs': lock['required_outputs'],
    }
    manifest.write_text(json.dumps(record, indent=2) + '\n')
    print(f'Provenance: {manifest}')

if __name__ == '__main__':
    main()
