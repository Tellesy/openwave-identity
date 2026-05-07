const envUrl = import.meta.env.VITE_OPENWAVE_REGISTRY_URL;

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  if (trimmed.startsWith('/')) return trimmed;
  try {
    return new URL(trimmed).toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
}

export function configuredRegistryUrl() {
  const runtimeUrl = typeof window !== 'undefined' ? window.OPENWAVE_REGISTRY_URL : null;
  return normalizeUrl(runtimeUrl) || normalizeUrl(envUrl) || '/v1';
}

export function savedRegistryUrl() {
  if (typeof localStorage === 'undefined') return configuredRegistryUrl();
  return normalizeUrl(localStorage.getItem('ow_registry_url_override')) || configuredRegistryUrl();
}

export function saveRegistryOverride(value) {
  if (typeof localStorage === 'undefined') return configuredRegistryUrl();
  const normalized = normalizeUrl(value);
  if (normalized && normalized !== configuredRegistryUrl()) {
    localStorage.setItem('ow_registry_url_override', normalized);
    return normalized;
  }
  localStorage.removeItem('ow_registry_url_override');
  return configuredRegistryUrl();
}
