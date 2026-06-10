ALTER TABLE private_beta_requests
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by text,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS invite_sent_at timestamptz;

CREATE TABLE IF NOT EXISTS private_beta_accounts (
  id text PRIMARY KEY,
  request_id text REFERENCES private_beta_requests (id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  status text NOT NULL DEFAULT 'Active',
  approved_at timestamptz,
  revoked_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT private_beta_accounts_role_check
    CHECK (role IN ('user', 'admin')),
  CONSTRAINT private_beta_accounts_status_check
    CHECK (status IN ('Active', 'Revoked'))
);

CREATE INDEX IF NOT EXISTS private_beta_accounts_email_idx
  ON private_beta_accounts (email);

CREATE INDEX IF NOT EXISTS private_beta_accounts_status_role_idx
  ON private_beta_accounts (status, role);

CREATE TABLE IF NOT EXISTS private_beta_login_tokens (
  id text PRIMARY KEY,
  account_id text NOT NULL REFERENCES private_beta_accounts (id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  redirect_path text NOT NULL DEFAULT '/dashboard',
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS private_beta_login_tokens_account_idx
  ON private_beta_login_tokens (account_id, created_at DESC);

CREATE INDEX IF NOT EXISTS private_beta_login_tokens_expires_idx
  ON private_beta_login_tokens (expires_at);

CREATE TABLE IF NOT EXISTS private_beta_sessions (
  id text PRIMARY KEY,
  account_id text NOT NULL REFERENCES private_beta_accounts (id) ON DELETE CASCADE,
  session_token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS private_beta_sessions_account_idx
  ON private_beta_sessions (account_id, created_at DESC);

CREATE INDEX IF NOT EXISTS private_beta_sessions_expires_idx
  ON private_beta_sessions (expires_at);
