# OpenWave Identity UI

Admin portal for the OpenWave Identity Registry.

## Registry Endpoint

Production builds use same-origin `/v1` by default, so the UI can be served by the registry service without exposing an environment-specific URL in the login form.

Deployment options:

- Build-time override: `VITE_OPENWAVE_REGISTRY_URL=https://identity.example.com/v1 npm run build`
- Runtime override before the app loads: `window.OPENWAVE_REGISTRY_URL = 'https://identity.example.com/v1'`
- Local dev proxy target: `OPENWAVE_REGISTRY_PROXY_TARGET=http://localhost:8095 npm run dev`

The login screen keeps endpoint editing behind an advanced control for support/dev use only.
