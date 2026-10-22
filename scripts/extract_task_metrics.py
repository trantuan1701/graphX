"""Attribute Spark task metrics to timed job groups, without counting reused stages twice."""
import argparse
import csv
import json
from pathlib import Path


def extract(run_dir):
    run_dir = Path(run_dir)
    with (run_dir / "phase_timings.csv").open() as stream:
        rows = list(csv.DictReader(stream))
    phases = {}
    for row in rows:
        key = (row["run"], row["phase"], int(row["iteration"]))
        assert key not in phases, f"Duplicate phase: {key}"
        phases[key] = dict(run=key[0], phase=key[1], iteration=key[2], tasks=0,
                          failed_tasks=0, shuffle_read_bytes=0, shuffle_write_bytes=0,
                          memory_spill_bytes=0, disk_spill_bytes=0,
                          max_task_execution_memory_bytes=0, executor_run_ms=0)
    stage_owners = {}
    seen_tasks = set()
    applications = 0
    completed_applications = 0
    for path in sorted((run_dir / "events").iterdir()):
        if path.name.startswith("."):
            continue
        assert path.is_file() and not path.name.endswith(".inprogress"), path
        with path.open() as stream:
            for line in stream:
                event = json.loads(line)
                kind = event["Event"]
                if kind == "SparkListenerApplicationStart":
                    applications += 1
                elif kind == "SparkListenerApplicationEnd":
                    completed_applications += 1
                elif kind == "SparkListenerJobStart":
                    group = event.get("Properties", {}).get("spark.jobGroup.id", "")
                    parts = group.split("|")
                    owner = None
                    if len(parts) == 3:
                        owner = (parts[0], parts[1], int(parts[2]))
                        assert owner in phases, f"Unknown measured group: {group}"
                    for stage_id in event["Stage IDs"]:
                        # First submission owns the stage, even if it is reused later.
                        if stage_id not in stage_owners:
                            stage_owners[stage_id] = owner
                elif kind == "SparkListenerTaskEnd":
                    owner = stage_owners.get(event["Stage ID"])
                    if owner is None:
                        continue
                    task_id = event["Task Info"]["Task ID"]
                    assert task_id not in seen_tasks, f"Duplicate task: {task_id}"
                    seen_tasks.add(task_id)
                    row = phases[owner]
                    row["tasks"] += 1
                    if event["Task End Reason"]["Reason"] != "Success":
                        row["failed_tasks"] += 1
                    metrics = event.get("Task Metrics", {})
                    read = metrics.get("Shuffle Read Metrics", {})
                    write = metrics.get("Shuffle Write Metrics", {})
                    row["shuffle_read_bytes"] += read.get("Remote Bytes Read", 0) + read.get("Local Bytes Read", 0)
                    row["shuffle_write_bytes"] += write.get("Shuffle Bytes Written", 0)
                    row["memory_spill_bytes"] += metrics.get("Memory Bytes Spilled", 0)
                    row["disk_spill_bytes"] += metrics.get("Disk Bytes Spilled", 0)
                    row["executor_run_ms"] += metrics.get("Executor Run Time", 0)
                    row["max_task_execution_memory_bytes"] = max(
                        row["max_task_execution_memory_bytes"], metrics.get("Peak Execution Memory", 0))
    assert applications == 1 and completed_applications == 1, "Expected one completed Spark application"
    for key, row in phases.items():
        assert row["tasks"] > 0, f"No task metrics for {key}"
        assert row["failed_tasks"] == 0, f"Failed tasks in {key}; inspect before comparing"
    destination = run_dir / "phase_task_metrics.csv"
    with destination.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(next(iter(phases.values()))))
        writer.writeheader()
        writer.writerows(phases.values())
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("run_dir", type=Path)
    print(extract(parser.parse_args().run_dir))
