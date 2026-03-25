#!/usr/bin/env python3
"""
parse_test_metrics.py
---------------------
Parses Playwright's JSON reporter output, then:
1. Pushes metrics to Grafana Cloud via Prometheus remote-write (snappy+protobuf)
   when GRAFANA_CLOUD_URL, GRAFANA_CLOUD_USER, and GRAFANA_CLOUD_TOKEN are set.
2. Writes reports/test-metrics.json consumed by the HTML dashboard generator.

Playwright JSON report structure (from @playwright/test JSON reporter):
  stats.expected   → passed tests
  stats.unexpected → failed tests
  stats.flaky      → flaky tests (failed then passed on retry)
  stats.skipped    → skipped tests
  stats.duration   → total suite duration in ms

Required env vars for Grafana Cloud push (all optional — skipped if not set):
  GRAFANA_CLOUD_URL   e.g. https://prometheus-prod-13-prod-us-east-0.grafana.net/api/prom/push
  GRAFANA_CLOUD_USER  Numeric Grafana Cloud metrics user/instance ID
  GRAFANA_CLOUD_TOKEN Grafana Cloud API token with MetricsPublisher role
"""

import json
import os
import sys
import time
import struct
from datetime import datetime, timezone


# ── Playwright JSON report parser ─────────────────────────────────────────────

def walk_suites(suites: list, collector: dict):
    """Recursively walk Playwright suite tree to collect per-test data."""
    for suite in suites:
        for spec in suite.get("specs", []):
            for test in spec.get("tests", []):
                for result in test.get("results", []):
                    status = result.get("status", "")
                    duration = result.get("duration", 0)
                    retry = result.get("retry", 0)
                    collector["durations"].append(duration)
                    if retry > 0:
                        collector["retry_count"] += 1
        # Recurse into nested suites
        walk_suites(suite.get("suites", []), collector)


def parse_playwright_results(report_path: str) -> dict:
    totals = {
        "passed": 0,
        "failed": 0,
        "flaky": 0,
        "skipped": 0,
        "total": 0,
        "duration_ms": 0,
        "retry_count": 0,
        "avg_duration_ms": 0,
        "max_duration_ms": 0,
        "durations": [],
    }

    if not os.path.isfile(report_path):
        print(f"[WARN] Playwright JSON report not found: {report_path}", file=sys.stderr)
        return totals

    try:
        with open(report_path) as f:
            data = json.load(f)
    except Exception as e:
        print(f"[ERROR] Could not parse {report_path}: {e}", file=sys.stderr)
        return totals

    stats = data.get("stats", {})
    totals["passed"] = stats.get("expected", 0)
    totals["failed"] = stats.get("unexpected", 0)
    totals["flaky"] = stats.get("flaky", 0)
    totals["skipped"] = stats.get("skipped", 0)
    totals["total"] = (
        totals["passed"] + totals["failed"] + totals["flaky"] + totals["skipped"]
    )
    totals["duration_ms"] = stats.get("duration", 0)

    # Walk suites for per-result data (retries, individual durations)
    collector = {"retry_count": 0, "durations": []}
    walk_suites(data.get("suites", []), collector)
    totals["retry_count"] = collector["retry_count"]

    durations = collector["durations"]
    if durations:
        totals["avg_duration_ms"] = sum(durations) / len(durations)
        totals["max_duration_ms"] = max(durations)

    return totals


# ── Hand-built Prometheus remote-write protobuf ───────────────────────────────
#
# Proto3 schema for Prometheus WriteRequest:
#   message WriteRequest { repeated TimeSeries timeseries = 1; }
#   message TimeSeries   { repeated Label  labels  = 1;
#                          repeated Sample samples = 2; }
#   message Label        { string name = 1; string value = 2; }
#   message Sample       { double value = 1; int64 timestamp = 2; }
#
# Wire types: varint=0, 64-bit=1, len-del=2
# Tag = (field_number << 3) | wire_type

def _varint(n: int) -> bytes:
    out = []
    while n > 0x7F:
        out.append((n & 0x7F) | 0x80)
        n >>= 7
    out.append(n)
    return bytes(out)


def _field_string(field_number: int, s: str) -> bytes:
    enc = s.encode("utf-8")
    return _varint((field_number << 3) | 2) + _varint(len(enc)) + enc


def _field_double(field_number: int, v: float) -> bytes:
    return _varint((field_number << 3) | 1) + struct.pack("<d", v)


def _field_int64(field_number: int, v: int) -> bytes:
    if v < 0:
        v += (1 << 64)
    return _varint((field_number << 3) | 0) + _varint(v)


def _field_embedded(field_number: int, payload: bytes) -> bytes:
    return _varint((field_number << 3) | 2) + _varint(len(payload)) + payload


def _encode_label(name: str, value: str) -> bytes:
    return _field_string(1, name) + _field_string(2, value)


def _encode_sample(value: float, timestamp_ms: int) -> bytes:
    return _field_double(1, value) + _field_int64(2, timestamp_ms)


