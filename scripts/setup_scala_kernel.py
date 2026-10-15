"""Install a project-local Scala kernel matching the benchmark's Spark version."""

import argparse
import gzip
import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / ".tools"
REPOSITORIES = "https://repo.maven.apache.org/maven2|https://jitpack.io"


def download(url, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    with urlopen(url, timeout=180) as response:
        content = response.read()
    destination.write_bytes(content)


def configure_kernel(heap="2g"):
    path = ROOT / ".venv/share/jupyter/kernels/graphx-scala/kernel.json"
    kernel = json.loads(path.read_text())
    java_home = Path(os.environ.get("JAVA_HOME", TOOLS / "java"))
    if not (java_home / "bin/java").is_file():
        raise RuntimeError("Install Java 17 and set JAVA_HOME before running this script.")
    kernel["argv"][0] = str(java_home / "bin/java")
    options = [f"-Xmx{heap}", "-Xss4m", "--add-exports=java.base/sun.nio.ch=ALL-UNNAMED"]
    for package in ["java.lang", "java.lang.invoke", "java.lang.reflect", "java.io", "java.net", "java.nio", "java.util", "java.util.concurrent", "java.util.concurrent.atomic", "sun.nio.ch", "sun.nio.cs", "sun.security.action", "sun.util.calendar"]:
        options.append(f"--add-opens=java.base/{package}=ALL-UNNAMED")
    # The installer writes a fresh argv; configure it once after installation.
    kernel["argv"][1:1] = options
    kernel["env"] = {
        "JAVA_HOME": str(java_home),
        "SPARK_HOME": str(Path(importlib.util.find_spec("pyspark").origin).parent),
        "SPARK_LOCAL_IP": "127.0.0.1",
        "COURSIER_CACHE": str(TOOLS / "coursier"),
        "COURSIER_REPOSITORIES": REPOSITORIES,
    }
    path.write_text(json.dumps(kernel, indent=2) + "\n")
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--heap", default="2g", help="Maximum Scala kernel JVM heap")
    args = parser.parse_args()
    if Path(sys.prefix).resolve() != (ROOT / ".venv").resolve():
        raise RuntimeError("Run with .venv/bin/python scripts/setup_scala_kernel.py")
    import pyspark

    if pyspark.__version__ != "3.5.7":
        raise RuntimeError("Install requirements-benchmark.txt first (Spark 3.5.7).")
    java_home = Path(os.environ.get("JAVA_HOME", TOOLS / "java"))
    if not (java_home / "bin/java").is_file():
        raise RuntimeError("Install Java 17 and set JAVA_HOME.")
    version = subprocess.check_output([str(java_home / "bin/java"), "-version"], stderr=subprocess.STDOUT, text=True)
    if 'version "17.' not in version:
        raise RuntimeError(f"Java 17 required; found:\n{version}")
    launcher = TOOLS / "almond/cs"
    if not launcher.exists():
        archive = TOOLS / "almond/cs.gz"
        download("https://github.com/coursier/launchers/raw/master/cs-x86_64-pc-linux.gz", archive)
        with gzip.open(archive, "rb") as source, launcher.open("wb") as target:
            shutil.copyfileobj(source, target)
        launcher.chmod(0o755)
        archive.unlink()
    command = [str(launcher), "launch", "--use-bootstrap"]
    for module in ["scala-compiler", "scala-reflect", "scala-library", "scalap"]:
        command += ["--force-version", f"org.scala-lang:{module}:2.12.18"]
    command += ["sh.almond:scala-kernel_2.12:0.15.0", "--", "--install", "--id", "graphx-scala", "--display-name", "Scala 2.12.18 - GraphX benchmark", "--jupyter-path", str(ROOT / ".venv/share/jupyter/kernels"), "--silent-imports", "--last-value-only", "--force"]
    env = dict(os.environ, JAVA_HOME=str(java_home), COURSIER_CACHE=str(TOOLS / "coursier"), COURSIER_REPOSITORIES=REPOSITORIES)
    env["PATH"] = str(java_home / "bin") + os.pathsep + env.get("PATH", "")
    subprocess.run(command, env=env, check=True)
    path = configure_kernel(args.heap)
    for artifact in ["graphframes-spark3_2.12", "graphframes-graphx-spark3_2.12"]:
        target = TOOLS / "jars" / f"{artifact}-0.10.0.jar"
        if not target.exists():
            download(f"https://repo.maven.apache.org/maven2/io/graphframes/{artifact}/0.10.0/{target.name}", target)
    print(f"Installed kernel: {path}")
    print(f"Start Jupyter with JUPYTER_PATH={ROOT / '.venv/share/jupyter'}")


if __name__ == "__main__":
    main()
