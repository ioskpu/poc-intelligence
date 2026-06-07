# Market Intelligence API Specification

## Scope

This document defines the proposed read-only API contract between Futures Lab
and POC Intelligence.

No backend implementation is included in this phase.

## General Rules

- API version prefix: `/api/v1`.
- All responses use JSON.
- All timestamps use ISO 8601 UTC.
- All endpoints are read-only in this contract.
- Frontend code must consume these endpoints through `src/services/api`.
- The API must not expose trade execution or advisory actions.

## Pagination Strategy

List endpoints should support cursor pagination.

Request parameters:

- `limit`: optional integer, default `50`, maximum `200`.
- `cursor`: optional opaque string returned by the previous response.

Response envelope:

```json
{
  "data": [],
  "pagination": {
    "limit": 50,
    "next_cursor": "opaque-cursor-or-null"
  }
}
```

`next_cursor` is `null` when no additional page exists.

## Filtering Strategy

Filters should be expressed as query parameters. Unknown filters should return a
`400 Bad Request` response rather than being silently ignored.

Common filters:

- `symbol`
- `exchange`
- `asset_class`
- `status`
- `updated_after`
- `updated_before`

## Endpoint: List Markets

`GET /api/v1/markets`

### Request

Query parameters:

- `symbol`: optional exact symbol.
- `exchange`: optional exact exchange.
- `asset_class`: optional asset class.
- `status`: optional market status.
- `limit`: optional page size.
- `cursor`: optional pagination cursor.

### Response

```json
{
  "data": [
    {
      "symbol": "BTCUSDT",
      "exchange": "BINANCE",
      "asset_class": "crypto",
      "status": "active"
    }
  ],
  "pagination": {
    "limit": 50,
    "next_cursor": null
  }
}
```

## Endpoint: List Opportunities

`GET /api/v1/opportunities`

### Request

Query parameters:

- `symbol`: optional exact symbol.
- `asset_class`: optional asset class.
- `min_score`: optional integer from `0` to `100`.
- `min_confidence`: optional number from `0` to `1`.
- `updated_after`: optional ISO 8601 timestamp.
- `updated_before`: optional ISO 8601 timestamp.
- `limit`: optional page size.
- `cursor`: optional pagination cursor.

### Response

```json
{
  "data": [
    {
      "symbol": "BTCUSDT",
      "score": 91,
      "confidence": 0.82,
      "sample_size": 1240,
      "updated_at": "2026-06-07T20:30:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "next_cursor": null
  }
}
```

## Endpoint: List Regimes

`GET /api/v1/regimes`

### Request

Query parameters:

- `symbol`: optional exact symbol.
- `regime`: optional value of `trending`, `ranging`, `volatile` or `unstable`.
- `min_confidence`: optional number from `0` to `1`.
- `updated_after`: optional ISO 8601 timestamp.
- `updated_before`: optional ISO 8601 timestamp.
- `limit`: optional page size.
- `cursor`: optional pagination cursor.

### Response

```json
{
  "data": [
    {
      "symbol": "BTCUSDT",
      "regime": "trending",
      "confidence": 0.77,
      "updated_at": "2026-06-07T20:30:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "next_cursor": null
  }
}
```

## Endpoint: List Patterns

`GET /api/v1/patterns`

### Request

Query parameters:

- `symbol`: optional exact symbol.
- `pattern_id`: optional exact pattern identifier.
- `min_profit_factor`: optional positive number.
- `min_sharpe`: optional number.
- `min_win_rate`: optional number from `0` to `1`.
- `min_sample_size`: optional positive integer, default `100`.
- `limit`: optional page size.
- `cursor`: optional pagination cursor.

### Response

```json
{
  "data": [
    {
      "pattern_id": "PAT-0001",
      "symbol": "BTCUSDT",
      "profit_factor": 1.41,
      "sharpe": 1.18,
      "win_rate": 0.56,
      "sample_size": 920
    }
  ],
  "pagination": {
    "limit": 50,
    "next_cursor": null
  }
}
```

## Error Response

Errors should use a consistent shape:

```json
{
  "error": {
    "code": "invalid_filter",
    "message": "Unsupported filter: foo"
  }
}
```

Recommended status codes:

- `400`: invalid request or unsupported filter.
- `404`: requested symbol or resource does not exist.
- `429`: rate limit exceeded.
- `500`: internal service error.
- `503`: Futures Lab data temporarily unavailable.
