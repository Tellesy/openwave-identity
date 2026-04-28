-- =============================================================================
-- OpenWave Identity Registry — V3 Schema Migration
-- =============================================================================
-- Add national_id (12-digit Libyan NID) and phone to npt_identities.
-- These are the BINDING identity anchors across banks.
--
-- Rules:
--   • national_id is UNIQUE per identity — one person, one handle.
--   • When a new bank claims a handle that already exists, it MUST supply
--     the same national_id to prove it's the same person.
--   • phone is optional but recommended for OTP/notification.
-- =============================================================================

-- 1. Add national_id (nullable initially so existing rows don't break)
ALTER TABLE npt_identities ADD COLUMN IF NOT EXISTS national_id VARCHAR(12);

-- 2. Add phone
ALTER TABLE npt_identities ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 3. Unique constraint on national_id (one identity per NID, NULLs excluded)
CREATE UNIQUE INDEX IF NOT EXISTS idx_identity_national_id
    ON npt_identities (national_id)
    WHERE national_id IS NOT NULL;

-- 4. Index for fast phone lookup
CREATE INDEX IF NOT EXISTS idx_identity_phone
    ON npt_identities (phone)
    WHERE phone IS NOT NULL;
