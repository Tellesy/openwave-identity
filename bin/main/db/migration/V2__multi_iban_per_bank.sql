-- =============================================================================
-- OpenWave Identity Registry — V2 Schema Migration
-- =============================================================================
-- Allow multiple IBANs per bank per identity.
-- Previously: UNIQUE(identity_id, bank_handle) — one row per bank.
-- Now:        UNIQUE(identity_id, iban)          — one row per IBAN, many per bank.
--
-- Rules:
--   • A customer can have multiple IBANs at the same bank.
--   • IBAN is globally unique per identity (can't link same IBAN twice).
--   • Each bank has at most ONE default IBAN per identity (enforced in service).
--   • The identity's default_bank_handle remains: which bank resolves with no @bank suffix.
-- =============================================================================

-- 1. Drop the old UNIQUE constraint (identity_id, bank_handle)
ALTER TABLE linked_accounts DROP CONSTRAINT IF EXISTS linked_accounts_identity_id_bank_handle_key;
ALTER TABLE linked_accounts DROP CONSTRAINT IF EXISTS uk8i9umub1byk43cmjwmsvb6ryy;

-- 2. Add a display_name column to linked_accounts (optional label per IBAN)
ALTER TABLE linked_accounts ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- 3. Add currency column (per IBAN, not per bank)
ALTER TABLE linked_accounts ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'LYD';

-- 4. New UNIQUE: one identity cannot register the same IBAN twice (globally)
ALTER TABLE linked_accounts ADD CONSTRAINT linked_accounts_identity_iban_unique UNIQUE (identity_id, iban);

-- 5. New index on (identity_id, bank_handle, is_default) for fast default lookup
CREATE INDEX IF NOT EXISTS idx_linked_bank_default ON linked_accounts (identity_id, bank_handle, is_default);
