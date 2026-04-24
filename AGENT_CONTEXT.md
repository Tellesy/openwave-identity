# OpenWave Identity Registry — Agent Context & Continuation Guide

> **For AI agents:** Read this before touching any code in this project.
> Master ecosystem map: `/Users/mtellesy/GitHub/nexus.mw/AGENT_CONTEXT.md`
> Last updated: April 2026

---

## What is this project?

**openwave-identity** is the open-source reference implementation of the **OpenWave Identity Registry** — the global service that maps NPT (National Payment Tag) handles to bank accounts, enabling universal payment routing across the Libyan banking network.

**Path:** `/Users/mtellesy/GitHub/openwave-identity`  
**Stack:** Kotlin + Spring Boot 3  
**Purpose:** Global NPT handle ownership, multi-bank account linking, public alias resolution, cross-gateway federation  
**Implements:** `openwave-identity-v1.0.yaml` from `/Users/mtellesy/GitHub/openwave-spec`  
**Operated by:** Neptune Fintech (future stewardship: Central Bank of Libya)

---

## Related Projects

| Project | Path | Relationship |
|---|---|---|
| **openwave-spec** | `/Users/mtellesy/GitHub/openwave-spec` | Defines `openwave-identity-v1.0.yaml` which this implements |
| **neptune-astro** | `/Users/mtellesy/GitHub/neptune-astro` | Gateway that queries this registry for cross-bank alias resolution |
| **nexus.mw** | `/Users/mtellesy/GitHub/nexus.mw` | Bank middleware; banks enroll aliases through NAD (separate from this registry) |
| **andalus** | `/Users/mtellesy/GitHub/ethaq/andalus` | Andalus Bank backend — customers enroll NPT handles through their bank |

---

## How It Works

```
                     OpenWave Identity Registry (this project)
                            ┌─────────────────────┐
Handle: mtellesy            │  handle → accounts   │
 └── @andalus: LY83002700.. │                      │
 └── @nub:     LY92010500.. │  bank-vouched         │
                            │  KYC-backed           │
                            └─────────────────────┘
                                      ▲
                      ┌───────────────┴───────────────┐
                      │                               │
             neptune-astro                   any other
             (resolves alias before           OpenWave gateway
              sending LyPay)
```

### NPT Handle Format

| Format | Resolves to |
|---|---|
| `mtellesy` | Owner's **default** bank account |
| `mtellesy@andalus` | Specifically the Andalus account |
| `mtellesy@nub` | Specifically the NUB account |

### Key Properties
- **First-come, first-served** — handles are globally unique, claimed through bank KYC
- **Bank-vouched** — a bank must vouch for the customer before a handle is registered
- **Governance-first** — banks can flag disputes; handles can be locked by governance
- **No financial data stored** — only IBAN + bank handle routing data (no balances, no transactions)
- **Cross-gateway federation** — any compliant gateway queries this registry

---

## API (implements openwave-identity-v1.0.yaml)

| Method | Path | Description |
|---|---|---|
| `POST` | `/identity/handles` | Register an NPT handle (bank-vouched) |
| `GET` | `/identity/resolve/{alias}` | Resolve alias → IBAN + bank handle |
| `GET` | `/identity/handles/{alias}` | Get handle details + linked accounts |
| `POST` | `/identity/handles/{alias}/accounts` | Link additional bank account |
| `DELETE` | `/identity/handles/{alias}` | Deactivate a handle |
| `GET` | `/identity/banks` | List all registered banks (phonebook) |
| `POST` | `/identity/banks` | Register a bank (governance) |
| `GET` | `/identity/banks/{handle}` | Bank details |

---

## Integration with neptune-astro

neptune-astro queries this registry during alias resolution:

```
1. Customer enters "mtellesy@andalus" at checkout
2. Astro first checks its local alias store
3. If not found → queries openwave-identity at registry.openwave.ly
4. Registry returns { iban: "LY83002700...", bank_handle: "andalus" }
5. Astro proceeds with payment routing
```

Controlled by env var in neptune-astro: `IDENTITY_REGISTRY_ENABLED=true`  
Registry URL configured as: `IDENTITY_REGISTRY_URL=https://registry.openwave.ly`

When enrollment happens in Astro, it auto-syncs to this registry if enabled.

---

## Pending / Next Steps

- Implement governance endpoints (handle dispute, handle lock/unlock)
- Add cross-gateway handle federation (allow other compliant gateways to query)
- Add rate limiting on public resolution endpoint
- Production deployment setup (currently operated by Neptune Fintech)
