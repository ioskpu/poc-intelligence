# TypeScript Models

These interfaces are documentation only. They must not be imported by runtime
code.

## Shared Types

```ts
export type AssetClass =
  | "crypto"
  | "futures"
  | "equity_index"
  | "commodity"
  | "fx";

export type MarketStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "deprecated";

export type MarketRegime =
  | "trending"
  | "ranging"
  | "volatile"
  | "unstable";

export type ISO8601Timestamp = string;

export interface Pagination {
  limit: number;
  next_cursor: string | null;
}

export interface ListResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
```

## Market

```ts
export interface Market {
  symbol: string;
  exchange: string;
  asset_class: AssetClass;
  status: MarketStatus;
}
```

## Opportunity Score

```ts
export interface OpportunityScore {
  symbol: string;
  score: number;
  confidence: number;
  sample_size: number;
  updated_at: ISO8601Timestamp;
}
```

## Market Regime

```ts
export interface MarketRegimeResult {
  symbol: string;
  regime: MarketRegime;
  confidence: number;
  updated_at: ISO8601Timestamp;
}
```

## Pattern Ranking

```ts
export interface PatternRanking {
  pattern_id: string;
  symbol: string;
  profit_factor: number;
  sharpe: number;
  win_rate: number;
  sample_size: number;
}
```

## Endpoint Response Types

```ts
export type MarketsResponse = ListResponse<Market>;

export type OpportunitiesResponse = ListResponse<OpportunityScore>;

export type RegimesResponse = ListResponse<MarketRegimeResult>;

export type PatternsResponse = ListResponse<PatternRanking>;
```

## Endpoint Query Types

```ts
export interface MarketsQuery {
  symbol?: string;
  exchange?: string;
  asset_class?: AssetClass;
  status?: MarketStatus;
  limit?: number;
  cursor?: string;
}

export interface OpportunitiesQuery {
  symbol?: string;
  asset_class?: AssetClass;
  min_score?: number;
  min_confidence?: number;
  updated_after?: ISO8601Timestamp;
  updated_before?: ISO8601Timestamp;
  limit?: number;
  cursor?: string;
}

export interface RegimesQuery {
  symbol?: string;
  regime?: MarketRegime;
  min_confidence?: number;
  updated_after?: ISO8601Timestamp;
  updated_before?: ISO8601Timestamp;
  limit?: number;
  cursor?: string;
}

export interface PatternsQuery {
  symbol?: string;
  pattern_id?: string;
  min_profit_factor?: number;
  min_sharpe?: number;
  min_win_rate?: number;
  min_sample_size?: number;
  limit?: number;
  cursor?: string;
}
```
