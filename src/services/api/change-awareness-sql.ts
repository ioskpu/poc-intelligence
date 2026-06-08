export const SCANNER_CHANGE_SQL = `
WITH bounds AS (
  SELECT
    NOW() AS now_at,
    NOW() - INTERVAL '24 hours' AS current_start,
    NOW() - INTERVAL '48 hours' AS baseline_start
),
current_batch AS (
  SELECT scan_batch_id
  FROM futures_scanner_rankings, bounds
  WHERE scanned_at >= bounds.current_start
    AND scanned_at < bounds.now_at
  ORDER BY scanned_at DESC, rank_position ASC
  LIMIT 1
),
baseline_batch AS (
  SELECT scan_batch_id
  FROM futures_scanner_rankings, bounds
  WHERE scanned_at >= bounds.baseline_start
    AND scanned_at < bounds.current_start
  ORDER BY scanned_at DESC, rank_position ASC
  LIMIT 1
),
current_leader AS (
  SELECT symbol, score
  FROM futures_scanner_rankings
  WHERE scan_batch_id = (SELECT scan_batch_id FROM current_batch)
  ORDER BY rank_position ASC
  LIMIT 1
),
baseline_leader AS (
  SELECT symbol, score
  FROM futures_scanner_rankings
  WHERE scan_batch_id = (SELECT scan_batch_id FROM baseline_batch)
  ORDER BY rank_position ASC
  LIMIT 1
),
current_bias AS (
  SELECT
    COUNT(*) FILTER (WHERE direction_hint ILIKE '%long%') AS long_count,
    COUNT(*) FILTER (WHERE direction_hint ILIKE '%short%') AS short_count
  FROM futures_scanner_rankings, bounds
  WHERE scanned_at >= bounds.current_start
    AND scanned_at < bounds.now_at
),
baseline_bias AS (
  SELECT
    COUNT(*) FILTER (WHERE direction_hint ILIKE '%long%') AS long_count,
    COUNT(*) FILTER (WHERE direction_hint ILIKE '%short%') AS short_count
  FROM futures_scanner_rankings, bounds
  WHERE scanned_at >= bounds.baseline_start
    AND scanned_at < bounds.current_start
)
SELECT
  (SELECT symbol FROM current_leader) AS current_leader_symbol,
  (SELECT score FROM current_leader) AS current_leader_score,
  (SELECT long_count FROM current_bias) AS current_long_count,
  (SELECT short_count FROM current_bias) AS current_short_count,
  (SELECT symbol FROM baseline_leader) AS baseline_leader_symbol,
  (SELECT score FROM baseline_leader) AS baseline_leader_score,
  (SELECT long_count FROM baseline_bias) AS baseline_long_count,
  (SELECT short_count FROM baseline_bias) AS baseline_short_count
`;

export const DECISION_CHANGE_SQL = `
WITH bounds AS (
  SELECT
    NOW() AS now_at,
    NOW() - INTERVAL '24 hours' AS current_start,
    NOW() - INTERVAL '48 hours' AS baseline_start
),
current_types AS (
  SELECT decision_type, COUNT(*) AS row_count
  FROM futures_lab_decisions, bounds
  WHERE observed_at >= bounds.current_start
    AND observed_at < bounds.now_at
  GROUP BY decision_type
  ORDER BY row_count DESC, decision_type ASC
  LIMIT 1
),
baseline_types AS (
  SELECT decision_type, COUNT(*) AS row_count
  FROM futures_lab_decisions, bounds
  WHERE observed_at >= bounds.baseline_start
    AND observed_at < bounds.current_start
  GROUP BY decision_type
  ORDER BY row_count DESC, decision_type ASC
  LIMIT 1
)
SELECT
  (SELECT decision_type FROM current_types) AS current_type,
  (SELECT row_count FROM current_types) AS current_count,
  (SELECT decision_type FROM baseline_types) AS baseline_type,
  (SELECT row_count FROM baseline_types) AS baseline_count
`;

export const GHOST_CHANGE_SQL = `
WITH bounds AS (
  SELECT
    NOW() AS now_at,
    NOW() - INTERVAL '24 hours' AS current_start,
    NOW() - INTERVAL '48 hours' AS baseline_start
)
SELECT
  COUNT(*) FILTER (
    WHERE settled_at >= bounds.current_start
      AND settled_at < bounds.now_at
      AND status = 'settled'
  ) AS current_count,
  AVG(CASE
    WHEN settled_at >= bounds.current_start
      AND settled_at < bounds.now_at
      AND status = 'settled'
    THEN CASE WHEN hypothetical_pnl_pct > 0 THEN 1.0 ELSE 0.0 END
  END) AS current_positive_rate,
  COUNT(*) FILTER (
    WHERE settled_at >= bounds.baseline_start
      AND settled_at < bounds.current_start
      AND status = 'settled'
  ) AS baseline_count,
  AVG(CASE
    WHEN settled_at >= bounds.baseline_start
      AND settled_at < bounds.current_start
      AND status = 'settled'
    THEN CASE WHEN hypothetical_pnl_pct > 0 THEN 1.0 ELSE 0.0 END
  END) AS baseline_positive_rate
FROM futures_lab_ghost_tracks, bounds
`;
