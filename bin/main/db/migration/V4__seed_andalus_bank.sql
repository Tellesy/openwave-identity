-- =============================================================================
-- OpenWave Identity Registry — V4 Seed Data
-- =============================================================================
-- Register Andalus Bank for development/testing
-- =============================================================================

-- Insert Andalus Bank with API key hash
-- API Key: owbk_andalus_h6lf7FR_gywgqUD1bdvlUbTRLcg8dhLsJxn_0Mgyjig
-- SHA-256 Hash: computed below
INSERT INTO registered_banks (
    bank_handle,
    display_name,
    country,
    core_url,
    contact_email,
    api_key_hash,
    active
) VALUES (
    'andalus',
    'Andalus Bank',
    'LY',
    'http://localhost:7003',
    'tech@andalusbank.ly',
    -- SHA-256 of 'owbk_andalus_h6lf7FR_gywgqUD1bdvlUbTRLcg8dhLsJxn_0Mgyjig'
    'e2f7be4108caddfdae391e52baab730f0c767eff9c90d704b5a91cc9187645e8',
    true
) ON CONFLICT (bank_handle) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    core_url = EXCLUDED.core_url,
    updated_at = NOW();
