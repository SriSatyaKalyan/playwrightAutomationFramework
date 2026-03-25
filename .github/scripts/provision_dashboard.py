#!/usr/bin/env python3
"""
provision_dashboard.py
-----------------------
Creates (or updates) a Playwright test metrics dashboard in Grafana Cloud
using the Grafana HTTP API.

The dashboard is defined as JSON below. All panels query the Prometheus
metrics pushed by parse_test_metrics.py via remote-write.

Required env vars:
  GRAFANA_INSTANCE_URL          e.g. https://yourorg.grafana.net
  GRAFANA_SERVICE_ACCOUNT_TOKEN Service account token with Editor role

Optional:
  GRAFANA_DATASOURCE_UID        Prometheus datasource UID (auto-detected if omitted)
  GRAFANA_FOLDER_TITLE          Dashboard folder name (default: "Playwright")

The script is idempotent — running it again updates the existing dashboard
rather than creating a duplicate (matched by uid: "playwright-test-metrics").
"""

import json
import os
import sys

try:
    import requests
except ImportError:
    print("[ERROR] 'requests' not installed. Run: pip install requests", file=sys.stderr)
    sys.exit(1)


DASHBOARD_UID   = "playwright-test-metrics"
DASHBOARD_TITLE = "Playwright Test Metrics"


# ── Datasource detection ──────────────────────────────────────────────────────

def get_prometheus_datasource_uid(base_url: str, headers: dict) -> str:
    """Return the UID of the first Prometheus-compatible datasource found."""
    override = os.environ.get("GRAFANA_DATASOURCE_UID", "").strip()
    if override:
        print(f"[INFO] Using datasource UID from env: {override}")
        return override

    try:
        resp = requests.get(f"{base_url}/api/datasources", headers=headers, timeout=10)
        resp.raise_for_status()
        for ds in resp.json():
            if ds.get("type") in ("prometheus", "grafana-prom-datasource"):
                uid = ds.get("uid", ds.get("name", ""))
                print(f"[INFO] Auto-detected Prometheus datasource: {ds.get('name')} (uid={uid})")
                return uid
    except Exception as e:
        print(f"[WARN] Could not auto-detect datasource: {e}", file=sys.stderr)

    # Grafana Cloud default name
    return "grafanacloud-prom"


# ── Folder provisioning ───────────────────────────────────────────────────────

def get_or_create_folder(base_url: str, headers: dict, folder_title: str) -> str | None:
    """Return the folder UID, creating it if needed. Returns None for General folder."""
    if not folder_title or folder_title.lower() == "general":
        return None

    try:
        resp = requests.get(f"{base_url}/api/folders", headers=headers, timeout=10)
        resp.raise_for_status()
        for folder in resp.json():
            if folder.get("title", "").lower() == folder_title.lower():
                print(f"[INFO] Using existing folder '{folder_title}' (uid={folder['uid']})")
                return folder["uid"]

        # Create folder
        resp = requests.post(
            f"{base_url}/api/folders",
            headers=headers,
            json={"title": folder_title},
            timeout=10,
        )
        resp.raise_for_status()
        uid = resp.json()["uid"]
        print(f"[INFO] Created folder '{folder_title}' (uid={uid})")
        return uid
    except Exception as e:
        print(f"[WARN] Folder operation failed: {e} — placing dashboard in General.", file=sys.stderr)
        return None


# ── Dashboard definition ──────────────────────────────────────────────────────

