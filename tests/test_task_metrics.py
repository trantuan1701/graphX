"""Check phase attribution when stages are reused or jobs are outside timers."""
import csv
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from extract_task_metrics import extract


def job(stages, group=None):
    properties = {} if group is None else {"spark.jobGroup.id": group}
    return {"Event": "SparkListenerJobStart", "Stage IDs": stages, "Properties": properties}


def task(stage, task_id, reason="Success"):
    return {"Event": "SparkListenerTaskEnd", "Stage ID": stage,
            "Task Info": {"Task ID": task_id}, "Task End Reason": {"Reason": reason},
            "Task Metrics": {"Shuffle Read Metrics": {"Local Bytes Read": 10, "Remote Bytes Read": 2},
                             "Shuffle Write Metrics": {"Shuffle Bytes Written": 8},
                             "Peak Execution Memory": 50, "Memory Bytes Spilled": 4,
                             "Disk Bytes Spilled": 3}}


class TaskMetricsTest(unittest.TestCase):
    def run_events(self, events):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "events").mkdir()
            (root / "phase_timings.csv").write_text("run,phase,iteration\nX,build,0\nX,aggregate,0\n")
            events = [{"Event": "SparkListenerApplicationStart"}] + events + [{"Event": "SparkListenerApplicationEnd"}]
            (root / "events" / "application").write_text("".join(json.dumps(event) + "\n" for event in events))
            path = extract(root)
            with path.open() as stream:
                return list(csv.DictReader(stream))

    def test_reused_stage_and_untimed_jobs(self):
        events = [job([0]), task(0, 0), job([0, 1], "X|build|0"), task(1, 1),
                  job([1, 2], "X|aggregate|0"), task(2, 2), job([3]), task(3, 3)]
        rows = self.run_events(events)
        self.assertEqual([row["tasks"] for row in rows], ["1", "1"])
        for row in rows:
            self.assertEqual(row["shuffle_read_bytes"], "12")
            self.assertEqual(row["shuffle_write_bytes"], "8")
            self.assertEqual(row["max_task_execution_memory_bytes"], "50")
            self.assertEqual(row["memory_spill_bytes"], "4")
            self.assertEqual(row["disk_spill_bytes"], "3")

    def test_missing_phase_metrics_rejected(self):
        with self.assertRaisesRegex(AssertionError, "No task metrics"):
            self.run_events([job([1], "X|build|0"), task(1, 1)])

    def test_failed_task_rejected(self):
        with self.assertRaisesRegex(AssertionError, "Failed tasks"):
            self.run_events([job([1], "X|build|0"), task(1, 1, "ExceptionFailure"),
                             job([2], "X|aggregate|0"), task(2, 2)])


if __name__ == "__main__":
    unittest.main()
