# Opportunity Score Contract

## Purpose

Opportunity scores summarize the statistical attractiveness of a market at a
given evaluation time.

The score is an intelligence signal only. It is not financial advice and does
not indicate that a trade should be opened.

## Score Range

`score` is an integer from `0` to `100`.

- `0-39`: low statistical opportunity.
- `40-69`: moderate statistical opportunity.
- `70-84`: strong statistical opportunity.
- `85-100`: exceptional statistical opportunity.

## Calculation Philosophy

The score should combine multiple quantitative inputs rather than a single
metric. Futures Lab owns the calculation.

Recommended inputs:

- Pattern quality.
- Regime alignment.
- Historical stability.
- Recent signal consistency.
- Data freshness.
- Sample adequacy.

The score should be calibrated so a higher value means stronger statistical
evidence, not larger expected profit.

## Interpretation

`confidence` is a decimal from `0` to `1` describing the reliability of the
score estimate. It should account for sample size, data quality and model
stability.

`sample_size` is the number of observations used to compute the score.

`updated_at` is the UTC timestamp when Futures Lab generated the value.

## Return Shape

```json
{
  "symbol": "BTCUSDT",
  "score": 91,
  "confidence": 0.82,
  "sample_size": 1240,
  "updated_at": "2026-06-07T20:30:00Z"
}
```

## Validation Rules

- `score` must be an integer between `0` and `100`.
- `confidence` must be a number between `0` and `1`.
- `sample_size` must be a positive integer.
- `updated_at` must be ISO 8601 in UTC.
- Scores with insufficient samples should either be excluded or returned with
  low confidence.

## Frontend Interpretation

The frontend may sort opportunities by `score` descending, then by `confidence`
descending.

The frontend must display score and confidence as statistical context and must
not label scores as buy, sell or trade instructions.