def build_dashboard(ds_uid: str) -> dict:
    """Return the Grafana dashboard JSON for Playwright metrics."""

    def stat_panel(pid, title, expr, color, unit="short", x=0, y=0, w=4, h=4):
        return {
            "id": pid,
            "type": "stat",
            "title": title,
            "gridPos": {"x": x, "y": y, "w": w, "h": h},
            "datasource": {"type": "prometheus", "uid": ds_uid},
            "options": {
                "reduceOptions": {"calcs": ["lastNotNull"]},
                "colorMode": "value",
                "graphMode": "none",
                "textMode": "auto",
                "orientation": "auto",
            },
            "fieldConfig": {
                "defaults": {
                    "unit": unit,
                    "color": {"mode": "fixed", "fixedColor": color},
                    "thresholds": {"mode": "absolute", "steps": [{"color": color, "value": None}]},
                },
                "overrides": [],
            },
            "targets": [{"expr": expr, "legendFormat": title, "refId": "A", "datasource": {"type": "prometheus", "uid": ds_uid}}],
        }

    def gauge_panel(pid, title, expr, x=0, y=0, w=4, h=6):
        return {
            "id": pid,
            "type": "gauge",
            "title": title,
            "gridPos": {"x": x, "y": y, "w": w, "h": h},
            "datasource": {"type": "prometheus", "uid": ds_uid},
            "options": {
                "reduceOptions": {"calcs": ["lastNotNull"]},
                "showThresholdLabels": False,
                "showThresholdMarkers": True,
                "minVizWidth": 75,
            },
            "fieldConfig": {
                "defaults": {
                    "unit": "percent",
                    "min": 0,
                    "max": 100,
                    "thresholds": {
                        "mode": "absolute",
                        "steps": [
                            {"color": "#F2495C", "value": None},
                            {"color": "#F2CC0C", "value": 70},
                            {"color": "#73BF69", "value": 90},
                        ],
                    },
                },
                "overrides": [],
            },
            "targets": [{"expr": expr, "legendFormat": title, "refId": "A", "datasource": {"type": "prometheus", "uid": ds_uid}}],
        }

    def timeseries_panel(pid, title, targets, x=0, y=0, w=12, h=8):
        return {
            "id": pid,
            "type": "timeseries",
            "title": title,
            "gridPos": {"x": x, "y": y, "w": w, "h": h},
            "datasource": {"type": "prometheus", "uid": ds_uid},
            "options": {
                "tooltip": {"mode": "multi", "sort": "desc"},
                "legend": {"displayMode": "list", "placement": "bottom"},
            },
            "fieldConfig": {
                "defaults": {"unit": "short"},
                "overrides": [
                    {"matcher": {"id": "byName", "options": "Passed"},  "properties": [{"id": "color", "value": {"fixedColor": "#73BF69", "mode": "fixed"}}]},
                    {"matcher": {"id": "byName", "options": "Failed"},  "properties": [{"id": "color", "value": {"fixedColor": "#F2495C", "mode": "fixed"}}]},
                    {"matcher": {"id": "byName", "options": "Flaky"},   "properties": [{"id": "color", "value": {"fixedColor": "#FF9830", "mode": "fixed"}}]},
                    {"matcher": {"id": "byName", "options": "Skipped"}, "properties": [{"id": "color", "value": {"fixedColor": "#F2CC0C", "mode": "fixed"}}]},
                    {"matcher": {"id": "byName", "options": "Pass Rate %"}, "properties": [
                        {"id": "color", "value": {"fixedColor": "#6e9fff", "mode": "fixed"}},
                        {"id": "unit",  "value": "percent"},
                        {"id": "custom.axisPlacement", "value": "right"},
                    ]},
                ],
            },
            "targets": targets,
        }

    def row_panel(pid, title, y=0):
        return {
            "id": pid,
            "type": "row",
            "title": title,
            "gridPos": {"x": 0, "y": y, "w": 24, "h": 1},
            "collapsed": False,
            "panels": [],
        }

    # ── Repo variable ──────────────────────────────────────────────────────
    repo_var = {
        "name": "repository",
        "label": "Repository",
        "type": "query",
        "datasource": {"type": "prometheus", "uid": ds_uid},
        "definition": 'label_values(playwright_tests_total, repository)',
        "query": {"query": 'label_values(playwright_tests_total, repository)', "refId": "Q"},
        "refresh": 2,
        "sort": 1,
        "includeAll": False,
        "multi": False,
        "current": {},
        "options": [],
        "hide": 0,
    }

    branch_var = {
        "name": "branch",
        "label": "Branch",
        "type": "query",
        "datasource": {"type": "prometheus", "uid": ds_uid},
        "definition": 'label_values(playwright_tests_total{repository="$repository"}, branch)',
        "query": {"query": 'label_values(playwright_tests_total{repository="$repository"}, branch)', "refId": "Q"},
        "refresh": 2,
        "sort": 1,
        "includeAll": True,
        "allValue": ".*",
        "multi": True,
        "current": {},
        "options": [],
        "hide": 0,
    }

    REPO = 'repository="$repository", branch=~"$branch"'

    panels = [
        # ── Row 1: Latest Run Summary ──────────────────────────────────────
        row_panel(1, "Latest Run Summary", y=0),

        stat_panel(2,  "Total Tests",    f'playwright_tests_total{{{REPO}}}',           "#e6e6e6", x=0,  y=1),
        stat_panel(3,  "Passed",         f'playwright_tests_passed{{{REPO}}}',          "#73BF69", x=4,  y=1),
        stat_panel(4,  "Failed",         f'playwright_tests_failed{{{REPO}}}',          "#F2495C", x=8,  y=1),
        stat_panel(5,  "Flaky",          f'playwright_tests_flaky{{{REPO}}}',           "#FF9830", x=12, y=1),
        stat_panel(6,  "Skipped",        f'playwright_tests_skipped{{{REPO}}}',         "#F2CC0C", x=16, y=1),
        stat_panel(7,  "Retry Attempts", f'playwright_tests_retry_count{{{REPO}}}',     "#a855f7", x=20, y=1),

        gauge_panel(8, "Pass Rate %",
            f'playwright_tests_pass_rate{{{REPO}}}',
            x=0, y=5, w=6, h=7),

        gauge_panel(9, "Fail Rate %",
            f'playwright_tests_fail_rate{{{REPO}}}',
            x=6, y=5, w=6, h=7),

        stat_panel(10, "Suite Duration",
            f'playwright_tests_duration_ms{{{REPO}}} / 1000',
            "#6e9fff", unit="s", x=12, y=5, w=4, h=4),
        stat_panel(11, "Avg Test Duration",
            f'playwright_tests_avg_duration_ms{{{REPO}}} / 1000',
            "#6e9fff", unit="s", x=16, y=5, w=4, h=4),
        stat_panel(12, "Slowest Test",
            f'playwright_tests_max_duration_ms{{{REPO}}} / 1000',
            "#6e9fff", unit="s", x=20, y=5, w=4, h=4),

        # ── Row 2: Trends ─────────────────────────────────────────────────
        row_panel(13, "Trends Over Time", y=12),

        timeseries_panel(
            14, "Test Results Over Time",
            targets=[
                {"expr": f'playwright_tests_passed{{{REPO}}}',  "legendFormat": "Passed",  "refId": "A", "datasource": {"type": "prometheus", "uid": ds_uid}},
                {"expr": f'playwright_tests_failed{{{REPO}}}',  "legendFormat": "Failed",  "refId": "B", "datasource": {"type": "prometheus", "uid": ds_uid}},
                {"expr": f'playwright_tests_flaky{{{REPO}}}',   "legendFormat": "Flaky",   "refId": "C", "datasource": {"type": "prometheus", "uid": ds_uid}},
                {"expr": f'playwright_tests_skipped{{{REPO}}}', "legendFormat": "Skipped", "refId": "D", "datasource": {"type": "prometheus", "uid": ds_uid}},
            ],
            x=0, y=13, w=16, h=8,
        ),

        timeseries_panel(
            15, "Pass Rate % Over Time",
            targets=[
                {"expr": f'playwright_tests_pass_rate{{{REPO}}}', "legendFormat": "Pass Rate %", "refId": "A", "datasource": {"type": "prometheus", "uid": ds_uid}},
            ],
            x=16, y=13, w=8, h=8,
        ),

        timeseries_panel(
            16, "Suite Duration (s) Over Time",
            targets=[
                {"expr": f'playwright_tests_duration_ms{{{REPO}}} / 1000',     "legendFormat": "Total (s)",   "refId": "A", "datasource": {"type": "prometheus", "uid": ds_uid}},
                {"expr": f'playwright_tests_avg_duration_ms{{{REPO}}} / 1000', "legendFormat": "Avg test (s)", "refId": "B", "datasource": {"type": "prometheus", "uid": ds_uid}},
                {"expr": f'playwright_tests_max_duration_ms{{{REPO}}} / 1000', "legendFormat": "Max test (s)", "refId": "C", "datasource": {"type": "prometheus", "uid": ds_uid}},
            ],
            x=0, y=21, w=12, h=8,
        ),

        timeseries_panel(
            17, "Retry Attempts Over Time",
            targets=[
                {"expr": f'playwright_tests_retry_count{{{REPO}}}', "legendFormat": "Retries", "refId": "A", "datasource": {"type": "prometheus", "uid": ds_uid}},
                {"expr": f'playwright_tests_flaky{{{REPO}}}',       "legendFormat": "Flaky",   "refId": "B", "datasource": {"type": "prometheus", "uid": ds_uid}},
            ],
            x=12, y=21, w=12, h=8,
        ),
    ]

    return {
        "uid":           DASHBOARD_UID,
        "title":         DASHBOARD_TITLE,
        "tags":          ["playwright", "automation", "testing"],
        "timezone":      "browser",
        "schemaVersion": 39,
        "version":       1,
        "refresh":       "5m",
        "time":          {"from": "now-30d", "to": "now"},
        "templating":    {"list": [repo_var, branch_var]},
        "panels":        panels,
    }


