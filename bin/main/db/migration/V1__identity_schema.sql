-- =============================================================================
-- OpenWave Identity Registry — V1 Schema
-- =============================================================================
-- Stores only routing data. No KYC, no balances, no transaction history.
-- =============================================================================

-- Registered banks (the authoritative phonebook: bank_handle → core_url)
CREATE TABLE registered_banks (
    id                  BIGSERIAL PRIMARY KEY,
    bank_handle         VARCHAR(20)  NOT NULL UNIQUE,   -- e.g. "andalus"
    display_name        VARCHAR(100) NOT NULL,
    country             CHAR(2)      NOT NULL,          -- ISO 3166-1 alpha-2
    core_url            VARCHAR(500) NOT NULL,
    contact_email       VARCHAR(255) NOT NULL,
    api_key_hash        VARCHAR(64)  NOT NULL,          -- SHA-256 of issued key
    active              BOOLEAN      NOT NULL DEFAULT TRUE,
    registered_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banks_handle  ON registered_banks (bank_handle);
CREATE INDEX idx_banks_country ON registered_banks (country);

-- Global NPT identities
CREATE TABLE npt_identities (
    id                  BIGSERIAL    PRIMARY KEY,
    npt_handle          VARCHAR(32)  NOT NULL UNIQUE,   -- e.g. "mtellesy"
    display_name        VARCHAR(100) NOT NULL,
    status              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | SUSPENDED | DELETED
    default_bank_handle VARCHAR(20)  REFERENCES registered_banks (bank_handle),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_handle_format CHECK (npt_handle ~ '^[a-z0-9_.\-]{3,32}$'),
    CONSTRAINT chk_status        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED'))
);

CREATE INDEX idx_identity_handle ON npt_identities (npt_handle);
CREATE INDEX idx_identity_status ON npt_identities (status);

-- Bank accounts linked to an identity (one per bank per identity)
CREATE TABLE linked_accounts (
    id                  BIGSERIAL    PRIMARY KEY,
    identity_id         BIGINT       NOT NULL REFERENCES npt_identities (id) ON DELETE CASCADE,
    bank_handle         VARCHAR(20)  NOT NULL REFERENCES registered_banks (bank_handle),
    iban                VARCHAR(34)  NOT NULL,
    bank_customer_ref   VARCHAR(100) NOT NULL,          -- bank's internal ref, private
    is_default          BOOLEAN      NOT NULL DEFAULT FALSE,
    linked_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (identity_id, bank_handle)
);

CREATE INDEX idx_linked_identity   ON linked_accounts (identity_id);
CREATE INDEX idx_linked_bank       ON linked_accounts (bank_handle);
CREATE INDEX idx_linked_iban       ON linked_accounts (iban);
