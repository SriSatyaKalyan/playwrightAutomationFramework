#!/usr/bin/env python3
"""
generate_metrics_dashboard.py
------------------------------
Reads reports/test-metrics.json (written by parse_test_metrics.py) and
produces a self-contained HTML artifact dashboard styled like Grafana.
No external Python dependencies — Chart.js is loaded via CDN.

Usage (CI):
    python3 .github/scripts/generate_metrics_dashboard.py

Env vars (optional overrides):
    METRICS_JSON_PATH   default: reports/test-metrics.json
    DASHBOARD_OUT_PATH  default: reports/metrics-dashboard/index.html
"""

import json
import os
import sys
from datetime import datetime, timezone

METRICS_JSON  = os.environ.get("METRICS_JSON_PATH",  "reports/test-metrics.json")
DASHBOARD_OUT = os.environ.get("DASHBOARD_OUT_PATH", "reports/metrics-dashboard/index.html")


def load_metrics() -> dict:
    if not os.path.exists(METRICS_JSON):
        print(f"[WARN] {METRICS_JSON} not found — using zeroed metrics.", file=sys.stderr)
        return {
            "passed": 0, "failed": 0, "flaky": 0, "skipped": 0,
            "total": 0, "duration_ms": 0, "duration_sec": 0,
            "pass_rate": 0, "fail_rate": 0,
            "retry_count": 0, "avg_duration_ms": 0, "max_duration_ms": 0,
            "run_id": "N/A", "run_number": "N/A", "branch": "N/A",
            "repository": "N/A", "actor": "N/A", "commit_sha": "N/A",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    with open(METRICS_JSON) as f:
        return json.load(f)


def status_color(pass_rate: float) -> str:
    if pass_rate >= 90:
        return "#73BF69"   # Grafana green
    if pass_rate >= 70:
        return "#F2CC0C"   # Grafana yellow
    return "#F2495C"       # Grafana red


def fmt_ms(ms: float) -> str:
    """Format milliseconds into a human-readable string."""
    if ms >= 60_000:
        return f"{ms / 60_000:.1f}m"
    if ms >= 1_000:
        return f"{ms / 1_000:.1f}s"
    return f"{ms:.0f}ms"


def build_html(m: dict) -> str:
    color      = status_color(m["pass_rate"])
    ts         = m.get("timestamp", "")[:19].replace("T", " ") + " UTC"
    pass_rate  = f'{m.get("pass_rate", 0):.1f}%'
    fail_rate  = f'{m.get("fail_rate", 0):.1f}%'

    passed          = m.get("passed",          0)
    failed          = m.get("failed",          0)
    flaky           = m.get("flaky",           0)
    skipped         = m.get("skipped",         0)
    total           = m.get("total",           0)
    retry_count     = m.get("retry_count",     0)
    duration_ms     = m.get("duration_ms",     0)
    avg_duration_ms = m.get("avg_duration_ms", 0)
    max_duration_ms = m.get("max_duration_ms", 0)

    total_duration  = fmt_ms(duration_ms)
    avg_duration    = fmt_ms(avg_duration_ms)
    max_duration    = fmt_ms(max_duration_ms)

    # pass_rate numeric for gauge arc
    pass_rate_num = m.get("pass_rate", 0)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Playwright Metrics Dashboard — {m.get("repository","")}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
  <style>
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{background:#111217;color:#d8d9da;font-family:'Helvetica Neue',Arial,sans-serif;padding:24px}}
    h1{{color:#e6e6e6;font-size:1.5rem;margin-bottom:4px;display:flex;align-items:center;gap:10px}}
    .subtitle{{color:#6e9fff;font-size:.82rem;margin-bottom:24px}}
    /* ── Stat cards ── */
    .section-label{{font-size:.7rem;color:#6e6e6e;text-transform:uppercase;letter-spacing:.1em;margin:20px 0 8px}}
    .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:8px}}
    .card{{background:#181b1f;border:1px solid #2c2f34;border-radius:6px;padding:16px 14px}}
    .card .label{{font-size:.68rem;color:#8e8e8e;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}}
    .card .value{{font-size:2.1rem;font-weight:700;line-height:1}}
    .card .sub{{font-size:.72rem;color:#6e6e6e;margin-top:5px}}
    /* ── Charts ── */
    .charts{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:8px}}
    .chart-card{{background:#181b1f;border:1px solid #2c2f34;border-radius:6px;padding:16px}}
    .chart-card h3{{font-size:.7rem;color:#8e8e8e;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px}}
    canvas{{max-height:200px}}
    /* ── Pass-rate gauge ── */
    .gauge-wrap{{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}}
    .gauge-value{{font-size:2.4rem;font-weight:700;margin-top:-32px;color:{color}}}
    .gauge-label{{font-size:.72rem;color:#6e6e6e;margin-top:4px}}
    /* ── Meta table ── */
    .meta{{background:#181b1f;border:1px solid #2c2f34;border-radius:6px;padding:14px 18px;font-size:.8rem;line-height:2}}
    .meta-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0 24px}}
    .meta span{{color:#6e9fff;display:inline-block;min-width:110px}}
    @media(max-width:700px){{.charts{{grid-template-columns:1fr}}}}
  </style>
</head>
<body>
  <h1>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2CC0C" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
    Playwright Metrics Dashboard
  </h1>
  <div class="subtitle">
    Run #{m.get("run_number","?")} &nbsp;·&nbsp;
    Branch: <strong>{m.get("branch","?")}</strong> &nbsp;·&nbsp;
    {ts}
  </div>

  <!-- ── Summary cards ── -->
  <div class="section-label">Test Results</div>
  <div class="grid">
    <div class="card">
      <div class="label">Total Tests</div>
      <div class="value" style="color:#e6e6e6">{total}</div>
      <div class="sub">this run</div>
    </div>
    <div class="card">
      <div class="label">Passed</div>
      <div class="value" style="color:#73BF69">{passed}</div>
      <div class="sub">pass rate {pass_rate}</div>
    </div>
    <div class="card">
      <div class="label">Failed</div>
      <div class="value" style="color:#F2495C">{failed}</div>
      <div class="sub">fail rate {fail_rate}</div>
    </div>
    <div class="card">
      <div class="label">Flaky</div>
      <div class="value" style="color:#FF9830">{flaky}</div>
      <div class="sub">passed on retry</div>
    </div>
    <div class="card">
      <div class="label">Skipped</div>
      <div class="value" style="color:#F2CC0C">{skipped}</div>
      <div class="sub">not executed</div>
    </div>
    <div class="card">
      <div class="label">Retries</div>
      <div class="value" style="color:#a855f7">{retry_count}</div>
      <div class="sub">total retry attempts</div>
    </div>
  </div>

  <!-- ── Timing cards ── -->
  <div class="section-label">Timing</div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    <div class="card">
      <div class="label">Total Duration</div>
      <div class="value" style="color:#6e9fff">{total_duration}</div>
      <div class="sub">full suite run time</div>
    </div>
    <div class="card">
      <div class="label">Avg Test Duration</div>
      <div class="value" style="color:#6e9fff">{avg_duration}</div>
      <div class="sub">per test result</div>
    </div>
    <div class="card">
      <div class="label">Slowest Test</div>
      <div class="value" style="color:#6e9fff">{max_duration}</div>
      <div class="sub">single test result</div>
    </div>
  </div>

  <!-- ── Charts ── -->
  <div class="section-label">Breakdown</div>
  <div class="charts">
    <div class="chart-card">
      <h3>Result Distribution</h3>
      <canvas id="donutChart"></canvas>
    </div>
    <div class="chart-card">
      <h3>Test Counts</h3>
      <canvas id="barChart"></canvas>
    </div>
    <div class="chart-card">
      <h3>Pass Rate</h3>
      <div class="gauge-wrap">
        <canvas id="gaugeChart" style="max-height:180px"></canvas>
        <div class="gauge-value">{pass_rate}</div>
        <div class="gauge-label">target ≥ 90%</div>
      </div>
    </div>
  </div>

  <!-- ── Run metadata ── -->
  <div class="section-label">Run Info</div>
  <div class="meta">
    <div class="meta-grid">
      <div><span>Repository</span>{m.get("repository","N/A")}</div>
      <div><span>Branch</span>{m.get("branch","N/A")}</div>
      <div><span>Commit</span>{m.get("commit_sha","N/A")}</div>
      <div><span>Actor</span>{m.get("actor","N/A")}</div>
      <div><span>Run ID</span>{m.get("run_id","N/A")}</div>
      <div><span>Run #</span>{m.get("run_number","N/A")}</div>
      <div><span>Generated</span>{ts}</div>
    </div>
  </div>

  <script>
    const BORDER = '#111217';

    // Donut
    new Chart(document.getElementById('donutChart'), {{
      type: 'doughnut',
      data: {{
        labels: ['Passed','Failed','Flaky','Skipped'],
        datasets: [{{
          data: [{passed},{failed},{flaky},{skipped}],
          backgroundColor: ['#73BF69','#F2495C','#FF9830','#F2CC0C'],
          borderColor: BORDER,
          borderWidth: 3
        }}]
      }},
      options: {{
        plugins: {{ legend: {{ labels: {{ color:'#d8d9da', font:{{ size:12 }} }} }} }},
        cutout: '65%'
      }}
    }});

    // Bar
    new Chart(document.getElementById('barChart'), {{
      type: 'bar',
      data: {{
        labels: ['Passed','Failed','Flaky','Skipped'],
        datasets: [{{
          label: 'Tests',
          data: [{passed},{failed},{flaky},{skipped}],
          backgroundColor: ['#73BF69','#F2495C','#FF9830','#F2CC0C'],
          borderRadius: 4
        }}]
      }},
      options: {{
        plugins: {{ legend: {{ display: false }} }},
        scales: {{
          x: {{ ticks:{{ color:'#8e8e8e' }}, grid:{{ color:'#2c2f34' }} }},
          y: {{ ticks:{{ color:'#8e8e8e' }}, grid:{{ color:'#2c2f34' }}, beginAtZero:true }}
        }}
      }}
    }});

    // Gauge (doughnut arc trick)
    const pr = {pass_rate_num};
    new Chart(document.getElementById('gaugeChart'), {{
      type: 'doughnut',
      data: {{
        datasets: [{{
          data: [pr, 100 - pr],
          backgroundColor: ['{color}', '#2c2f34'],
          borderColor: BORDER,
          borderWidth: 2
        }}]
      }},
      options: {{
        circumference: 180,
        rotation: -90,
        cutout: '70%',
        plugins: {{ legend: {{ display: false }}, tooltip: {{ enabled: false }} }}
      }}
    }});
  </script>
</body>
</html>
"""


def main():
    m    = load_metrics()
    html = build_html(m)
    out_dir = os.path.dirname(DASHBOARD_OUT)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(DASHBOARD_OUT, "w") as f:
        f.write(html)
    print(f"[INFO] Dashboard written to {DASHBOARD_OUT}")


if __name__ == "__main__":
    main()
