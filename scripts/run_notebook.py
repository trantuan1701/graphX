"""Execute one notebook from a fresh kernel and save outputs even on failure."""
import argparse
import os
from pathlib import Path
import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("notebook", type=Path)
    args = parser.parse_args()
    path = args.notebook.resolve()
    os.environ["JUPYTER_PATH"] = str(ROOT / ".venv/share/jupyter")
    notebook = nbformat.read(path, as_version=4)
    client = NotebookClient(notebook, timeout=3600, resources={"metadata": {"path": str(ROOT)}})
    def progress(cell_index, **kwargs):
        print(f"Executing cell {cell_index}", flush=True)
    client.on_cell_start = progress
    try:
        client.execute()
    finally:
        nbformat.write(notebook, path)
    print(f"Completed {path.name}", flush=True)

if __name__ == "__main__":
    main()