# ── Provision ─────────────────────────────────────────────────────────────────

def main():
    base_url = os.environ.get("GRAFANA_INSTANCE_URL", "").rstrip("/").strip()
    token    = os.environ.get("GRAFANA_SERVICE_ACCOUNT_TOKEN", "").strip()

    if not (base_url and token):
        print("[INFO] GRAFANA_INSTANCE_URL / GRAFANA_SERVICE_ACCOUNT_TOKEN not set — skipping dashboard provisioning.")
        sys.exit(0)

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type":  "application/json",
    }

    folder_title = os.environ.get("GRAFANA_FOLDER_TITLE", "Playwright")

    ds_uid    = get_prometheus_datasource_uid(base_url, headers)
    folder_uid = get_or_create_folder(base_url, headers, folder_title)
    dashboard  = build_dashboard(ds_uid)

    payload = {
        "dashboard": dashboard,
        "overwrite": True,
        "message":   f"Auto-provisioned by playwright-tests workflow",
    }
    if folder_uid:
        payload["folderUid"] = folder_uid

    try:
        resp = requests.post(
            f"{base_url}/api/dashboards/db",
            headers=headers,
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        result = resp.json()
        dashboard_url = base_url + result.get("url", "")
        print(f"[INFO] Dashboard provisioned successfully.")
        print(f"[INFO] Dashboard URL: {dashboard_url}")
    except Exception as e:
        print(f"[ERROR] Dashboard provisioning failed: {e}", file=sys.stderr)
        if hasattr(e, "response") and e.response is not None:
            print(f"[ERROR] Response: {e.response.text}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
