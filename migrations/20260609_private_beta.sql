CREATE TABLE IF NOT EXISTS private_beta_requests (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  experience_level text NOT NULL,
  interest_text text,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT private_beta_requests_status_check
    CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

CREATE INDEX IF NOT EXISTS private_beta_requests_status_created_at_idx
  ON private_beta_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS private_beta_requests_created_at_idx
  ON private_beta_requests (created_at DESC);

CREATE TABLE IF NOT EXISTS private_beta_events (
  id text PRIMARY KEY,
  event_name text NOT NULL,
  request_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT private_beta_events_request_id_fk
    FOREIGN KEY (request_id)
    REFERENCES private_beta_requests (id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS private_beta_events_created_at_idx
  ON private_beta_events (created_at DESC);

CREATE INDEX IF NOT EXISTS private_beta_events_request_id_idx
  ON private_beta_events (request_id);
