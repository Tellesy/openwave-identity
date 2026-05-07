CREATE TABLE IF NOT EXISTS portal_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    bank_handle VARCHAR(20),
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_portal_users_bank_handle ON portal_users(bank_handle);
CREATE INDEX IF NOT EXISTS idx_portal_users_role ON portal_users(role);

INSERT INTO portal_users (username, password_hash, role, bank_handle, display_name, email)
SELECT portal_username, portal_password_hash, 'BANK_ADMIN', bank_handle, display_name || ' Admin', contact_email
FROM registered_banks
WHERE portal_username IS NOT NULL
  AND portal_password_hash IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM portal_users u WHERE u.username = registered_banks.portal_username
  );
