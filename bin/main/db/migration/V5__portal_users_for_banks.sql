ALTER TABLE registered_banks
    ADD COLUMN IF NOT EXISTS portal_username VARCHAR(80) UNIQUE,
    ADD COLUMN IF NOT EXISTS portal_password_hash VARCHAR(255);

UPDATE registered_banks
SET portal_username = COALESCE(portal_username, bank_handle || '_admin'),
    portal_password_hash = COALESCE(
        portal_password_hash,
        '$2y$10$DvtYEQ7r.QDRJ.zSoIIZCOd5c965frg4V/xPX1KPiqKKyltZzvbIq'
    )
WHERE bank_handle = 'andalus';
