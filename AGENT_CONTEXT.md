# OpenWave Identity Registry — Agent Context & Continuation Guide

> **For AI agents:** Read this before touching any code in this project.
> Master ecosystem map: `/Users/mtellesy/GitHub/nexus.mw/AGENT_CONTEXT.md`
> Last updated: April 28, 2026

---

## What is this project?

**openwave-identity** is the centralized **OpenWave Identity Registry** — the global service that maps NPT (National Payment Tag) handles to bank accounts.

**CRITICAL IDENTITY FACTS:**
- This is NOT owned by any bank
- It is NOT part of Astro — it is a separate, independent service
- Currently operated by Neptune Fintech
- Future governance: Central Bank of Libya (CBL)
- Any bank can claim handles here using their `owbk_` key
- Resolution is public — any gateway can resolve a handle to an IBAN

**Path:** `/Users/mtellesy/GitHub/openwave-identity`  
**Port:** 8095 (currently running ✅)  
**Stack:** Kotlin + Spring Boot 3  
**Purpose:** Global NPT handle ownership, multi-bank multi-IBAN account linking, public alias resolution  
**Implements:** `openwave-identity-v1.0.yaml` from `/Users/mtellesy/GitHub/openwave-spec`

---

## Related Projects

| Project | Path | Relationship |
|---|---|---|
| **openwave-spec** | `/Users/mtellesy/GitHub/openwave-spec` | Defines `openwave-identity-v1.0.yaml` which this implements |
| **neptune-astro** | `/Users/mtellesy/GitHub/neptune-astro` | Gateway that queries this registry for cross-bank alias resolution (via nexus.mw proxy) |
| **nexus.mw** | `/Users/mtellesy/GitHub/nexus.mw` | Bank middleware; proxies OpenWave Identity calls for neptune-astro; banks enroll aliases through NAD (separate from this registry) |
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

## API (actual implemented endpoints — April 28, 2026)

| Method | Path | Description |
|---|---|---|
| `POST` | `/v1/identity/claim` | Claim NPT handle (bank-vouched, idempotent by IBAN) |
| `GET` | `/v1/identity/resolve?alias=` | Resolve alias → default IBAN for bank |
| `GET` | `/v1/identity/{nptHandle}` | Get identity + linked bank list |
| `GET` | `/v1/identity/{nptHandle}/accounts` | All linked accounts (all banks) |
| `GET` | `/v1/identity/{nptHandle}/accounts/{bankHandle}` | IBANs at specific bank |
| `POST` | `/v1/identity/{nptHandle}/accounts` | Link additional IBAN |
| `PATCH` | `/v1/identity/{nptHandle}/accounts/iban/{iban}` | Update an IBAN |
| `DELETE` | `/v1/identity/{nptHandle}/accounts/iban/{iban}` | Unlink an IBAN |
| `PATCH` | `/v1/identity/{nptHandle}/accounts/iban/{iban}/set-default` | Set default IBAN for a bank |
| `PATCH` | `/v1/identity/{nptHandle}/default-bank` | Set default bank for bare handle resolution |
| `DELETE` | `/v1/identity/{nptHandle}` | Delete/suspend identity |
| `GET` | `/v1/banks` | List registered banks |
| `POST` | `/v1/banks` | Register a bank |
| `GET` | `/v1/banks/{handle}` | Bank details |

## Multi-IBAN Rules (V2 migration — April 28, 2026)

- **Unique constraint:** `(identity_id, iban)` — NOT `(identity_id, bank_handle)`
- One user can have **many IBANs at the same bank**
- First IBAN per bank is automatically set as default
- `isDefault=true` picks which IBAN resolves for `username@bank`
- `defaultBankHandle` on identity picks which bank resolves for bare `username`
- Unlink default → next IBAN at that bank promoted automatically

---

## Integration with neptune-astro

neptune-astro talks to this registry in two ways:

**Enrollment (openwave-identity is SOURCE OF TRUTH):**
```
1. Bank staff enrolls customer via NexusHub → NexusMW → Astro
2. Astro calls POST /v1/identity/claim on this registry FIRST
3. Only if claim succeeds, Astro saves locally (routing cache)
4. If registry is down/disabled, enrollment is rejected
```

**Resolution (alias lookup):**
```
1. Customer enters "mtellesy@andalus" at checkout
2. Astro checks local cache first
3. If not found → queries openwave-identity GET /v1/identity/resolve?alias=mtellesy@andalus
4. Registry returns { iban, bank_handle, display_name, is_default }
5. Astro proceeds with payment routing
```

Env vars in neptune-astro:
- `IDENTITY_REGISTRY_ENABLED=true`
- `IDENTITY_REGISTRY_URL=http://localhost:8095/v1` (local dev)

---

## Pending / Next Steps

- Governance endpoints (handle dispute, lock/unlock)
- Cross-gateway federation (other compliant gateways querying this registry)
- Rate limiting on public resolution endpoint
- Production deployment + CBL handover planning
