export const BETA_SESSION_COOKIE_NAME = "poc-beta-session";

export const BETA_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

export type BetaAccessRole = "user" | "admin";

export type BetaAccessStatus = "Active" | "Revoked";

export type BetaAccount = {
  id: string;
  email: string;
  name: string;
  role: BetaAccessRole;
  status: BetaAccessStatus;
};

export type BetaSession = {
  account: BetaAccount;
  expiresAt: string;
};