def _encode_timeseries(labels: dict, metric_name: str, value: float, ts_ms: int) -> bytes:
    all_labels = {"__name__": metric_name, **labels}
    label_bytes = b"".join(
        _field_embedded(1, _encode_label(k, v))
        for k, v in sorted(all_labels.items())
    )
    sample_bytes = _field_embedded(2, _encode_sample(value, ts_ms))
    return label_bytes + sample_bytes


def _encode_write_request(series_list: list) -> bytes:
    return b"".join(_field_embedded(1, ts) for ts in series_list)


# ── Grafana Cloud push ────────────────────────────────────────────────────────

def push_to_grafana_cloud(metrics: dict, run_id: str, branch: str, repo: str):
    url   = os.environ.get("GRAFANA_CLOUD_URL",   "").strip()
    user  = os.environ.get("GRAFANA_CLOUD_USER",  "").strip()
    token = os.environ.get("GRAFANA_CLOUD_TOKEN", "").strip()

    if not (url and user and token):
        print("[INFO] Grafana Cloud env vars not set — skipping remote-write push.")
        return

    try:
        import requests
    except ImportError:
        print("[WARN] 'requests' not installed — cannot push to Grafana Cloud.", file=sys.stderr)
        return

    try:
        import snappy
    except ImportError:
        print("[WARN] 'python-snappy' not installed — cannot push to Grafana Cloud.", file=sys.stderr)
        return

    ts_ms  = int(time.time() * 1000)
    labels = {
        "run_id":     run_id,
        "branch":     branch,
        "repository": repo,
    }

    metric_values = {
        "playwright_tests_total":           float(metrics["total"]),
        "playwright_tests_passed":          float(metrics["passed"]),
        "playwright_tests_failed":          float(metrics["failed"]),
        "playwright_tests_flaky":           float(metrics["flaky"]),
        "playwright_tests_skipped":         float(metrics["skipped"]),
        "playwright_tests_duration_ms":     float(metrics["duration_ms"]),
        "playwright_tests_pass_rate":       float(metrics["pass_rate"]),
        "playwright_tests_fail_rate":       float(metrics["fail_rate"]),
        "playwright_tests_retry_count":     float(metrics["retry_count"]),
        "playwright_tests_avg_duration_ms": float(metrics["avg_duration_ms"]),
        "playwright_tests_max_duration_ms": float(metrics["max_duration_ms"]),
    }

    series_list  = [_encode_timeseries(labels, name, val, ts_ms) for name, val in metric_values.items()]
    proto_bytes  = _encode_write_request(series_list)
    snappy_bytes = snappy.compress(proto_bytes)

    headers = {
        "Content-Encoding":                 "snappy",
        "Content-Type":                     "application/x-protobuf",
        "X-Prometheus-Remote-Write-Version": "0.1.0",
    }

    try:
        resp = requests.post(url, data=snappy_bytes, headers=headers, auth=(user, token), timeout=15)
        if resp.status_code in (200, 204):
            print(f"[INFO] Metrics pushed to Grafana Cloud ({resp.status_code}).")
        else:
            print(f"[WARN] Grafana Cloud push returned {resp.status_code}: {resp.text}", file=sys.stderr)
    except Exception as e:
        print(f"[WARN] Grafana Cloud push failed: {e}", file=sys.stderr)


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    report_path = os.environ.get("PLAYWRIGHT_REPORT_PATH", "reports/test-results.json")
    output_file = os.environ.get("METRICS_JSON_PATH",      "reports/test-metrics.json")

    run_id     = os.environ.get("GITHUB_RUN_ID",     "local")
    run_number = os.environ.get("GITHUB_RUN_NUMBER", "0")
    branch     = os.environ.get("GITHUB_REF_NAME",   "unknown")
    repo       = os.environ.get("GITHUB_REPOSITORY", "unknown")
    actor      = os.environ.get("GITHUB_ACTOR",      "unknown")
    sha        = os.environ.get("GITHUB_SHA",        "unknown")[:7]

    metrics = parse_playwright_results(report_path)

    if metrics["total"] == 0:
        print("[WARN] No test results found — metrics will be zeroed.", file=sys.stderr)

    total = metrics["total"]
    # pass_rate counts flaky tests as passed (they eventually passed)
    metrics["pass_rate"]    = ((metrics["passed"] + metrics["flaky"]) / total * 100) if total > 0 else 0
    metrics["fail_rate"]    = (metrics["failed"] / total * 100) if total > 0 else 0
    metrics["duration_sec"] = metrics["duration_ms"] / 1000

    # Strip internal key before serialising
    metrics.pop("durations", None)

    metrics["run_id"]       = run_id
    metrics["run_number"]   = run_number
    metrics["branch"]       = branch
    metrics["repository"]   = repo
    metrics["actor"]        = actor
    metrics["commit_sha"]   = sha
    metrics["timestamp"]    = datetime.now(timezone.utc).isoformat()

    os.makedirs(os.path.dirname(output_file) or ".", exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"[INFO] Metrics written to {output_file}")
    print(json.dumps(metrics, indent=2))

    push_to_grafana_cloud(metrics, run_id, branch, repo)


if __name__ == "__main__":
    main()
