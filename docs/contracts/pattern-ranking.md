# Pattern Ranking Contract

## Purpose

Pattern rankings expose statistical patterns discovered by Futures Lab and rank
them by quality, reliability and sample adequacy.

Patterns are research outputs. They are not trade instructions.

## Ranking Criteria

Recommended ranking inputs:

- `profit_factor`.
- `sharpe`.
- `win_rate`.
- `sample_size`.
- Stability across recent windows.
- Consistency across related markets or regimes.

No single metric should fully determine rank. Futures Lab owns the ranking
algorithm and should return already ranked results.

## Minimum Sample Size

Default minimum sample size: `100`.

Pattern results below the minimum should not be returned in standard responses.
If an exploratory endpoint later includes low-sample patterns, it must mark
them clearly and keep them out of default rankings.

## Stability Requirements

A ranked pattern should meet all baseline requirements:

- Positive sample size above the configured minimum.
- No known data quality failure in the evaluation window.
- Performance metrics not dominated by a single outlier event.
- Stable enough across recent windows to avoid one-period artifacts.

## Return Shape

```json
{
  "pattern_id": "PAT-0001",
  "symbol": "BTCUSDT",
  "profit_factor": 1.41,
  "sharpe": 1.18,
  "win_rate": 0.56,
  "sample_size": 920
}
```

## Validation Rules

- `pattern_id` must be stable across snapshots for the same discovered pattern.
- `profit_factor` must be a positive number.
- `sharpe` must be a finite number.
- `win_rate` must be a number between `0` and `1`.
- `sample_size` must be a positive integer and should meet the minimum sample
  size for default rankings.

## Frontend Interpretation

The frontend may rank patterns in the order returned by the API.

The frontend should display sample size near performance metrics to reduce
misinterpretation of low-evidence patterns.
